import z from "zod";



export const editProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string()
    .email("Enter a valid email")
    .refine((v) => v.endsWith("@yuvabe.com"), "Email must be @yuvabe.com"),
  dob: z.string().min(1, "Date of Birth is required"),

  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
})
.refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export type EditProfileForm = z.infer<typeof editProfileSchema>;
