"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            We're Here to <span className="text-primary">Help</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our services or need assistance with your
            booking? Reached out to us directly.
          </p>
        </div>
      </section>

      {/* International Support Highlight */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border border-indigo-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="size-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 ring-1 ring-indigo-500/40">
                <span className="material-symbols-outlined text-indigo-300 text-5xl">
                  public
                </span>
              </div>

              <div className="text-center md:text-left space-y-4 flex-1">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                  International Client?
                </h2>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  Looking to consult from outside India? We accept payments in
                  <span className="font-bold text-white">
                    {" "}
                    USD, EUR, GBP, AUD
                  </span>{" "}
                  and more via PayPal or International Cards. Please fill the
                  form below or email us directly to get a payment link.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href="mailto:support@astraspiritual.com"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white text-indigo-900 px-8 font-semibold transition-transform hover:scale-105"
                >
                  <span className="material-symbols-outlined mr-2">mail</span>
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4">
                Contact Information
              </h3>
              <p className="text-muted-foreground">
                We typically respond within 24 hours. For urgent astrology
                consultations, please check the service availability calendar.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">
                    mail
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <a
                    href="mailto:support@astraspiritual.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    support@astraspiritual.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">
                    schedule
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Working Hours</h4>
                  <p className="text-muted-foreground">
                    Mon - Sat: 10:00 AM - 7:00 PM (IST)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-2xl font-serif font-bold mb-6">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="Jane" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="I have a question about..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
