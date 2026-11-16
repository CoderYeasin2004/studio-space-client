/**
 * Shared currency formatter for StudioSpace.
 *
 * All frontend price displays use Bangladeshi Taka (BDT). Numeric values are
 * never converted — only their presentation changes. Values are rendered with
 * the ৳ symbol and thousand separators, e.g. formatCurrency(1500) → "৳1,500".
 */

export const formatCurrency = (value: number | string | null | undefined): string => {
  const numeric = value == null ? 0 : Number(value);

  // Guard against NaN so malformed values never break the UI.
  if (Number.isNaN(numeric)) {
    return "৳0";
  }

  return `৳${new Intl.NumberFormat("en-US").format(numeric)}`;
};
