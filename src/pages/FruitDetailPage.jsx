import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFruitById } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { toast } from "@/Hooks/UseToast";

function FruitDetailPage() {
  const { id } = useParams();
  const [fruit, setFruit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFruit = async () => {
      setLoading(true);
      const { fruit, error } = await getFruitById(id);

      if (error) {
        console.error("Error loading fruit:", error);
        toast({
          title: "Error",
          description: "Failed to load fruit details.",
          variant: "destructive",
        });
        navigate("/fruits");
      } else {
        setFruit(fruit);
      }

      setLoading(false);
    };

    if (id) {
      loadFruit();
    }
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    if (!fruit.inStock) {
      toast({
        title: "Out of stock",
        description: "This item is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    addItem(fruit, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} ${
        quantity === 1 ? "item" : "items"
      } added to your cart`,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={handleGoBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-6">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fruit) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Fruit Not Found</h1>
          <p className="mb-6">
            The fruit you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/fruits")}>Browse All Fruits</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-white p-4 shadow-sm">
            <img
              src={fruit.image}
              alt={fruit.name}
              className="w-full h-auto object-cover rounded"
            />
          </div>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">
                {fruit.name}
              </CardTitle>
              <CardDescription className="text-xl font-bold text-emerald-600">
                {formatPrice(fruit.price)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{fruit.description}</p>
              </div>

              <div className="flex items-center gap-1 mt-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fruit.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {fruit.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {fruit.inStock && (
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 mx-2 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!fruit.inStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {fruit.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FruitDetailPage;
