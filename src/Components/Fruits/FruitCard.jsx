import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/Hooks/UseToast";

function FruitCard({ fruit }) {
  const { id, name, price, image, instock } = fruit;
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/fruits/${id}`);
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

    if (!instock) {
      toast({
        title: "Out of stock",
        description: "Sorry, this item is currently unavailable",
        variant: "destructive",
      });
      return;
    }
    addItem(fruit);
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // console.log("in stock ", instock, fruit.instock, "fruits");
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Stock label */}
      {!instock && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          Out of Stock
        </div>
      )}

      {/* Image container */}
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 ">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-emerald-600 font-bold mt-1">{formatPrice(price)}</p>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewDetails}
          >
            <Eye className="mr-1 h-4 w-4" /> Details
          </Button>
          <Button
            variant={instock ? "default" : "secondary"}
            size="sm"
            className={`w-full ${
              instock
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleAddToCart}
            disabled={!instock}
          >
            <ShoppingCart className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FruitCard;
