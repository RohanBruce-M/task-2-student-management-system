-- Fix security warnings by setting search_path on functions

-- Drop and recreate handle_updated_at function with search_path
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate validate_student function with search_path
DROP FUNCTION IF EXISTS public.validate_student() CASCADE;
CREATE OR REPLACE FUNCTION public.validate_student()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Recreate triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER validate_student_data
  BEFORE INSERT OR UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_student();