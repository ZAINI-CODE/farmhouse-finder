import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Camera, 
  Home, 
  Users,
  Lightbulb,
  CheckCircle
} from "lucide-react";

const guides = [
  {
    icon: Home,
    title: "Property Owner's Complete Guide",
    description: "Everything you need to know about listing and managing your property on BookFarm.",
    type: "PDF Guide",
    link: "#"
  },
  {
    icon: Camera,
    title: "Photography Tips for Listings",
    description: "Learn how to capture stunning photos that attract more bookings.",
    type: "PDF Guide",
    link: "#"
  },
  {
    icon: Users,
    title: "Vendor Success Handbook",
    description: "Best practices for growing your service business on our platform.",
    type: "PDF Guide",
    link: "#"
  },
  {
    icon: Lightbulb,
    title: "Event Planning 101",
    description: "A comprehensive guide to planning the perfect event at a farmhouse venue.",
    type: "PDF Guide",
    link: "#"
  },
];

const tutorials = [
  {
    title: "How to Create Your First Listing",
    duration: "5 min",
    description: "Step-by-step walkthrough of creating an attractive property listing."
  },
  {
    title: "Managing Your Booking Calendar",
    duration: "4 min",
    description: "Learn to efficiently manage availability and bookings."
  },
  {
    title: "Setting Up Custom Pricing",
    duration: "3 min",
    description: "Configure seasonal pricing and special rates."
  },
  {
    title: "Responding to Booking Requests",
    duration: "4 min",
    description: "Best practices for handling inquiries and accepting bookings."
  },
  {
    title: "Using the Messaging System",
    duration: "3 min",
    description: "Communicate effectively with guests and resolve issues."
  },
  {
    title: "Understanding Your Analytics",
    duration: "5 min",
    description: "Make data-driven decisions with our reporting tools."
  },
];

const checklists = [
  {
    title: "Property Listing Checklist",
    items: [
      "High-quality photos (minimum 10)",
      "Accurate property description",
      "Complete amenities list",
      "Clear pricing structure",
      "Availability calendar updated",
      "House rules defined",
      "Cancellation policy set"
    ]
  },
  {
    title: "Pre-Event Preparation",
    items: [
      "Confirm booking details with guest",
      "Prepare property for guests",
      "Check all amenities are working",
      "Ensure cleanliness standards",
      "Stock essential supplies",
      "Brief on-site staff",
      "Prepare emergency contacts"
    ]
  },
  {
    title: "Post-Event Checklist",
    items: [
      "Conduct property inspection",
      "Document any damages",
      "Complete cleaning",
      "Request guest review",
      "Process damage claims if needed",
      "Update availability calendar",
      "Review booking performance"
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-accent-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Resources & Guides
            </h1>
            <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto">
              Everything you need to succeed as a property owner or vendor on BookFarm.
            </p>
          </div>
        </section>

        {/* Downloadable Guides */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="h-6 w-6 text-accent" />
              <h2 className="font-heading text-2xl font-bold">Downloadable Guides</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {guides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <guide.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{guide.type}</span>
                          <Button asChild size="sm" variant="outline">
                            <a href={guide.link} download>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Video className="h-6 w-6 text-accent" />
              <h2 className="font-heading text-2xl font-bold">Video Tutorials</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{tutorial.description}</p>
                    <span className="text-xs text-accent">{tutorial.duration}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Checklists */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle className="h-6 w-6 text-accent" />
              <h2 className="font-heading text-2xl font-bold">Checklists</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {checklists.map((checklist, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">{checklist.title}</h3>
                    <ul className="space-y-2">
                      {checklist.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Need More Help */}
        <section className="py-16 bg-primary text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-accent-foreground/80 mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team and community are here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/help">Visit Help Center</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-accent-foreground hover:bg-primary-foreground/10">
                <Link to="/community">Join Community</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
