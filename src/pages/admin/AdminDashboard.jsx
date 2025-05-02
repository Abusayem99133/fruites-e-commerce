import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFruits,
  createFruit,
  updateFruit,
  deleteFruit,
} from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import FruitForm from "@/components/admin/FruitForm";
import { toast } from "@/Hooks/UseToast";

function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const [fruits, setFruits] = useState([]);
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Load fruits data
  useEffect(() => {
    const loadFruits = async () => {
      setLoading(true);
      const { fruits, error } = await getFruits();

      if (error) {
        console.error("Error loading fruits:", error);
        toast({
          title: "Error",
          description: "Failed to load fruits data",
          variant: "destructive",
        });
      } else {
        setFruits(fruits || []);
        setFilteredFruits(fruits || []);
      }

      setLoading(false);
    };

    if (user && isAdmin) {
      loadFruits();
    }
  }, [user, isAdmin]);

  // Filter fruits when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFruits(fruits);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = fruits.filter((fruit) =>
        fruit.name.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredFruits(filtered);
    }
  }, [fruits, searchTerm]);

  const handleAddFruit = async (data) => {
    setIsSubmitting(true);
    try {
      const { fruit, error } = await createFruit(data);

      if (error) {
        throw new Error(error.message || "Failed to add fruit");
      }

      setFruits((prev) => [fruit, ...prev]);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Fruit added successfully",
      });
    } catch (error) {
      console.error("Error adding fruit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add fruit",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFruit = async (data) => {
    if (!selectedFruit) return;

    setIsSubmitting(true);
    try {
      const { fruit, error } = await updateFruit(selectedFruit.id, data);

      if (error) {
        throw new Error(error.message || "Failed to update fruit");
      }

      setFruits((prev) =>
        prev.map((item) => (item.id === fruit.id ? fruit : item))
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Fruit updated successfully",
      });
    } catch (error) {
      console.error("Error updating fruit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update fruit",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFruit = async () => {
    if (!selectedFruit) return;

    setIsSubmitting(true);
    try {
      const { error } = await deleteFruit(selectedFruit.id);

      if (error) {
        throw new Error(error.message || "Failed to delete fruit");
      }

      setFruits((prev) => prev.filter((item) => item.id !== selectedFruit.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Fruit deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting fruit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete fruit",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading || (user && !isAdmin)) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add New Fruit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Fruit</DialogTitle>
              </DialogHeader>
              <FruitForm
                onSubmit={handleAddFruit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search fruits..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredFruits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No fruits found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFruits.map((fruit) => (
                    <TableRow key={fruit.id}>
                      <TableCell>
                        <img
                          src={fruit.image}
                          alt={fruit.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {fruit.name}
                      </TableCell>
                      <TableCell>{formatPrice(fruit.price)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fruit.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fruit.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedFruit(fruit)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Fruit</DialogTitle>
                              </DialogHeader>
                              <FruitForm
                                fruit={selectedFruit}
                                onSubmit={handleUpdateFruit}
                                isSubmitting={isSubmitting}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                setSelectedFruit(fruit);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the fruit. This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={handleDeleteFruit}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
