import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Link as LinkIcon, MessageCircle, Users } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .order("key");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } else {
      setSettings(data || []);
      const values: Record<string, string> = {};
      (data || []).forEach((s) => {
        values[s.key] = s.value;
      });
      setFormValues(values);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    for (const setting of settings) {
      if (formValues[setting.key] !== setting.value) {
        const { error } = await supabase
          .from("admin_settings")
          .update({ value: formValues[setting.key] })
          .eq("id", setting.id);

        if (error) {
          toast({
            title: "Error",
            description: `Failed to update ${setting.key}`,
            variant: "destructive",
          });
          setSaving(false);
          return;
        }
      }
    }

    toast({
      title: "Settings Saved",
      description: "All settings have been updated successfully.",
    });

    fetchSettings();
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            WhatsApp Settings
          </CardTitle>
          <CardDescription>
            Configure WhatsApp group and admin chat links shown after order submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_group_link" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              WhatsApp Group Link
            </Label>
            <Input
              id="whatsapp_group_link"
              value={formValues.whatsapp_group_link || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, whatsapp_group_link: e.target.value })
              }
              placeholder="https://chat.whatsapp.com/..."
            />
            <p className="text-sm text-muted-foreground">
              The invitation link for your WhatsApp group
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_chat_link" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Admin Direct Chat Link
            </Label>
            <Input
              id="admin_chat_link"
              value={formValues.admin_chat_link || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, admin_chat_link: e.target.value })
              }
              placeholder="https://wa.me/919876543210"
            />
            <p className="text-sm text-muted-foreground">
              Direct WhatsApp chat link with admin (format: https://wa.me/phonenumber)
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="mt-4">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}