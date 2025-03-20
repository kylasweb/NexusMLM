import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "./layout/PublicLayout";
import { ArrowRight, Check, Users, DollarSign, Award, Shield } from "lucide-react";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Build Your Network Marketing Empire
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Join the most powerful binary matrix MLM platform with advanced tools,
                automated commissions, and real-time analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/hero-illustration.svg"
                alt="Network Marketing Illustration"
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose NexusMLM?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and scale your network marketing business
              in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Binary Matrix Structure"
              description="Powerful binary matrix with left/right legs and extreme positions, supporting 10 referral levels."
            />
            <FeatureCard
              icon={<DollarSign className="h-8 w-8 text-primary" />}
              title="Automated Commissions"
              description="Real-time commission calculations and instant payouts with multiple withdrawal options."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-primary" />}
              title="Rank System"
              description="Dynamic rank advancement system with customizable rewards and bonuses."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Secure Platform"
              description="Bank-grade security with 2FA, encryption, and regular security audits."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Team Management"
              description="Comprehensive tools for managing your downline and tracking performance."
            />
            <FeatureCard
              icon={<DollarSign className="h-8 w-8 text-primary" />}
              title="Investment Plans"
              description="Flexible investment plans with customizable ROI and durations."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your network marketing business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="$49"
              description="Perfect for beginners"
              features={[
                "Up to 100 team members",
                "Basic commission structure",
                "Email support",
                "Basic reporting",
              ]}
            />
            <PricingCard
              title="Professional"
              price="$99"
              description="For growing networks"
              features={[
                "Up to 1,000 team members",
                "Advanced commission structure",
                "Priority support",
                "Advanced analytics",
                "Custom branding",
              ]}
              highlighted
            />
            <PricingCard
              title="Enterprise"
              price="$199"
              description="For large organizations"
              features={[
                "Unlimited team members",
                "Custom commission rules",
                "24/7 dedicated support",
                "White-label solution",
                "API access",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your MLM Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of successful entrepreneurs who are building their
            network marketing business with our powerful platform.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="px-8"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function PricingCard({ title, price, description, features, highlighted = false }: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card className={highlighted ? "border-primary shadow-lg scale-105" : ""}>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <div className="text-3xl font-bold mb-2">{price}<span className="text-base font-normal">/month</span></div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link to="/register">
            <Button
              className="w-full"
              variant={highlighted ? "default" : "outline"}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
