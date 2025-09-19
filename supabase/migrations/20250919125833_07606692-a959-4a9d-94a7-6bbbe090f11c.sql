-- Create workouts table
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table  
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('strength', 'cardio')),
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sets table
CREATE TABLE public.sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('strength', 'cardio')),
  -- Strength properties
  reps INTEGER,
  weight DECIMAL(6,2),
  -- Cardio properties
  duration INTEGER, -- in minutes
  distance DECIMAL(8,2), -- in km
  speed DECIMAL(6,2), -- in km/h
  incline INTEGER, -- in percentage
  calories INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workouts
CREATE POLICY "Users can view their own workouts" 
ON public.workouts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" 
ON public.workouts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
ON public.workouts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
ON public.workouts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for exercises
CREATE POLICY "Users can view their own exercises" 
ON public.exercises 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE workouts.id = exercises.workout_id));

CREATE POLICY "Users can create their own exercises" 
ON public.exercises 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.workouts WHERE workouts.id = exercises.workout_id));

CREATE POLICY "Users can update their own exercises" 
ON public.exercises 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE workouts.id = exercises.workout_id));

CREATE POLICY "Users can delete their own exercises" 
ON public.exercises 
FOR DELETE 
USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE workouts.id = exercises.workout_id));

-- Create RLS policies for sets
CREATE POLICY "Users can view their own sets" 
ON public.sets 
FOR SELECT 
USING (auth.uid() = (SELECT workouts.user_id FROM public.workouts 
                     JOIN public.exercises ON exercises.workout_id = workouts.id 
                     WHERE exercises.id = sets.exercise_id));

CREATE POLICY "Users can create their own sets" 
ON public.sets 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT workouts.user_id FROM public.workouts 
                          JOIN public.exercises ON exercises.workout_id = workouts.id 
                          WHERE exercises.id = sets.exercise_id));

CREATE POLICY "Users can update their own sets" 
ON public.sets 
FOR UPDATE 
USING (auth.uid() = (SELECT workouts.user_id FROM public.workouts 
                     JOIN public.exercises ON exercises.workout_id = workouts.id 
                     WHERE exercises.id = sets.exercise_id));

CREATE POLICY "Users can delete their own sets" 
ON public.sets 
FOR DELETE 
USING (auth.uid() = (SELECT workouts.user_id FROM public.workouts 
                     JOIN public.exercises ON exercises.workout_id = workouts.id 
                     WHERE exercises.id = sets.exercise_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sets_updated_at
  BEFORE UPDATE ON public.sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_date ON public.workouts(date);
CREATE INDEX idx_exercises_workout_id ON public.exercises(workout_id);
CREATE INDEX idx_sets_exercise_id ON public.sets(exercise_id);