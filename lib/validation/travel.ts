import { z } from "zod";

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  });
export const provinceIdSchema = z.string().regex(/^\d{1,6}$/);
export function travelSearchSchema(today: string) {
  return z
    .object({
      tab: z.enum(["stays", "attraction"]),
      checkin: z.string(),
      checkout: z.string(),
    })
    .superRefine(({ tab, checkin, checkout }, ctx) => {
      if (
        (checkin && !dateSchema.safeParse(checkin).success) ||
        (tab === "stays" && checkout && !dateSchema.safeParse(checkout).success)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid date in YYYY-MM-DD format.",
        });
      } else if (
        tab === "stays" &&
        ((checkin && !checkout) ||
          (!checkin && checkout) ||
          (checkout && checkout <= checkin))
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Choose a check-out date after your check-in date.",
        });
      } else if (checkin && checkin < today) {
        ctx.addIssue({
          code: "custom",
          message: "Choose today or a future date.",
        });
      }
    });
}
