import { z } from 'zod';

// Login
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export type TLoginBody = z.infer<typeof loginSchema>;

// Sign-up
export const signupSchema = z.object({
  username: z
    .string('Username is required')
    .trim()
    .min(1, 'Username cannot be empty'),
  fullName: z
    .string('Full name is required')
    .trim()
    .min(1, 'Full name cannot be empty'),

  email: z
    .email('Please enter a valid email address'),

  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export type TSignUpBody = z.infer<typeof signupSchema>;
