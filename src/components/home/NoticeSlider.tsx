import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

interface Notice {
  id: string;
  message: string;
  display_order: number;
}

export function NoticeSlider() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (notices.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [notices.length]);

  const fetchNotices = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (data) setNotices(data);
  };

  if (notices.length === 0) return null;

  return (
    <div className="bg-accent text-accent-foreground py-2 overflow-hidden">
      <div className="container">
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm font-medium text-center truncate">
            {notices[currentIndex]?.message}
          </p>
        </div>
      </div>
    </div>
  );
}
