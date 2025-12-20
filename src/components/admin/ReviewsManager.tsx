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
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  customer_name: string;
  course_code: string | null;
  rating: number;
  review_text: string;
  is_published: boolean;
  created_at: string;
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: "",
    course_code: "",
    rating: "5",
    review_text: "",
    is_published: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      course_code: "",
      rating: "5",
      review_text: "",
      is_published: true,
    });
    setEditingReview(null);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      customer_name: review.customer_name,
      course_code: review.course_code || "",
      rating: review.rating.toString(),
      review_text: review.review_text,
      is_published: review.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      customer_name: formData.customer_name,
      course_code: formData.course_code || null,
      rating: parseInt(formData.rating),
      review_text: formData.review_text,
      is_published: formData.is_published,
    };

    if (editingReview) {
      const { error } = await supabase
        .from("reviews")
        .update(reviewData)
        .eq("id", editingReview.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update review.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Review updated successfully." });
        fetchReviews();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("reviews").insert([reviewData]);

      if (error) {
        toast({ title: "Error", description: "Failed to create review.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Review created successfully." });
        fetchReviews();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete review.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Review deleted successfully." });
      fetchReviews();
    }
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_published: !currentState })
      .eq("id", id);

    if (!error) {
      fetchReviews();
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-accent fill-accent" : "text-muted"}`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-serif">Reviews Management</CardTitle>
          <CardDescription>Add, edit, or remove customer testimonials</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReview ? "Edit Review" : "Add New Review"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Code</Label>
                  <Input
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    placeholder="e.g., MCA-101"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Review Text</Label>
                <Textarea
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label>Published</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingReview ? "Update Review" : "Create Review"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No reviews found. Add your first review!</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.customer_name}</TableCell>
                    <TableCell>
                      {review.course_code ? (
                        <Badge variant="outline">{review.course_code}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={review.is_published}
                        onCheckedChange={() => togglePublished(review.id, review.is_published)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(review)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
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