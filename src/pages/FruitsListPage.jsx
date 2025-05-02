import { useState, useEffect } from "react";
import { getFruits } from "@/lib/supabase";
import FruitCard from "@/components/fruits/FruitCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

function FruitsListPage() {
  const [fruits, setFruits] = useState([]);
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  useEffect(() => {
    const loadFruits = async () => {
      setLoading(true);
      const { fruits, error } = await getFruits();

      if (error) {
        console.error("Error loading fruits:", error);
      } else {
        setFruits(fruits || []);
        setFilteredFruits(fruits || []);
      }

      setLoading(false);
    };

    loadFruits();
  }, []);

  // Filter and sort fruits when search term or sort option changes
  useEffect(() => {
    let result = [...fruits];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (fruit) =>
          fruit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fruit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredFruits(result);
  }, [fruits, searchTerm, sortOption]);

  // Create loading skeleton array
  const loadingSkeletons = Array(12).fill(null);

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Browse Our Fruits
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide selection of fresh, high-quality fruits sourced
            from the best farms.
          </p>
        </div>

        {/* Filters and sort section */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search fruits..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading
              ? "Loading fruits..."
              : `Showing ${filteredFruits.length} fruits`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingSkeletons.map((_, index) => (
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
          <>
            {filteredFruits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">
                  No fruits found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredFruits.map((fruit) => (
                  <FruitCard key={fruit.id} fruit={fruit} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FruitsListPage;
