import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PenTool, FileText, Users, BookOpen, IndianRupee } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  is_active: boolean;
}

const categoryIcons: Record<string, typeof PenTool> = {
  custom_writing: PenTool,
  ready_made: FileText,
  tutoring: Users,
  sample_notes: BookOpen,
};

const categoryLabels: Record<string, string> = {
  custom_writing: "Custom Writing",
  ready_made: "Ready-Made",
  tutoring: "Tutoring",
  sample_notes: "Sample Notes",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Services
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Choose from our range of professional assignment services designed to help IGNOU students succeed
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-muted mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => {
                const Icon = categoryIcons[service.category] || BookOpen;
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">
                          {categoryLabels[service.category] || service.category}
                        </Badge>
                      </div>
                      <CardTitle className="font-serif text-xl mt-4">{service.title}</CardTitle>
                      <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                        <IndianRupee className="h-5 w-5" />
                        {service.price}
                        <span className="text-sm font-normal text-muted-foreground ml-1">onwards</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                      <Link to={`/order?service=${service.id}`}>
                        <Button className="w-full">Order This Service</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">How do I place an order?</h3>
              <p className="text-muted-foreground">
                Simply click "Order Now" on any service, fill in your assignment details including course code and requirements, and submit. We'll contact you via WhatsApp or email to confirm.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">What is the delivery time?</h3>
              <p className="text-muted-foreground">
                Delivery time depends on the assignment complexity and your deadline. Most assignments are delivered within 3-7 days. Rush orders are available at additional cost.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is the content plagiarism-free?</h3>
              <p className="text-muted-foreground">
                Yes, all our custom assignments are 100% original and plagiarism-free. We provide plagiarism reports upon request.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}