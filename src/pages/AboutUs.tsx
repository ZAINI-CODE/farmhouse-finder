import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Heart, Users, Award, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To make finding and booking the perfect farmhouse venue as simple and enjoyable as the celebrations they host."
  },
  {
    icon: Heart,
    title: "Our Vision",
    description: "To become the most trusted platform connecting people with unique rural venues for their most memorable moments."
  },
  {
    icon: Users,
    title: "Community First",
    description: "We believe in empowering local property owners and vendors while creating unforgettable experiences for our customers."
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Every property and vendor is carefully vetted to ensure they meet our high standards of quality and service."
  }
];

const team = [
  {
    name: "Sarah Mitchell",
    role: "Founder & CEO",
    bio: "Former event planner with 15 years of experience. Sarah founded BookFarm to solve the challenge of finding unique venues.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    bio: "Tech veteran from Silicon Valley. Michael leads our engineering team in building a seamless booking experience.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Operations",
    bio: "Operations expert ensuring every booking runs smoothly. Emily oversees property verification and vendor partnerships.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  },
  {
    name: "David Thompson",
    role: "Head of Customer Success",
    bio: "Customer experience champion. David and his team ensure every BookFarm customer has an exceptional journey.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
  }
];

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "10,000+", label: "Events Hosted" },
  { value: "50,000+", label: "Happy Customers" },
  { value: "200+", label: "Verified Vendors" }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About BookFarm
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                We connect people with beautiful farmhouse venues and trusted vendors 
                to create unforgettable celebrations in stunning rural settings.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    BookFarm was born from a simple frustration: finding the perfect farmhouse 
                    venue for a wedding shouldn&apos;t be so difficult. Our founder, Sarah Mitchell, 
                    spent months searching for the ideal rural setting for her sister&apos;s wedding, 
                    only to find that beautiful properties existed but were nearly impossible to discover.
                  </p>
                  <p>
                    In 2020, we launched BookFarm with a handful of properties and a big dream. 
                    Today, we&apos;ve grown into a thriving community of property owners, vendors, 
                    and customers who share our passion for creating magical moments in unique settings.
                  </p>
                  <p>
                    Our platform doesn&apos;t just connect you with venues—we provide a complete 
                    ecosystem of verified vendors, from caterers to photographers, ensuring your 
                    event is perfect from start to finish.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1510076857177-7470076d4098?w=600&h=400&fit=crop"
                  alt="Beautiful farmhouse venue"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                  <p className="font-heading text-2xl font-bold">Since 2020</p>
                  <p className="text-sm opacity-90">Creating memories</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our values guide everything we do, from how we build our platform to how we serve our community.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind BookFarm who work tirelessly to make your celebrations perfect.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                    <div className="flex gap-3 mt-4">
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                <p className="text-muted-foreground">
                  Have questions or want to learn more? We&apos;d love to hear from you.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <a href="mailto:hello@bookfarm.com" className="text-primary hover:underline">
                      hello@bookfarm.com
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <a href="tel:+15551234567" className="text-primary hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Visit Us</h3>
                    <p className="text-muted-foreground">
                      San Francisco, CA
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Ready to find your perfect venue or list your property?
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/properties">Browse Properties</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/register?type=owner">List Your Property</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
