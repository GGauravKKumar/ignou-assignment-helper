import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { OrderSuccessOptions } from "@/components/order/OrderSuccessOptions";

interface Service {
  id: string;
  title: string;
}

const orderSchema = z.object({
  customer_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  customer_email: z.string().trim().email("Invalid email address").max(255),
  customer_phone: z.string().trim().max(20).optional(),
  customer_whatsapp: z.string().trim().max(20).optional(),
  course_code: z.string().trim().min(2, "Course code is required").max(50),
  assignment_details: z.string().trim().min(10, "Please provide more details about your assignment").max(2000),
  deadline: z.string().optional(),
});

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_whatsapp: "",
    service_id: searchParams.get("service") || "",
    course_code: "",
    assignment_details: "",
    deadline: "",
  });

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from("services")
        .select("id, title")
        .eq("is_active", true);
      if (data) setServices(data);
    }
    fetchServices();

    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user.id);
        // Pre-fill email if logged in
        setFormData((prev) => ({
          ...prev,
          customer_email: session.user.email || "",
        }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = orderSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const orderData = {
      ...formData,
      service_id: formData.service_id || null,
      deadline: formData.deadline || null,
      user_id: currentUser, // Link order to user if logged in
    };

    const { error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit your order. Please try again.",
        variant: "destructive",
      });
    } else {
      setSubmitted(true);
      toast({
        title: "Order Submitted!",
        description: "We'll contact you shortly to confirm your order.",
      });
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container">
            <OrderSuccessOptions onReset={() => setSubmitted(false)} />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Place Your Order</h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Fill in your assignment details and we'll get back to you with a quote
          </p>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Order Details</CardTitle>
              <CardDescription>
                Provide your assignment requirements and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Your full name"
                    />
                    {errors.customer_name && (
                      <p className="text-sm text-destructive">{errors.customer_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                    {errors.customer_email && (
                      <p className="text-sm text-destructive">{errors.customer_email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone Number</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_whatsapp">WhatsApp Number</Label>
                    <Input
                      id="customer_whatsapp"
                      value={formData.customer_whatsapp}
                      onChange={(e) => setFormData({ ...formData, customer_whatsapp: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_id">Select Service</Label>
                  <Select
                    value={formData.service_id}
                    onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course_code">Course Code *</Label>
                    <Input
                      id="course_code"
                      value={formData.course_code}
                      onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                      placeholder="e.g., MCA-001, BCA-101"
                    />
                    {errors.course_code && (
                      <p className="text-sm text-destructive">{errors.course_code}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignment_details">Assignment Details *</Label>
                  <Textarea
                    id="assignment_details"
                    value={formData.assignment_details}
                    onChange={(e) => setFormData({ ...formData, assignment_details: e.target.value })}
                    placeholder="Describe your assignment requirements, questions, word count, etc."
                    rows={5}
                  />
                  {errors.assignment_details && (
                    <p className="text-sm text-destructive">{errors.assignment_details}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Order Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}