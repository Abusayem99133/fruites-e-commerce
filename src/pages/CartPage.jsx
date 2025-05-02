import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/Hooks/UseToast";
import { useCart } from "@/Contexts/CartContext";

function CartPage() {
  const { cartItems, removeItem, updateQuantity, cartTotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to proceed to checkout",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any fruits to your cart yet.
            </p>
            <Link to="/fruits">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Browse Fruits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Cart Items ({items.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
                  </Button>
                </div>

                <div className="divide-y">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row"
                    >
                      {/* Product image */}
                      <div className="flex-shrink-0 sm:w-24 h-24 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-grow sm:ml-6 flex flex-col sm:flex-row sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end">
                          {/* Quantity controls */}
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center mt-3">
                            <p className="font-semibold mr-4">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
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

              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-6">
                <Link to="/fruits">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
