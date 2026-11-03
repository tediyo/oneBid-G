import { z } from 'zod';
import { parseETBInputToUnits } from '@/lib/utils/currency';

export function createBidInputSchema(maxBidLimitUnits: number, bidFeeUnits: number) {
  return z
    .object({
      amountInput: z
        .string()
        .min(1, 'Please enter a bid amount.')
        .refine(
          (val) => {
            const units = parseETBInputToUnits(val);
            return units !== null && units > 0;
          },
          {
            message: 'Must be a positive amount in strict 0.01 ETB increments (e.g. 0.60, 1.25).',
          }
        )
        .refine(
          (val) => {
            const units = parseETBInputToUnits(val);
            if (units === null) return false;
            return units <= maxBidLimitUnits;
          },
          {
            message: `Bid cannot exceed the ${(maxBidLimitUnits / 100).toFixed(2)} ETB maximum limit.`,
          }
        ),
    });
}

export type BidFormValues = {
  amountInput: string;
};

