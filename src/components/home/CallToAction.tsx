import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Owners */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 lg:p-10 border border-border relative overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Home className="h-7 w-7 text-accent" />
              </div>
              
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Own a Farmhouse?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                List your property on BookFarm and reach thousands of potential guests. 
                Set your own prices, manage bookings easily, and grow your business.
              </p>
              
              <ul className="space-y-3 mb-8">
                {["Free listing setup", "Secure payments", "24/7 support", "Marketing tools"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground">
                    <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link to="/register?type=owner">
                <Button variant="accent" size="lg" className="group/btn">
                  List Your Property
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Service Providers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative">
              <div className="w-14 h-14 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="h-7 w-7 text-primary-foreground" />
              </div>
              
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Offer Event Services?
              </h3>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Join our vendor marketplace and connect with customers looking for catering, 
                photography, decoration, and more.
              </p>
              
              <ul className="space-y-3 mb-8">
                {["Reach new customers", "Showcase your portfolio", "Easy booking management", "Grow your brand"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-primary-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link to="/register?type=vendor">
                <Button variant="hero" size="lg" className="group/btn">
                  Become a Vendor
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
