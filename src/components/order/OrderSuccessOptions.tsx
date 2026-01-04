import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Users, MessageCircle, User, ExternalLink } from "lucide-react";

interface OrderSuccessOptionsProps {
  onReset: () => void;
}

export function OrderSuccessOptions({ onReset }: OrderSuccessOptionsProps) {
  const [whatsappGroupLink, setWhatsappGroupLink] = useState("");
  const [adminChatLink, setAdminChatLink] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("admin_settings")
        .select("key, value")
        .in("key", ["whatsapp_group_link", "admin_chat_link"]);

      if (data) {
        data.forEach((setting) => {
          if (setting.key === "whatsapp_group_link") {
            setWhatsappGroupLink(setting.value);
          } else if (setting.key === "admin_chat_link") {
            setAdminChatLink(setting.value);
          }
        });
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Order Submitted Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. Our team will review your requirements and contact you within 24 hours.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Connect With Us</CardTitle>
          <CardDescription>
            Join our WhatsApp group or chat directly with admin for quick updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {whatsappGroupLink && (
            <a href={whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Join WhatsApp Group</div>
                  <div className="text-sm text-muted-foreground">Connect with other students and get updates</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </a>
          )}

          {adminChatLink && (
            <a href={adminChatLink} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Chat with Admin</div>
                  <div className="text-sm text-muted-foreground">Direct message for urgent queries</div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </a>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Track Your Order</CardTitle>
          <CardDescription>
            Create an account to track your order status and view history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/candidate-auth">
            <Button className="w-full justify-start gap-3 h-auto py-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">Login / Sign Up</div>
                <div className="text-sm opacity-80">Access your dashboard to track all orders</div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={onReset}>
          Submit Another Order
        </Button>
      </div>
    </div>
  );
}