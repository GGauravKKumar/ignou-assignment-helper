-- Create reviews/testimonials table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  course_code TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view published reviews
CREATE POLICY "Anyone can view published reviews"
  ON public.reviews FOR SELECT
  USING (is_published = true);

-- Admins can do everything with reviews
CREATE POLICY "Admins can do everything with reviews"
  ON public.reviews FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample reviews
INSERT INTO public.reviews (customer_name, course_code, rating, review_text, is_published) VALUES
  ('Rahul Sharma', 'MCA-101', 5, 'Excellent work! Got my assignment done on time with great quality. Highly recommended for IGNOU students.', true),
  ('Priya Singh', 'BCA-201', 5, 'Very professional service. The assignment was well-researched and plagiarism-free. Will definitely use again.', true),
  ('Amit Kumar', 'MBA-301', 4, 'Good quality work and timely delivery. The team was very responsive on WhatsApp.', true),
  ('Sneha Patel', 'BA-101', 5, 'Amazing service! They understood my requirements perfectly. Best IGNOU assignment help.', true);