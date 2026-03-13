import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Award,
  Heart,
  Lightbulb,
  ExternalLink,
  Star
} from "lucide-react";

const communityFeatures = [
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    description: "Connect with other property owners and vendors. Share experiences, ask questions, and learn from the community."
  },
  {
    icon: Calendar,
    title: "Monthly Meetups",
    description: "Join our virtual and in-person meetups to network, learn new skills, and stay updated on industry trends."
  },
  {
    icon: Lightbulb,
    title: "Knowledge Sharing",
    description: "Access exclusive tips, case studies, and success stories from top-performing members."
  },
  {
    icon: Award,
    title: "Recognition Program",
    description: "Get recognized for your contributions. Top members receive badges, features, and exclusive perks."
  },
];

const upcomingEvents = [
  {
    title: "Property Photography Workshop",
    date: "January 25, 2026",
    time: "3:00 PM - 5:00 PM PKT",
    type: "Virtual",
    description: "Learn professional photography tips to make your listing stand out."
  },
  {
    title: "Lahore Property Owners Meetup",
    date: "February 8, 2026",
    time: "6:00 PM - 8:00 PM PKT",
    type: "In-Person",
    description: "Network with fellow property owners in Lahore. Light refreshments provided."
  },
  {
    title: "Pricing Strategy Masterclass",
    date: "February 15, 2026",
    time: "4:00 PM - 5:30 PM PKT",
    type: "Virtual",
    description: "Optimize your pricing to maximize revenue while staying competitive."
  },
];

const successStories = [
  {
    name: "Fatima Malik",
    role: "Property Owner",
    location: "DHA, Lahore",
    story: "Since joining BookFarm, my farmhouse bookings have increased by 200%. The platform made it so easy to reach customers I couldn't have found otherwise.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Usman Ahmed",
    role: "Catering Vendor",
    location: "Gulberg, Lahore",
    story: "The vendor marketplace feature changed my business. I now get quality leads directly from customers booking venues. It's been a game-changer.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Ayesha Hassan",
    role: "Event Planner",
    location: "Bahria Town, Lahore",
    story: "I recommend BookFarm to all my clients. The variety of venues and the ease of booking saves us so much time in event planning.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
];

const communityStats = [
  { value: "5,000+", label: "Community Members" },
  { value: "500+", label: "Property Owners" },
  { value: "200+", label: "Verified Vendors" },
  { value: "50+", label: "Events Hosted" },
];

export default function Community() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-accent-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <Users className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              BookFarm Community
            </h1>
            <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Join a thriving community of property owners, vendors, and event enthusiasts. Learn, share, and grow together.
            </p>
            <Button size="lg" variant="secondary">
              Join the Community
            </Button>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-heading text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">What Our Community Offers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {communityFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
              <h2 className="font-heading text-2xl font-bold">Upcoming Events</h2>
              <Button variant="outline" size="sm">
                View All Events
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${event.type === 'Virtual' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {event.type}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </span>
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <Button className="shrink-0">Register</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-4">Success Stories</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Hear from members who have grown their businesses with BookFarm.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {successStories.map((story, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{story.name}</h3>
                        <p className="text-sm text-muted-foreground">{story.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{story.story}"</p>
                    <p className="text-xs text-muted-foreground mt-3">{story.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-16 bg-primary text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="font-heading text-2xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-accent-foreground/80 mb-8 max-w-xl mx-auto">
              Become part of a community that supports each other's success. Whether you're a property owner, vendor, or event enthusiast, there's a place for you here.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Join Community
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-accent-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
