import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/Hooks/UseToast";

function CheckoutPage() {
  const { user } = useAuth();
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Redirect if cart is empty or user is not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to proceed to checkout",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      });
      navigate("/fruits");
    }
  }, [user, items, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <CheckoutForm />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <span className="text-sm">
                        {item.name}{" "}
                        <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
