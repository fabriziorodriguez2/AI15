import type { Currency } from "@/types";
import { formatCurrency } from "@/lib/utils/currency";

interface CurrencyAmountProps {
  amount: number;
  currency: Currency;
  className?: string;
}

/** Muestra un importe formateado en español de Uruguay. */
export function CurrencyAmount({
  amount,
  currency,
  className,
}: CurrencyAmountProps) {
  return <span className={className}>{formatCurrency(amount, currency)}</span>;
}
