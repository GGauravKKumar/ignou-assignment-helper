import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Search } from "lucide-react";

interface SampleMaterial {
  id: string;
  title: string;
  description: string;
  course_code: string;
  subject: string;
  file_url: string;
  file_name: string;
  download_count: number;
}

export default function SamplesPage() {
  const [materials, setMaterials] = useState<SampleMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchMaterials() {
      const { data, error } = await supabase
        .from("sample_materials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMaterials(data);
      }
      setLoading(false);
    }
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const search = searchTerm.toLowerCase();
    return (
      material.title.toLowerCase().includes(search) ||
      material.course_code?.toLowerCase().includes(search) ||
      material.subject?.toLowerCase().includes(search)
    );
  });

  const handleDownload = async (material: SampleMaterial) => {
    if (material.file_url) {
      // Increment download count
      await supabase
        .from("sample_materials")
        .update({ download_count: (material.download_count || 0) + 1 })
        .eq("id", material.id);

      window.open(material.file_url, "_blank");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Sample Materials
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Download sample assignments and study notes to guide your own work
          </p>
        </div>
      </section>

      {/* Search and Materials */}
      <section className="py-12">
        <div className="container">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, course code, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Materials Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Materials Found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for new sample materials"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      {material.course_code && (
                        <Badge variant="outline">{material.course_code}</Badge>
                      )}
                    </div>
                    <CardTitle className="font-serif text-lg mt-2">
                      {material.title}
                    </CardTitle>
                    {material.subject && (
                      <CardDescription>{material.subject}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {material.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {material.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {material.download_count || 0} downloads
                      </span>
                      {material.file_url ? (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <Button size="sm" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}