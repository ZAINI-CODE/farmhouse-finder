import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Fatima & Ahmed",
    event: "Wedding",
    avatar: "FA",
    rating: 5,
    text: "BookFarm made our wedding venue search so easy! We found the perfect farmhouse in DHA and the catering vendor through the platform. Everything was seamless.",
    location: "DHA Phase 6, Lahore",
  },
  {
    id: 2,
    name: "Hira Malik",
    event: "Corporate Retreat",
    avatar: "HM",
    rating: 5,
    text: "Our company needed a unique venue for our annual retreat. The booking process was straightforward and the Raiwind farmhouse exceeded all expectations.",
    location: "Raiwind Road, Lahore",
  },
  {
    id: 3,
    name: "Usman Khan",
    event: "Birthday Party",
    avatar: "UK",
    rating: 5,
    text: "Threw my wife Ayesha's 40th birthday at a gorgeous farmhouse we found here. The host was wonderful and the memories are priceless!",
    location: "Bedian Road, Lahore",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-medium"
          >
            Success Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl font-bold text-accent-foreground mt-2"
          >
            What Our Customers Say
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card rounded-2xl p-6 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-accent">
                <Quote className="h-5 w-5 text-accent-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-semibold text-secondary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.event} • {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
