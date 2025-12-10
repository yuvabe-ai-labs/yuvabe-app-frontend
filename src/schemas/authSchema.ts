import { z } from 'zod';


const yuvabeEmail = z
  .string()
  .email({ message: 'Enter a valid email address' })
  .transform((email) => email.toLowerCase())
  .refine(
    (email) => email.toLowerCase().endsWith('@yuvabe.com'),
    { message: 'Please use your Yuvabe email (example@yuvabe.com)' }
  );

export const signInSchema = z.object({
  email: yuvabeEmail,
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters long' }),
  email: yuvabeEmail,
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});


export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
