import { z } from 'zod'

// Validation schemas for authentication
export const signUpSchema = z.object({
  email: z.string().email('Email non valido').max(255, 'Email troppo lunga'),
  password: z.string().min(6, 'La password deve avere almeno 6 caratteri').max(128, 'Password troppo lunga'),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional()
})

export const signInSchema = z.object({
  email: z.string().email('Email non valido').max(255, 'Email troppo lunga'),
  password: z.string().min(1, 'Password richiesta').max(128, 'Password troppo lunga')
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>