import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  title: string;
  description: string | null;
  course_code: string | null;
  subject: string | null;
  file_url: string | null;
  file_name: string | null;
  download_count: number;
  is_published: boolean;
  created_at: string;
}

export function MaterialsManager() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_code: "",
    subject: "",
    is_published: true,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from("sample_materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      course_code: "",
      subject: "",
      is_published: true,
    });
    setFile(null);
    setEditingMaterial(null);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || "",
      course_code: material.course_code || "",
      subject: material.subject || "",
      is_published: material.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let fileUrl = editingMaterial?.file_url || null;
    let fileName = editingMaterial?.file_name || null;

    // Upload file if selected
    if (file) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("materials")
        .upload(filePath, file);

      if (uploadError) {
        toast({ title: "Error", description: "Failed to upload file.", variant: "destructive" });
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("materials").getPublicUrl(filePath);
      fileUrl = urlData.publicUrl;
      fileName = file.name;
    }

    const materialData = {
      title: formData.title,
      description: formData.description || null,
      course_code: formData.course_code || null,
      subject: formData.subject || null,
      file_url: fileUrl,
      file_name: fileName,
      is_published: formData.is_published,
    };

    if (editingMaterial) {
      const { error } = await supabase
        .from("sample_materials")
        .update(materialData)
        .eq("id", editingMaterial.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update material.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Material updated successfully." });
        fetchMaterials();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("sample_materials").insert([materialData]);

      if (error) {
        toast({ title: "Error", description: "Failed to create material.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Material created successfully." });
        fetchMaterials();
        setDialogOpen(false);
        resetForm();
      }
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    const { error } = await supabase.from("sample_materials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete material.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Material deleted successfully." });
      fetchMaterials();
    }
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("sample_materials")
      .update({ is_published: !currentState })
      .eq("id", id);

    if (!error) {
      fetchMaterials();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-serif">Materials Management</CardTitle>
          <CardDescription>Upload and manage sample materials and notes</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMaterial ? "Edit Material" : "Add New Material"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Code</Label>
                  <Input
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    placeholder="e.g., MCA-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </div>
                {editingMaterial?.file_name && !file && (
                  <p className="text-sm text-muted-foreground">
                    Current file: {editingMaterial.file_name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label>Published</Label>
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : editingMaterial ? (
                  "Update Material"
                ) : (
                  "Create Material"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No materials found. Upload your first material!</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{material.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {material.course_code ? (
                        <Badge variant="outline">{material.course_code}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{material.download_count}</TableCell>
                    <TableCell>
                      <Switch
                        checked={material.is_published}
                        onCheckedChange={() => togglePublished(material.id, material.is_published)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(material)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(material.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}