import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-white text-blue-700 hover:bg-blue-50">
                Revolutionary MLM Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Build Your Financial Freedom with Our Binary Matrix System
              </h1>
              <p className="text-xl text-blue-100">
                Join thousands of successful entrepreneurs in our advanced MLM
                network and unlock unlimited earning potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-blue-700"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
                alt="MLM Success"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Active Members" },
              { value: "$5M+", label: "Paid in Commissions" },
              { value: "150+", label: "Countries" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Zocial MLM System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers everything you need to build and manage a
              successful network marketing business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10 text-blue-600" />,
                title: "Binary Matrix Structure",
                description:
                  "Our powerful binary matrix system allows for balanced team growth and maximizes your earning potential.",
              },
              {
                icon: <TrendingUp className="h-10 w-10 text-blue-600" />,
                title: "Multiple Income Streams",
                description:
                  "Earn through direct referrals, level bonuses, matching bonuses, and leadership rewards.",
              },
              {
                icon: <Award className="h-10 w-10 text-blue-600" />,
                title: "Rank Advancement",
                description:
                  "Progress through our rank system and unlock higher commissions and exclusive benefits.",
              },
              {
                icon: <Shield className="h-10 w-10 text-blue-600" />,
                title: "Secure Platform",
                description:
                  "State-of-the-art security measures to protect your data and earnings at all times.",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-blue-600" />,
                title: "Transparent Commissions",
                description:
                  "Real-time tracking of your earnings with detailed reports and analytics.",
              },
              {
                icon: <ArrowRight className="h-10 w-10 text-blue-600" />,
                title: "Fast Withdrawals",
                description:
                  "Quick and hassle-free withdrawal process with multiple payment options.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Process</Badge>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with our Zocial MLM system is simple and
              straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Register",
                description:
                  "Create your account and complete your profile setup.",
              },
              {
                step: "02",
                title: "Choose a Plan",
                description:
                  "Select an investment plan that suits your goals and budget.",
              },
              {
                step: "03",
                title: "Build Your Network",
                description:
                  "Invite others to join your team using your referral link.",
              },
              {
                step: "04",
                title: "Earn Rewards",
                description:
                  "Start earning commissions as your network grows and performs.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg p-6 shadow-md relative z-10">
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-blue-200 z-0 transform translate-x-1/2">
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our members who have achieved financial success with our
              MLM Matrix system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Gold Member",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                quote:
                  "I've been with Zocial MLM for just 6 months and I've already built a team of over 100 members. The binary structure makes it so easy to grow!",
              },
              {
                name: "Michael Rodriguez",
                role: "Platinum Member",
                image:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                quote:
                  "The compensation plan is the best I've seen in the industry. I'm earning more with Zocial MLM than I did in my corporate job of 15 years.",
              },
              {
                name: "Jennifer Lee",
                role: "Diamond Member",
                image:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
                quote:
                  "What I love most is the transparency. I can see exactly how my commissions are calculated and track my team's performance in real-time.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/testimonials">
              <Button variant="outline">
                View More Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our community today and start building your path to financial
            freedom with our powerful Zocial MLM system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Register Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
