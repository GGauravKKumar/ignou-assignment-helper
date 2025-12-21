import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface Notice {
  id: string;
  message: string;
  is_active: boolean;
  display_order: number;
}

export function NoticesManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNotices(data || []);
    }
    setLoading(false);
  };

  const addNotice = async () => {
    if (!newMessage.trim()) return;

    const maxOrder = notices.reduce((max, n) => Math.max(max, n.display_order), 0);
    
    const { error } = await supabase
      .from("notices")
      .insert({ message: newMessage, display_order: maxOrder + 1 });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Notice added" });
      setNewMessage("");
      fetchNotices();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("notices")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchNotices();
    }
  };

  const deleteNotice = async (id: string) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Notice removed" });
      fetchNotices();
    }
  };

  const moveOrder = async (id: string, direction: "up" | "down") => {
    const index = notices.findIndex(n => n.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === notices.length - 1)) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const currentOrder = notices[index].display_order;
    const swapOrder = notices[swapIndex].display_order;

    await supabase.from("notices").update({ display_order: swapOrder }).eq("id", notices[index].id);
    await supabase.from("notices").update({ display_order: currentOrder }).eq("id", notices[swapIndex].id);
    
    fetchNotices();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Notice Slider</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter notice message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={addNotice}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice, index) => (
              <TableRow key={notice.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => moveOrder(notice.id, "up")} disabled={index === 0}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => moveOrder(notice.id, "down")} disabled={index === notices.length - 1}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate">{notice.message}</TableCell>
                <TableCell>
                  <Switch
                    checked={notice.is_active}
                    onCheckedChange={() => toggleActive(notice.id, notice.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive" onClick={() => deleteNotice(notice.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
