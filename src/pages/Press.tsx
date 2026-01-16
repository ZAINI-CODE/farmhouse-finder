import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, ExternalLink, Newspaper, Award, TrendingUp } from "lucide-react";

const pressReleases = [
  {
    date: "December 2025",
    title: "BookFarm Expands to 50 Cities Across Pakistan",
    summary: "Reaching new milestones in connecting people with unique venues nationwide.",
    link: "#"
  },
  {
    date: "October 2025",
    title: "BookFarm Raises PKR 100 Million Series A",
    summary: "Funding to accelerate growth and enhance platform capabilities.",
    link: "#"
  },
  {
    date: "July 2025",
    title: "Partnership with Leading Event Planners Association",
    summary: "Collaboration to bring professional event planning services to our platform.",
    link: "#"
  },
  {
    date: "March 2025",
    title: "BookFarm Launches Vendor Marketplace",
    summary: "New feature allows customers to book catering, photography, and more alongside venues.",
    link: "#"
  },
];

const mediaFeatures = [
  {
    outlet: "Dawn News",
    title: "The Startup Revolutionizing Event Venues in Pakistan",
    date: "November 2025"
  },
  {
    outlet: "Express Tribune",
    title: "BookFarm Makes Wedding Planning Hassle-Free",
    date: "September 2025"
  },
  {
    outlet: "Tech in Asia",
    title: "Pakistani Startup BookFarm Secures Series A Funding",
    date: "October 2025"
  },
  {
    outlet: "Profit by Pakistan Today",
    title: "How BookFarm is Digitizing the Event Industry",
    date: "August 2025"
  },
];

const companyFacts = [
  { label: "Founded", value: "2020" },
  { label: "Headquarters", value: "Lahore, Pakistan" },
  { label: "Properties Listed", value: "500+" },
  { label: "Events Hosted", value: "10,000+" },
  { label: "Happy Customers", value: "50,000+" },
  { label: "Verified Vendors", value: "200+" },
  { label: "Cities Covered", value: "50+" },
  { label: "Team Size", value: "40+" },
];

export default function Press() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Press & Media
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Get the latest news about BookFarm, access our media kit, and find contact information for press inquiries.
            </p>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
              <div>
                <h2 className="font-heading text-xl font-semibold mb-2">Media Contact</h2>
                <p className="text-muted-foreground">For press inquiries, interviews, and media requests</p>
              </div>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <a href="mailto:press@bookfarm.com">
                    <Mail className="h-4 w-4 mr-2" />
                    press@bookfarm.com
                  </a>
                </Button>
                <Button asChild>
                  <a href="#" download>
                    <Download className="h-4 w-4 mr-2" />
                    Media Kit
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Company Facts */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-center mb-8">Company at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {companyFacts.map((fact, index) => (
                <div key={index} className="text-center bg-background p-6 rounded-xl">
                  <p className="font-heading text-2xl font-bold text-primary">{fact.value}</p>
                  <p className="text-sm text-muted-foreground">{fact.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8 max-w-4xl mx-auto">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="font-heading text-2xl font-bold">Press Releases</h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {pressReleases.map((release, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{release.date}</p>
                        <h3 className="font-semibold mb-2">{release.title}</h3>
                        <p className="text-sm text-muted-foreground">{release.summary}</p>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="shrink-0">
                        <a href={release.link}>
                          Read More
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Media Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8 max-w-4xl mx-auto">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="font-heading text-2xl font-bold">Featured In</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {mediaFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-primary mb-1">{feature.outlet}</p>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Assets */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Brand Assets</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Download our official logos, brand guidelines, and approved images for use in your publications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="outline">
                <a href="#" download>
                  <Download className="h-4 w-4 mr-2" />
                  Logo Pack
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#" download>
                  <Download className="h-4 w-4 mr-2" />
                  Brand Guidelines
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#" download>
                  <Download className="h-4 w-4 mr-2" />
                  Product Screenshots
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
