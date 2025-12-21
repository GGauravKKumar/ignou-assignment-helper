-- Create notices table for admin-controlled announcement slider
CREATE TABLE public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active notices" 
ON public.notices 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage notices" 
ON public.notices 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create delivery_proofs table for state-wise delivery proofs
CREATE TABLE public.delivery_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  image_url text NOT NULL,
  description text,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_proofs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view published delivery proofs" 
ON public.delivery_proofs 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage delivery proofs" 
ON public.delivery_proofs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create state_stats table for candidate statistics
CREATE TABLE public.state_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL UNIQUE,
  candidates_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.state_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view state stats" 
ON public.state_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage state stats" 
ON public.state_stats 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_proofs_updated_at
BEFORE UPDATE ON public.delivery_proofs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_state_stats_updated_at
BEFORE UPDATE ON public.state_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample notices
INSERT INTO public.notices (message, display_order) VALUES
('📢 NIOS & International Students - We now provide assignment help for NIOS and international university students!', 1),
('🎉 Special Discount: 20% off on all assignments till January 31st!', 2),
('⏰ Last date for TEE December 2024 assignments submission approaching!', 3);

-- Insert sample state stats with major Indian states
INSERT INTO public.state_stats (state, candidates_count) VALUES
('Delhi', 850),
('Maharashtra', 620),
('Uttar Pradesh', 540),
('Karnataka', 380),
('Tamil Nadu', 320),
('Gujarat', 280),
('Rajasthan', 250),
('West Bengal', 220),
('Madhya Pradesh', 190),
('Bihar', 180),
('Kerala', 150),
('Andhra Pradesh', 140),
('Punjab', 120),
('Haryana', 110),
('Odisha', 95),
('Telangana', 85),
('Jharkhand', 70),
('Assam', 65),
('Chhattisgarh', 55),
('Uttarakhand', 50);