import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { LogOut, Package, Clock, CheckCircle, XCircle, Loader2, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  course_code: string;
  assignment_details: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  deadline: string | null;
  created_at: string;
  service_id: string | null;
}

interface Service {
  id: string;
  title: string;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500", icon: RefreshCw },
  completed: { label: "Completed", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
};

export default function CandidateDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/candidate-auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/candidate-auth");
      } else {
        fetchData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    // Fetch orders
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
    } else {
      setOrders(ordersData || []);
    }

    // Fetch services for mapping
    const { data: servicesData } = await supabase
      .from("services")
      .select("id, title");

    if (servicesData) {
      const servicesMap: Record<string, string> = {};
      servicesData.forEach((s) => {
        servicesMap[s.id] = s.title;
      });
      setServices(servicesMap);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    navigate("/candidate-auth");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">My Dashboard</h1>
              <p className="text-primary-foreground/80">Welcome, {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/order">
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-serif font-bold mb-6">Your Orders</h2>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders. Start by placing your first order!
                </p>
                <Link to="/order">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Place Your First Order
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <CardTitle className="font-serif text-lg">
                            {order.course_code}
                          </CardTitle>
                          <CardDescription>
                            Order placed on {format(new Date(order.created_at), "PPP")}
                          </CardDescription>
                        </div>
                        <Badge className={`${status.color} text-white`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Service:</span>
                          <p>{order.service_id ? services[order.service_id] || "Custom" : "Not specified"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Deadline:</span>
                          <p>{order.deadline ? format(new Date(order.deadline), "PPP") : "Not specified"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-muted-foreground">Assignment Details:</span>
                          <p className="mt-1 whitespace-pre-wrap">{order.assignment_details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}