"use client";

const MAX_DIMENSION = 768;
const RECORDING_MS = 1_400;
const FRAME_INTERVAL_MS = 100;

function chooseMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No pudimos preparar la imagen."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

/**
 * El proxy del curso ofrece Gemini 2.5 Flash multimodal mediante una entrada
 * de video. Convertimos localmente la imagen en un clip de un solo fotograma;
 * el contenido visual no cambia y el archivo resultante es pequeño.
 */
export async function imageToAnalysisVideoDataUrl(file: File): Promise<string> {
  if (
    typeof MediaRecorder === "undefined" ||
    typeof document === "undefined"
  ) {
    throw new Error("Este navegador no permite analizar imágenes.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    bitmap.close();
    throw new Error("No pudimos preparar la imagen.");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const stream = canvas.captureStream(10);
  const mimeType = chooseMimeType();
  const recorder = new MediaRecorder(stream, {
    ...(mimeType ? { mimeType } : {}),
    videoBitsPerSecond: 650_000,
  });
  const chunks: BlobPart[] = [];

  const stopped = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => reject(new Error("No pudimos preparar la imagen."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
  });

  recorder.start(FRAME_INTERVAL_MS);
  const track = stream.getVideoTracks()[0] as MediaStreamTrack & {
    requestFrame?: () => void;
  };
  const frames = Math.ceil(RECORDING_MS / FRAME_INTERVAL_MS);
  for (let index = 0; index < frames; index += 1) {
    // Redibujar fuerza la emisión de cuadros incluso si la imagen es estática.
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    track.requestFrame?.();
    await new Promise((resolve) =>
      window.setTimeout(resolve, FRAME_INTERVAL_MS),
    );
  }
  recorder.stop();

  const blob = await stopped;
  bitmap.close();
  stream.getTracks().forEach((item) => item.stop());
  if (blob.size === 0) throw new Error("No pudimos preparar la imagen.");
  return blobToDataUrl(blob);
}
