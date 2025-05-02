import Banner from "@/components/home/Banner";
import FeaturedFruits from "@/components/fruits/FeaturedFruits";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Award, Clock, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <Banner />

      {/* Featured Fruits Section */}
      <FeaturedFruits />

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose FreshFruits?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the freshest, highest quality fruits
              directly from farm to your table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">
                Free shipping on all orders over $50, delivered right to your
                doorstep.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Hand-selected fruits of the highest quality, ensuring excellent
                taste.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day delivery available to ensure maximum freshness.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organic Options</h3>
              <p className="text-gray-600">
                Wide selection of certified organic fruits for health-conscious
                customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to taste the difference?
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl">
                Join thousands of satisfied customers who have made FreshFruits
                their go-to choice for premium quality fruits. Order now and
                experience freshness like never before.
              </p>
              <Link to="/fruits">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Shop Our Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.pexels.com/photos/1132040/pexels-photo-1132040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Assorted fruits in a basket"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
