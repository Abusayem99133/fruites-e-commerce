import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFruits } from "../../lib/supabase";
import FruitCard from "./FruitCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function FeaturedFruits() {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("useEffect inside FeaturedFruits running"); // ✅

    const loadFruits = async () => {
      // console.log("Calling getFruits()..."); // ✅
      setLoading(true);
      const { fruits, error } = await getFruits();

      // console.log("Fetched fruits:", fruits); // ✅
      // console.log("Fetch error:", error); // ✅

      if (error) {
        console.error("Error loading fruits:", error);
      } else {
        setFruits(fruits?.slice(0, 8) || []);
      }

      setLoading(false);
    };

    loadFruits();
  }, []);

  // useEffect(() => {
  //   const loadFruits = async () => {
  //     setLoading(true);
  //     const { fruits, error } = await getFruits();

  //     if (error) {
  //       console.error("Error loading fruits:", error);
  //     } else {
  //       // Get only first 8 fruits for featured section
  //       setFruits(fruits?.slice(0, 8) || []);
  //     }

  //     setLoading(false);
  //   };

  //   loadFruits();
  // }, []);

  // If we have no fruits data and are not in a loading state,
  // this means we either have an error or there is no fruits data
  const noFruits = !loading && fruits.length === 0;

  // Create loading skeleton array
  const loadingSkeletons = Array(8).fill(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Fruits
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of fresh, seasonal fruits. Sourced
            directly from trusted farms to ensure quality and freshness.
          </p>
        </div>

        {noFruits && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">
              No fruits available at the moment. Check back soon!
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingSkeletons?.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md p-4"
              >
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fruits?.map((fruit) => (
              <FruitCard key={fruit.id} fruit={fruit} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/fruits")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            size="lg"
          >
            View All Fruits
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedFruits;
