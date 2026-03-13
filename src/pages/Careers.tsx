import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Heart, 
  Zap, 
  Users, 
  Gift,
  Coffee,
  GraduationCap,
  Plane
} from "lucide-react";

const openPositions = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Lahore (Hybrid)",
    type: "Full-time",
    description: "Build and scale our platform using React, Node.js, and PostgreSQL."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Lahore (On-site)",
    type: "Full-time",
    description: "Create beautiful, user-centered designs for our web and mobile platforms."
  },
  {
    title: "Customer Success Manager",
    department: "Operations",
    location: "Lahore (On-site)",
    type: "Full-time",
    description: "Help property owners and customers get the most out of BookFarm."
  },
  {
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive growth through digital marketing, content, and brand campaigns."
  },
  {
    title: "Business Development Executive",
    department: "Sales",
    location: "Lahore (On-site)",
    type: "Full-time",
    description: "Expand our property and vendor network across Pakistan."
  },
  {
    title: "Quality Assurance Engineer",
    department: "Engineering",
    location: "Lahore (Hybrid)",
    type: "Full-time",
    description: "Ensure our platform delivers a flawless user experience."
  },
];

const benefits = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical coverage for you and your family" },
  { icon: Coffee, title: "Free Meals", description: "Daily lunch and unlimited snacks at the office" },
  { icon: Plane, title: "Paid Time Off", description: "20 days annual leave plus public holidays" },
  { icon: GraduationCap, title: "Learning Budget", description: "PKR 50,000 annual budget for courses and conferences" },
  { icon: Zap, title: "Flexible Hours", description: "Work when you're most productive" },
  { icon: Gift, title: "Annual Bonus", description: "Performance-based bonus and profit sharing" },
];

const values = [
  {
    title: "Customer First",
    description: "Every decision we make starts with 'How does this help our users?'"
  },
  {
    title: "Move Fast",
    description: "We ship quickly, learn from feedback, and iterate constantly."
  },
  {
    title: "Be Transparent",
    description: "Open communication builds trust — with teammates and customers."
  },
  {
    title: "Own Your Work",
    description: "Take initiative, make decisions, and see projects through."
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-accent-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Help us transform how people discover and book event venues. We're building something special — and we want you to be part of it.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="#positions">View Open Positions</a>
            </Button>
          </div>
        </section>

        {/* About Working at BookFarm */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-6">Why BookFarm?</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At BookFarm, we're on a mission to make event planning joyful. We're a small but mighty team of engineers, designers, and operators who believe great experiences start with great venues.
                  </p>
                  <p>
                    We're growing fast and looking for passionate people who want to make an impact. Whether you're an experienced professional or just starting your career, if you're excited about building products people love, we'd love to hear from you.
                  </p>
                  <p>
                    Based in Lahore's vibrant tech hub, we offer a collaborative environment where your ideas matter and your growth is supported.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 bg-background p-6 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-4">Open Positions</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Find your next opportunity. We're always looking for talented people to join our team.
            </p>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {openPositions.map((position, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-2">{position.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {position.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {position.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                      </div>
                      <Button asChild className="shrink-0">
                        <a href={`mailto:careers@bookfarm.com?subject=Application: ${position.title}`}>
                          Apply Now
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Don't See a Fit */}
        <section className="py-16 bg-primary text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <Users className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="font-heading text-2xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-accent-foreground/80 mb-8 max-w-xl mx-auto">
              We're always interested in meeting talented people. Send us your resume and tell us how you can contribute to BookFarm.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="mailto:careers@bookfarm.com">Send Your Resume</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
