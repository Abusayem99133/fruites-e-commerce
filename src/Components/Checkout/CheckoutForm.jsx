import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/supabase";
import { toast } from "@/Hooks/UseToast";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  address: z.string().min(5, { message: "Valid address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
  notes: z.string().optional(),
});

function CheckoutForm() {
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      notes: "",
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handlePayment = async (orderData) => {
    // This would be where the Stripe integration happens
    // For now, we just simulate a successful payment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: `pay_${Math.random().toString(36).substring(2, 10)}`,
        });
      }, 1500);
    });
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
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
      return;
    }

    setIsProcessing(true);

    try {
      // Create the order data
      const orderData = {
        user_id: user.id,
        total_amount: cartTotal,
        shipping_address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
        status: "pending",
        items: items.map((item) => ({
          fruit_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Process payment
      const paymentResult = await handlePayment(orderData);

      if (paymentResult.success) {
        // Save the order to the database
        const { order, error } = await createOrder({
          ...orderData,
          payment_id: paymentResult.paymentId,
          status: "paid",
        });

        if (error) {
          throw new Error("Failed to save your order. Please try again.");
        }

        // Clear the cart
        clearCart();

        // Show success message
        toast({
          title: "Order completed!",
          description:
            "Thank you for your purchase. Your order has been confirmed.",
        });

        // Redirect to success page
        navigate("/order-success", { state: { orderId: order.id } });
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Shipping Information</h2>
        <p className="text-muted-foreground">Enter your shipping details</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isProcessing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isProcessing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Special instructions for delivery"
                    disabled={isProcessing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t pt-6 mt-8">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ${formatPrice(cartTotal)}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CheckoutForm;
