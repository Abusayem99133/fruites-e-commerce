import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-black shadow-md py-2"
          : "bg-transparent text-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Apple
            size={28}
            className={isScrolled ? "text-emerald-600" : "text-white"}
          />
          <span className="font-bold text-xl">FreshFruits</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {["/", "/fruits", "/about", "/contact"].map((path, index) => (
            <Link
              key={index}
              to={path}
              className="hover:text-emerald-500 transition-colors"
            >
              {path === "/"
                ? "Home"
                : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart
              size={24}
              className={`${
                isScrolled ? "text-black" : "text-white"
              } hover:text-emerald-500 transition-colors`}
            />
          </Link>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    isScrolled
                      ? "text-black hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <User size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate("/signin")}
              variant={isScrolled ? "outline" : "secondary"}
              className={
                isScrolled ? "" : "bg-white/10 hover:bg-white/20 text-white"
              }
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                size={24}
                className={isScrolled ? "text-black" : "text-white"}
              />
            ) : (
              <Menu
                size={24}
                className={isScrolled ? "text-black" : "text-white"}
              />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-black shadow-md p-4">
          <div className="flex flex-col space-y-4">
            {["/", "/fruits", "/about", "/contact"].map((path, index) => (
              <Link
                key={index}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-emerald-500 transition-colors py-2"
              >
                {path === "/"
                  ? "Home"
                  : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-emerald-500 transition-colors py-2"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-emerald-500 transition-colors py-2"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-left hover:text-emerald-500 transition-colors py-2"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-emerald-500 transition-colors py-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
