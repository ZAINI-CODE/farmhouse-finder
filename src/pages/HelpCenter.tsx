import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Mail, Phone, MessageCircle, FileText, Calendar, CreditCard, Home, Users } from "lucide-react";

const faqCategories = [
  {
    id: "bookings",
    title: "Bookings & Reservations",
    icon: Calendar,
    faqs: [
      {
        question: "How do I make a booking?",
        answer: "Browse our properties, select your preferred venue, choose your event date, and follow the booking process. You'll need to create an account or sign in, then complete the payment to confirm your reservation."
      },
      {
        question: "Can I modify my booking after confirmation?",
        answer: "Yes, you can modify your booking up to 7 days before the event date. Go to your Dashboard, find your booking, and click 'Modify Booking'. Changes may affect the total price depending on availability."
      },
      {
        question: "What is the cancellation policy?",
        answer: "Cancellation policies vary by property. Generally, cancellations made more than 14 days before the event receive a full refund, 7-14 days receive 50% refund, and less than 7 days may not be refundable. Check the specific property's policy before booking."
      },
      {
        question: "How far in advance can I book?",
        answer: "You can book properties up to 12 months in advance. We recommend booking popular venues at least 3-6 months ahead, especially for peak seasons and weekends."
      }
    ]
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets. Bank transfers are available for large bookings."
      },
      {
        question: "Is my payment secure?",
        answer: "Absolutely. We use industry-standard SSL encryption and partner with trusted payment processors. Your financial information is never stored on our servers."
      },
      {
        question: "When will I be charged?",
        answer: "A deposit (typically 30-50%) is charged at the time of booking. The remaining balance is charged 7 days before your event date. You'll receive email reminders before each charge."
      },
      {
        question: "How do refunds work?",
        answer: "Refunds are processed within 5-7 business days after approval. The amount refunded depends on when you cancel and the property's cancellation policy. Refunds are credited to the original payment method."
      }
    ]
  },
  {
    id: "properties",
    title: "Properties & Venues",
    icon: Home,
    faqs: [
      {
        question: "How are properties verified?",
        answer: "All properties undergo a thorough verification process including document verification, site visits, and quality assessments. We ensure they meet our safety and quality standards before listing."
      },
      {
        question: "Can I visit a property before booking?",
        answer: "Yes! We encourage property visits. Contact the property owner through our platform to schedule a visit. Most owners are happy to accommodate viewing requests during reasonable hours."
      },
      {
        question: "What amenities are included?",
        answer: "Amenities vary by property and are clearly listed on each property page. Common inclusions are parking, basic furniture, kitchen access, and restrooms. Additional amenities may be available at extra cost."
      },
      {
        question: "What's the guest capacity?",
        answer: "Each property has a maximum guest capacity listed on its page. This is set for safety and comfort. Exceeding the capacity may result in additional charges or booking cancellation."
      }
    ]
  },
  {
    id: "vendors",
    title: "Vendors & Services",
    icon: Users,
    faqs: [
      {
        question: "How do I add vendor services to my booking?",
        answer: "During the booking process, you can browse and add vendor services like catering, photography, and decoration. You can also add services later through your booking dashboard."
      },
      {
        question: "Are vendors verified?",
        answer: "Yes, all vendors go through our verification process including business documentation, portfolio review, and reference checks. Look for the 'Verified' badge on vendor profiles."
      },
      {
        question: "Can I bring my own vendors?",
        answer: "Most properties allow outside vendors, though some may have preferred vendor lists. Check the property details or contact the owner. Note that we can only guarantee service quality for vendors booked through our platform."
      },
      {
        question: "How do I become a vendor on BookFarm?",
        answer: "Click 'Become a Vendor' in the footer or visit our vendor registration page. You'll need to provide business details, portfolio, and undergo our verification process. Approval typically takes 3-5 business days."
      }
    ]
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: FileText,
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign Up' in the navigation bar. You can register using your email address or sign in with Google. Fill in your details and verify your email to complete registration."
      },
      {
        question: "I forgot my password. What do I do?",
        answer: "Click 'Login' then 'Forgot Password'. Enter your registered email address, and we'll send you a password reset link. The link expires in 24 hours for security."
      },
      {
        question: "How do I update my profile information?",
        answer: "Go to your Dashboard and click on 'Profile Settings'. You can update your name, phone number, email, and profile picture. Some changes may require email verification."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account from Profile Settings. Note that this action is permanent and will cancel any pending bookings. Active bookings must be completed or cancelled first."
      }
    ]
  }
];

const contactOptions = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    action: "funfarmhousedeals@gmail.com",
    buttonText: "Send Email"
  },
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    description: "Available Mon-Sat, 9 AM - 6 PM",
    action: "0303-8032173",
    buttonText: "Call / WhatsApp"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "chat",
    buttonText: "Start Chat"
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-background text-foreground"
              />
            </div>
          </div>
        </section>

        {/* Quick Category Links */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <category.icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{category.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            {searchQuery && filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No results found for "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}

            <div className="space-y-8">
              {(searchQuery ? filteredFaqs : faqCategories)
                .filter(category => !activeCategory || category.id === activeCategory)
                .map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold">{category.title}</h3>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.id}-${index}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-4">
              Still need help?
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Our support team is here to assist you. Choose your preferred way to reach us.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactOptions.map((option, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <option.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="font-heading">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-foreground mb-4">{option.action !== "chat" ? option.action : ""}</p>
                    <Button 
                      variant={index === 2 ? "default" : "outline"}
                      className="w-full"
                      onClick={() => {
                        if (option.action.includes("@")) {
                          window.location.href = `mailto:${option.action}`;
                        } else if (option.action.includes("+")) {
                          window.location.href = `tel:${option.action}`;
                        }
                      }}
                    >
                      {option.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
