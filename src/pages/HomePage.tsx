import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, PenTool, Users, FileText, CheckCircle, Clock, Award, MessageCircle, Globe, GraduationCap } from "lucide-react";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NoticeSlider } from "@/components/home/NoticeSlider";
import logo from "@/assets/logo.jpg";

const features = [
  {
    icon: PenTool,
    title: "Custom Assignment Writing",
    description: "Professionally written assignments tailored to your requirements",
  },
  {
    icon: FileText,
    title: "Ready-Made Assignments",
    description: "Pre-written assignments for popular IGNOU courses",
  },
  {
    icon: Users,
    title: "Assignment Help & Tutoring",
    description: "One-on-one guidance from experienced tutors",
  },
  {
    icon: BookOpen,
    title: "Sample Notes & Materials",
    description: "Study materials and sample assignments to guide you",
  },
];

const supportedBoards = [
  { icon: GraduationCap, name: "IGNOU", description: "All Programs & Courses" },
  { icon: BookOpen, name: "NIOS", description: "10th & 12th Board" },
  { icon: Globe, name: "International", description: "University Students" },
];

const benefits = [
  { icon: CheckCircle, text: "100% Plagiarism-Free Content" },
  { icon: Clock, text: "On-Time Delivery" },
  { icon: Award, text: "Quality Assured" },
  { icon: MessageCircle, text: "24/7 WhatsApp Support" },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Notice Slider */}
      <NoticeSlider />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <img src={logo} alt="Vishi IGNOU Services" className="h-24 w-24 rounded-full object-cover mx-auto border-4 border-accent shadow-lg" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Vishi IGNOU Services
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Get professional help with your IGNOU assignments. Quality work, timely delivery, and academic success guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/order">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Order Now
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="secondary" className="font-semibold">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Boards Section */}
      <section className="py-12 bg-accent/10 border-y border-border">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              We Support Students From
            </h2>
            <p className="text-muted-foreground">IGNOU, NIOS & International Universities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {supportedBoards.map((board, index) => (
              <Card key={index} className="text-center border-2 border-accent/30 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <board.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-1">{board.name}</h3>
                  <p className="text-sm text-muted-foreground">{board.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive assignment solutions for IGNOU, NIOS & International students
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Why Choose Vishi IGNOU Services?
              </h2>
              <p className="text-muted-foreground mb-8">
                We understand the challenges IGNOU students face. Our team of experienced academic writers and tutors are dedicated to helping you succeed in your educational journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-serif font-bold text-primary mb-2">5000+</div>
                  <div className="text-muted-foreground">Assignments Completed</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-serif font-bold text-primary mb-1">98%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-primary mb-1">4.9/5</div>
                    <div className="text-sm text-muted-foreground">Student Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Submit your assignment requirements today and get expert help from our team of academic professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Place Your Order
              </Button>
            </Link>
            <a href="https://wa.me/918287664264" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white border-0">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* View Delivery Proofs CTA */}
      <section className="py-8 bg-muted">
        <div className="container text-center">
          <Link to="/delivery-proofs">
            <Button variant="outline" size="lg">
              View Delivery Proofs & Success Stories
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
