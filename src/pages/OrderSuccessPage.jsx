import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  // Redirect if no orderId is present
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6 text-emerald-500">
            <CheckCircle2 className="h-16 w-16 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Completed!</h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed
            and is being processed.
          </p>

          <div className="border rounded-lg p-4 mb-8 bg-gray-50 inline-block">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-medium">{orderId.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Link to="/dashboard">
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" /> View Order in Dashboard
              </Button>
            </Link>

            <Link to="/fruits">
              <Button variant="outline" className="w-full">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
