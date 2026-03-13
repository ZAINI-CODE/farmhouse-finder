import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={cn(
        "z-50 transition-all duration-300",
        isHome
          ? "relative bg-transparent"
          : "sticky top-0 bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="BookFarm Logo" 
              className="w-10 h-10 rounded-xl shadow-sm transition-transform group-hover:scale-105"
            />
            <span
              className={cn(
                "font-heading font-bold text-xl transition-colors",
                isHome ? "text-primary-foreground" : "text-foreground"
              )}
            >
              BookFarm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "font-medium transition-colors hover:text-accent relative group",
                  isHome
                    ? "text-primary-foreground/90 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  location.pathname === link.href && "text-accent"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300",
                    location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="flex items-center gap-1 overflow-hidden"
                >
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search properties..."
                    className="h-9 text-sm"
                    onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                  />
                  <Button type="submit" size="sm" className="h-9 px-2">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  title="Search properties"
                  className={cn(
                    isHome
                      ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      : ""
                  )}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </AnimatePresence>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              title="Favorites"
              asChild
              className={cn(
                isHome
                  ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : ""
              )}
            >
              <Link to={user ? "/favorites" : "/login"}>
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Messages */}
            <Button
              variant="ghost"
              size="icon"
              title="Messages"
              asChild
              className={cn(
                isHome
                  ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : ""
              )}
            >
              <Link to={user ? "/dashboard?tab=messages" : "/login"}>
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            <div className={cn(
              isHome
                ? "[&_button]:text-primary-foreground/90 [&_button]:hover:text-primary-foreground [&_button]:hover:bg-primary-foreground/10"
                : ""
            )}>
              <ThemeToggle />
            </div>
            <div className="w-px h-6 bg-border mx-2" />
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant={isHome ? "hero-outline" : "outline"}
                    className={cn(isHome && "border-primary-foreground/30")}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button variant="accent" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant={isHome ? "hero-outline" : "outline"}
                    className={cn(isHome && "border-primary-foreground/30")}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isHome
                ? "text-primary-foreground hover:bg-primary-foreground/10"
                : "text-foreground hover:bg-muted"
            )}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 bg-card/95 backdrop-blur-md rounded-xl mb-4 px-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search properties or location..."
                    className="flex-1 h-10"
                  />
                  <Button type="submit" size="sm" className="h-10">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block py-2 px-4 rounded-lg font-medium transition-colors",
                      location.pathname === link.href
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  to={user ? "/favorites" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  Favorites
                </Link>

                <Link
                  to={user ? "/dashboard?tab=messages" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </Link>

                <div className="flex items-center justify-between py-2 px-4">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="pt-4 border-t border-border space-y-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="accent" className="w-full" onClick={() => { signOut(); setIsOpen(false); }}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/register" className="block" onClick={() => setIsOpen(false)}>
                        <Button variant="accent" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
