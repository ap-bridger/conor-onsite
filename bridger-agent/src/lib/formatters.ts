const numberFormat = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const formatCentsToDollars = (amountCents: number): string => {
  return numberFormat.format(amountCents / 100);
};
