import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeliveryProof {
  id: string;
  state: string;
  image_url: string;
  description: string | null;
  is_published: boolean;
}

interface StateStat {
  id: string;
  state: string;
  candidates_count: number;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

export function DeliveryProofsManager() {
  const [proofs, setProofs] = useState<DeliveryProof[]>([]);
  const [stats, setStats] = useState<StateStat[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [proofsRes, statsRes] = await Promise.all([
      supabase.from("delivery_proofs").select("*").order("created_at", { ascending: false }),
      supabase.from("state_stats").select("*").order("state")
    ]);

    if (proofsRes.data) setProofs(proofsRes.data);
    if (statsRes.data) setStats(statsRes.data);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `delivery-proofs/${fileName}`;

    const { error } = await supabase.storage.from("materials").upload(filePath, file);

    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
      return null;
    }

    const { data: urlData } = supabase.storage.from("materials").getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedState) {
      toast({ title: "Error", description: "Please select a state first", variant: "destructive" });
      return;
    }

    setUploading(true);
    const imageUrl = await uploadImage(file);

    if (imageUrl) {
      const { error } = await supabase.from("delivery_proofs").insert({
        state: selectedState,
        image_url: imageUrl,
        description: description || null
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Delivery proof uploaded" });
        setDescription("");
        fetchData();
      }
    }
    setUploading(false);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedState) {
      toast({ title: "Error", description: "Please select a state first", variant: "destructive" });
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        const { error } = await supabase.from("delivery_proofs").insert({
          state: selectedState,
          image_url: imageUrl
        });
        if (!error) successCount++;
      }
    }

    toast({ title: "Bulk Upload Complete", description: `${successCount} of ${files.length} images uploaded` });
    fetchData();
    setUploading(false);
  };

  const deleteProof = async (id: string) => {
    const { error } = await supabase.from("delivery_proofs").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchData();
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    await supabase.from("delivery_proofs").update({ is_published: !isPublished }).eq("id", id);
    fetchData();
  };

  const updateStatCount = async (stateId: string, newCount: number) => {
    if (newCount < 0) return;
    await supabase.from("state_stats").update({ candidates_count: newCount }).eq("id", stateId);
    fetchData();
  };

  const addNewState = async (stateName: string) => {
    const { error } = await supabase.from("state_stats").insert({ state: stateName, candidates_count: 0 });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchData();
    }
  };

  return (
    <Tabs defaultValue="proofs">
      <TabsList className="mb-4">
        <TabsTrigger value="proofs">Delivery Proofs</TabsTrigger>
        <TabsTrigger value="stats">State Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="proofs">
        <Card>
          <CardHeader>
            <CardTitle>Upload Delivery Proofs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleSingleUpload}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={bulkFileInputRef}
                  onChange={handleBulkUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploading || !selectedState}
                >
                  <Upload className="h-4 w-4 mr-2" /> Single
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => bulkFileInputRef.current?.click()} 
                  disabled={uploading || !selectedState}
                >
                  <Upload className="h-4 w-4 mr-2" /> Bulk
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {proofs.map((proof) => (
                <div key={proof.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={proof.image_url} alt={proof.state} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                    <Button size="sm" variant="secondary" onClick={() => togglePublished(proof.id, proof.is_published)}>
                      {proof.is_published ? "Hide" : "Show"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteProof(proof.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2" variant={proof.is_published ? "default" : "secondary"}>
                    {proof.state}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stats">
        <Card>
          <CardHeader>
            <CardTitle>State-wise Candidate Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Candidates Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.state}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{stat.candidates_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStatCount(stat.id, stat.candidates_count - 10)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={stat.candidates_count}
                          onChange={(e) => updateStatCount(stat.id, parseInt(e.target.value) || 0)}
                          className="w-24 text-center"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStatCount(stat.id, stat.candidates_count + 10)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex gap-2">
              <Select onValueChange={addNewState}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add new state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.filter(s => !stats.find(st => st.state === s)).map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
