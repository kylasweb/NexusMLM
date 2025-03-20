import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicLayout from "./layout/PublicLayout";

export default function Home() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4">
        <div className="py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Welcome to Nexus MLM
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our powerful binary matrix MLM platform and start building your network today.
            Experience the future of network marketing with our advanced tools and features.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Nexus MLM?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Binary Matrix System</h3>
              <p className="text-muted-foreground">
                Benefit from our optimized binary placement system that maximizes your earning potential.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Smart Compensation</h3>
              <p className="text-muted-foreground">
                Earn through multiple income streams with our innovative compensation plan.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track your network growth and earnings with advanced reporting tools.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful networkers who have already chosen Nexus MLM.
          </p>
          <Link to="/register">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
