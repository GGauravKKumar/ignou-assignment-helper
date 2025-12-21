import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeliveryProof {
  id: string;
  state: string;
  image_url: string;
  description: string | null;
}

interface StateStat {
  id: string;
  state: string;
  candidates_count: number;
}

export default function DeliveryProofsPage() {
  const [proofs, setProofs] = useState<DeliveryProof[]>([]);
  const [stats, setStats] = useState<StateStat[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStateDetails, setShowStateDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [proofsRes, statsRes] = await Promise.all([
      supabase.from("delivery_proofs").select("*").eq("is_published", true),
      supabase.from("state_stats").select("*").order("candidates_count", { ascending: false })
    ]);

    if (proofsRes.data) setProofs(proofsRes.data);
    if (statsRes.data) setStats(statsRes.data);
  };

  const totalCandidates = stats.reduce((sum, s) => sum + s.candidates_count, 0);
  const filteredProofs = selectedState 
    ? proofs.filter(p => p.state === selectedState)
    : proofs;

  const groupedProofs = proofs.reduce((acc, proof) => {
    if (!acc[proof.state]) acc[proof.state] = [];
    acc[proof.state].push(proof);
    return acc;
  }, {} as Record<string, DeliveryProof[]>);

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Delivery Proofs & Success Stories
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See our track record of successful deliveries across India. We've helped thousands of students achieve their academic goals.
          </p>
        </div>

        {/* Total Candidates Card */}
        <Card className="mb-8 bg-primary text-primary-foreground">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="h-8 w-8" />
                <span className="text-5xl font-serif font-bold">{totalCandidates.toLocaleString()}+</span>
              </div>
              <p className="text-primary-foreground/80 text-lg">Students Served Across India</p>
              <Button 
                variant="secondary" 
                className="mt-4"
                onClick={() => setShowStateDetails(!showStateDetails)}
              >
                {showStateDetails ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                {showStateDetails ? "Hide" : "View"} State-wise Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* State-wise Statistics */}
        {showStateDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                State-wise Student Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Students</TableHead>
                      <TableHead>View Proofs</TableHead>
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
                          {groupedProofs[stat.state]?.length > 0 ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedState(selectedState === stat.state ? null : stat.state)}
                            >
                              {selectedState === stat.state ? "Show All" : `View (${groupedProofs[stat.state].length})`}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">No proofs yet</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery Proofs Gallery */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">
            {selectedState ? `Delivery Proofs - ${selectedState}` : "All Delivery Proofs"}
          </h2>
          {selectedState && (
            <Button variant="ghost" onClick={() => setSelectedState(null)}>
              Show All States
            </Button>
          )}
        </div>

        {filteredProofs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No delivery proofs available yet. Check back soon!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProofs.map((proof) => (
              <Card key={proof.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted">
                  <img 
                    src={proof.image_url} 
                    alt={`Delivery proof - ${proof.state}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <Badge>{proof.state}</Badge>
                  {proof.description && (
                    <p className="text-sm text-muted-foreground mt-2">{proof.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
