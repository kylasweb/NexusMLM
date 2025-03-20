import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import PublicLayout from "../layout/PublicLayout";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
  sponsorId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const defaultSponsorId = searchParams.get("ref");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      sponsorId: defaultSponsorId || "",
    },
  });

  // Fetch sponsor name when sponsor ID changes
  useEffect(() => {
    async function fetchSponsorName() {
      const sponsorId = form.getValues("sponsorId");
      if (!sponsorId) {
        setSponsorName(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", sponsorId)
          .single();

        if (error) throw error;
        setSponsorName(data.full_name);
      } catch (error) {
        setSponsorName(null);
        console.error("Error fetching sponsor name:", error);
      }
    }

    fetchSponsorName();
  }, [form.watch("sponsorId")]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signUp(values.email, values.password, values.fullName, values.sponsorId);
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Join the most powerful MLM platform and start building your network.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sponsorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sponsor ID" {...field} />
                    </FormControl>
                    {sponsorName && (
                      <FormDescription>
                        Sponsor: {sponsorName}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
