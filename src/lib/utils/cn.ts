/**
 * Une clases condicionalmente sin dependencias externas.
 * Ignora valores falsy y colapsa espacios.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
