/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '';
  const str = n.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

/**
 * Formats a raw number with commas and Persian digits
 */
export function formatNumberPersian(num: number | undefined | null): string {
  if (num === undefined || num === null) return '۰';
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(num));
}

/**
 * Formats Toman price into human-readable Persian terms
 * e.g., 25,400,000,000 -> ۲۵ میلیارد و ۴۰۰ میلیون تومان
 */
export function formatPricePersian(toman: number | undefined | null): string {
  if (!toman || toman === 0) return 'توافقی';
  
  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (toman >= billion) {
    const bPart = Math.floor(toman / billion);
    const mRemainder = toman % billion;
    const mPart = Math.floor(mRemainder / million);

    if (mPart > 0) {
      return `${toPersianDigits(bPart)} میلیارد و ${toPersianDigits(mPart)} میلیون تومان`;
    }
    return `${toPersianDigits(bPart)} میلیارد تومان`;
  }

  if (toman >= million) {
    const mPart = Math.floor(toman / million);
    return `${toPersianDigits(mPart)} میلیون تومان`;
  }

  return `${formatNumberPersian(toman)} تومان`;
}

/**
 * Formats short price badge for map markers (e.g., ۲۴ م or ۱.۸ م)
 */
export function formatShortPriceBadge(toman: number | undefined | null): string {
  if (!toman || toman === 0) return 'توافقی';
  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (toman >= billion) {
    const b = (toman / billion).toFixed(1).replace('.0', '');
    return `${toPersianDigits(b)} میلیارد`;
  }
  if (toman >= million) {
    const m = (toman / million).toFixed(0);
    return `${toPersianDigits(m)} میلیون`;
  }
  return `${toPersianDigits(Math.round(toman / 1000))} هزار`;
}
