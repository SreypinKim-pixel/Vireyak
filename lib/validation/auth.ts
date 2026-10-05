import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .pipe(
    z.email({
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: "Enter a valid email address.",
    }),
  );
const passwordSchema = z
  .string()
  .refine((value) => Boolean(value.trim()), "Password is required.");
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const accountCredentialsSchema = loginSchema.extend({
  password: passwordSchema
    .min(12, "Use at least 12 characters.")
    .max(128, "Use no more than 128 characters."),
});
export const registrationSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your full name."),
    ...accountCredentialsSchema.shape,
    confirmPassword: z.string(),
  })
  .refine(
    (values) =>
      Boolean(values.confirmPassword) &&
      values.password === values.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Your passwords must match.",
    },
  );
export const localAccountsSchema = z.array(
  z.object({
    email: z.string(),
    salt: z.string().regex(/^[a-f0-9]{32}$/),
    hash: z.string().regex(/^[a-f0-9]{64}$/),
  }),
);
export type LocalAccount = z.infer<typeof localAccountsSchema>[number];
export const attractionOptionsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      province: z.object({ id: z.string(), name: z.string() }).optional(),
    }),
  ),
});
