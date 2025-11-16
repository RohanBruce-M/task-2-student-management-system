-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  course TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (public access)
CREATE POLICY "Allow all operations on students"
  ON public.students
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add validation function for age
CREATE OR REPLACE FUNCTION public.validate_student()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate name is not empty
  IF trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Name cannot be empty';
  END IF;

  -- Validate age is positive
  IF NEW.age <= 0 THEN
    RAISE EXCEPTION 'Age must be a positive number';
  END IF;

  -- Validate course is not empty
  IF trim(NEW.course) = '' THEN
    RAISE EXCEPTION 'Course cannot be empty';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
CREATE TRIGGER validate_student_data
  BEFORE INSERT OR UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_student();