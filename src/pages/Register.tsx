import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Home, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import heroImage from "@/assets/hero-farmhouse.jpg";
import logo from "@/assets/logo.png";

type UserType = "customer" | "owner" | "vendor";

const userTypes = [
  {
    id: "customer" as UserType,
    title: "Customer",
    description: "Book venues and services for your events",
    icon: User,
  },
  {
    id: "owner" as UserType,
    title: "Property Owner",
    description: "List your farmhouse or venue",
    icon: Home,
  },
  {
    id: "vendor" as UserType,
    title: "Service Provider",
    description: "Offer catering, photography, etc.",
    icon: Briefcase,
  },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as UserType) || "customer";
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>(initialType);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registeredUserType, setRegisteredUserType] = useState<UserType>("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !showSuccessDialog) {
      navigate('/dashboard');
    }
  }, [user, navigate, showSuccessDialog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);
    
    const { error } = await signUp(
      formData.email, 
      formData.password, 
      formData.name, 
      formData.phone, 
      userType
    );
    
    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          variant: "destructive",
          title: "Account Exists",
          description: "An account with this email already exists. Please log in instead.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message,
        });
      }
    } else {
      setRegisteredUserType(userType);
      setShowSuccessDialog(true);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message,
      });
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard');
  };

  const getWelcomeMessage = () => {
    switch (registeredUserType) {
      case "owner":
        return "You can now list your properties and start receiving bookings from customers across Lahore!";
      case "vendor":
        return "You can now offer your services and connect with event organizers across Lahore!";
      default:
        return "You can now browse and book amazing farmhouses and venues for your events!";
    }
  };

  return (
    <>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-heading">
              Account Created Successfully!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Welcome to BookFarm, {formData.name}! {getWelcomeMessage()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button variant="accent" size="lg" onClick={handleGoToDashboard} className="w-full">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md py-8"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img 
                src={logo} 
                alt="BookFarm Logo" 
                className="w-10 h-10 rounded-xl shadow-sm"
              />
              <span className="font-heading font-bold text-xl text-foreground">BookFarm</span>
            </Link>

            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground mb-8">
              Join BookFarm and start your journey today
            </p>

            {/* User Type Selection */}
            <div className="mb-8">
              <label className="text-sm font-medium mb-3 block">I want to...</label>
              <div className="grid grid-cols-3 gap-3">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      userType === type.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <type.icon className={`h-6 w-6 mx-auto mb-2 ${
                      userType === type.id ? "text-accent" : "text-muted-foreground"
                    }`} />
                    <p className={`text-sm font-medium ${
                      userType === type.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {type.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Muhammad Ahmad"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <Checkbox className="mt-0.5" required />
                <span className="text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button variant="accent" size="xl" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="relative my-8">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
                or sign up with
              </span>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-medium hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:flex-1 relative">
          <img
            src={heroImage}
            alt="Beautiful farmhouse"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
                Join Our Community
              </h2>
              <p className="text-primary-foreground/80 max-w-md">
                Whether you're looking for the perfect venue in Lahore, want to list your property, or offer event services - BookFarm is your platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
