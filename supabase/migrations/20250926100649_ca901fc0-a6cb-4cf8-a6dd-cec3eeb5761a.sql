-- Add missing DELETE policy for profiles table to allow users to delete their own profile data
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);