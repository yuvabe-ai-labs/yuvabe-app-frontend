import z from 'zod';

export const editProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Name must be at least 3 characters')
      .refine(val => val.replace(/\s+/g, '').length > 0, {
        message: 'Name cannot be empty or spaces only',
      }),

    email: z.string().email('Enter a valid email'),

    dob: z.string().min(1, 'Date of Birth is required'),

    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val) return true;
          return val.length >= 6;
        },
        { message: 'Password must be at least 6 characters' },
      )
      .refine(
        val => {
          if (!val) return true;
          return /[A-Za-z]/.test(val);
        },
        { message: 'Password must contain at least one letter' },
      )
      .refine(
        val => {
          if (!val) return true;
          return /\d/.test(val);
        },
        { message: 'Password must contain at least one number' },
      ),

    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    // RULE 1: If CURRENT password entered → NEW PASSWORD is required
    if (currentPassword && !newPassword) {
      ctx.addIssue({
        path: ['newPassword'],
        message: 'New password is required',
        code: z.ZodIssueCode.custom,
      });
    }

    // RULE 2: If CONFIRM password entered → NEW PASSWORD is required
    if (confirmPassword && !newPassword) {
      ctx.addIssue({
        path: ['newPassword'],
        message: 'New password is required',
        code: z.ZodIssueCode.custom,
      });
    }

    // RULE 3: If NEW password entered → CONFIRM required
    if (newPassword && !confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Confirm password is required',
        code: z.ZodIssueCode.custom,
      });
    }

    // RULE 4: New + Confirm must match
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords do not match',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type EditProfileForm = z.infer<typeof editProfileSchema>;
