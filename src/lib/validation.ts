import { z } from 'zod'

// Profile validation schema
export const profileSchema = z.object({
  firstName: z.string().trim().max(50, 'Nome troppo lungo').optional(),
  lastName: z.string().trim().max(50, 'Cognome troppo lungo').optional(),
  username: z.string().trim().min(3, 'Username troppo corto').max(30, 'Username troppo lungo').optional(),
  bio: z.string().trim().max(500, 'Bio troppo lunga').optional(),
  height: z.number().min(100, 'Altezza troppo bassa').max(250, 'Altezza troppo alta').optional(),
  weight: z.number().min(20, 'Peso troppo basso').max(300, 'Peso troppo alto').optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  dateOfBirth: z.date().max(new Date(), 'Data non valida').optional()
})

// Workout validation schema
export const workoutSchema = z.object({
  date: z.string().min(1, 'Data richiesta'),
  duration: z.number().min(1, 'Durata minima 1 minuto').max(600, 'Durata massima 10 ore').optional(),
  notes: z.string().trim().max(1000, 'Note troppo lunghe').optional()
})

// Exercise validation schema
export const exerciseSchema = z.object({
  name: z.string().trim().min(1, 'Nome esercizio richiesto').max(100, 'Nome troppo lungo'),
  type: z.string().min(1, 'Tipo esercizio richiesto'),
  notes: z.string().trim().max(500, 'Note troppo lunghe').optional()
})

// Set validation schema
export const setSchema = z.object({
  reps: z.number().min(1, 'Minimo 1 ripetizione').max(1000, 'Troppe ripetizioni').optional(),
  weight: z.number().min(0, 'Peso non può essere negativo').max(1000, 'Peso troppo alto').optional(),
  duration: z.number().min(1, 'Durata minima 1 secondo').max(86400, 'Durata massima 24 ore').optional(),
  distance: z.number().min(0.01, 'Distanza minima 0.01').max(1000, 'Distanza troppo alta').optional(),
  speed: z.number().min(0.1, 'Velocità minima 0.1').max(100, 'Velocità troppo alta').optional(),
  calories: z.number().min(1, 'Calorie minime 1').max(10000, 'Troppe calorie').optional(),
  incline: z.number().min(-50, 'Inclinazione troppo bassa').max(50, 'Inclinazione troppo alta').optional()
})

export type ProfileData = z.infer<typeof profileSchema>
export type WorkoutData = z.infer<typeof workoutSchema>
export type ExerciseData = z.infer<typeof exerciseSchema>
export type SetData = z.infer<typeof setSchema>