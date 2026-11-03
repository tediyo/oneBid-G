/**
 * Strict Integer Subunit Currency Utility for ETB (Ethiopian Birr).
 * Base currency rule: 1 ETB = 100 subunits (1 subunit = 0.01 ETB).
 * Floating points are strictly avoided in calculations and domain storage.
 */

export const SUBUNITS_PER_ETB = 100;

/**
 * Converts integer subunits to standard decimal string representation (e.g., 60 -> "0.60", 1250 -> "12.50").
 */
export function subunitsToDecimalString(subunits: number): string {
  if (!Number.isInteger(subunits)) {
    throw new Error(`subunits must be an integer, got: ${subunits}`);
  }
  const isNegative = subunits < 0;
  const abs = Math.abs(subunits);
  const whole = Math.floor(abs / SUBUNITS_PER_ETB);
  const fraction = abs % SUBUNITS_PER_ETB;
  const formattedFraction = fraction.toString().padStart(2, '0');
  return `${isNegative ? '-' : ''}${whole}.${formattedFraction}`;
}

/**
 * Formats integer subunits into displayable ETB currency (e.g., 18000000 -> "180,000.00 ETB").
 */
export function formatETB(subunits: number, options?: { showCode?: boolean }): string {
  const showCode = options?.showCode ?? true;
  const isNegative = subunits < 0;
  const abs = Math.abs(subunits);
  const whole = Math.floor(abs / SUBUNITS_PER_ETB);
  const fraction = abs % SUBUNITS_PER_ETB;
  const formattedFraction = fraction.toString().padStart(2, '0');
  const formattedWhole = whole.toLocaleString('en-US');

  const formatted = `${isNegative ? '-' : ''}${formattedWhole}.${formattedFraction}`;
  return showCode ? `${formatted} ETB` : formatted;
}

/**
 * Parses user text input (e.g. "0.60", "15", "10.05") into strict integer subunits.
 * Returns null if invalid or has more than 2 decimal digits.
 */
export function parseETBInputToUnits(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Strict regex: integer or up to 2 decimal places
  const validPattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  if (!validPattern.test(trimmed)) {
    return null;
  }

  const parts = trimmed.split('.');
  const wholePart = parseInt(parts[0], 10);
  if (isNaN(wholePart)) return null;

  let fractionPart = 0;
  if (parts.length === 2) {
    const rawFrac = parts[1];
    if (rawFrac.length === 1) {
      fractionPart = parseInt(rawFrac, 10) * 10;
    } else if (rawFrac.length === 2) {
      fractionPart = parseInt(rawFrac, 10);
    } else {
      return null;
    }
  }

  return wholePart * SUBUNITS_PER_ETB + fractionPart;
}

/**
 * Validates that an amount in subunits is valid for bidding.
 */
export function validateBidSubunits(
  subunits: number,
  options?: { min?: number; max?: number }
): { valid: boolean; error?: string } {
  if (!Number.isInteger(subunits)) {
    return { valid: false, error: 'Bid amount must be a whole integer subunit.' };
  }
  if (subunits <= 0) {
    return { valid: false, error: 'Bid must be greater than 0.00 ETB (minimum is 0.01 ETB).' };
  }
  if (options?.min && subunits < options.min) {
    return { valid: false, error: `Bid must be at least ${formatETB(options.min)}.` };
  }
  if (options?.max && subunits > options.max) {
    return { valid: false, error: `Bid cannot exceed ${formatETB(options.max)}.` };
  }
  return { valid: true };
}

