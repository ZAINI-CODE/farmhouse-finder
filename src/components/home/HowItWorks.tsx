import { motion } from "framer-motion";
import { Search, Calendar, CreditCard, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse through hundreds of verified farmhouses and venues with detailed photos, amenities, and reviews.",
    color: "bg-accent",
  },
  {
    icon: Calendar,
    title: "Check Availability",
    description: "View real-time availability calendars and find the perfect date for your event.",
    color: "bg-primary-light",
  },
  {
    icon: CreditCard,
    title: "Book Securely",
    description: "Complete your booking with secure payment processing and instant confirmation.",
    color: "bg-accent",
  },
  {
    icon: PartyPopper,
    title: "Celebrate!",
    description: "Enjoy your event at a stunning venue with optional vendor services coordinated through our platform.",
    color: "bg-primary-light",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-medium"
          >
            Simple Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2"
          >
            How BookFarm Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-3 max-w-xl mx-auto"
          >
            Book your perfect venue in just a few simple steps
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}>
                    <step.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-card border-2 border-accent rounded-full flex items-center justify-center text-sm font-bold text-accent">
                    {index + 1}
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
