import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Clock, 
  Lock,
  Star,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import heroImage from "@/assets/fintech-hero.jpg";

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your money is protected with enterprise-level security and encryption."
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Send and receive money instantly with real-time notifications."
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Access your account anywhere, anytime with our web platform."
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Optimized for all devices with a responsive, modern interface."
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "Track your spending with intelligent insights and analytics."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get help whenever you need it with our round-the-clock support."
  }
];

const stats = [
  { value: "100K+", label: "Active Users" },
  { value: "$50M+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    try {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        loginWithRedirect();
      }
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Star className="h-3 w-3 mr-1" />
                  Trusted by 100K+ users
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="text-primary block">Digital Banking</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Experience secure, instant, and intelligent banking with Microbank Lite+. 
                  Built for the modern world.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="btn-gradient text-lg px-8 py-6 h-auto"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {/* <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Watch Demo
                </Button> */}
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">4.9/5</strong> from 2,500+ reviews
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={heroImage} 
                  alt="Modern Banking Dashboard" 
                  className="w-full h-auto rounded-3xl shadow-fintech-hover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-success/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose Microbank Lite+?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology and designed for the future of finance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-fintech hover:shadow-fintech-hover transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Banking Made Simple
                </h2>
                <p className="text-xl text-muted-foreground">
                  Everything you need for modern banking in one beautiful, secure platform.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Real-time transaction notifications",
                  "Advanced security with biometric login", 
                  "Instant money transfers worldwide",
                  "Smart budgeting and analytics tools",
                  "24/7 customer support via chat"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="btn-gradient text-lg px-8 py-6 h-auto"
                onClick={handleGetStarted}
              >
                Start Banking Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="card-fintech">
                <CardContent className="p-6 text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank-grade security for all transactions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-fintech">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-success mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Instant</h3>
                  <p className="text-sm text-muted-foreground">
                    Lightning-fast transfers and payments
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-fintech">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-warning mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Smart</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered financial insights
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-fintech">
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Global</h3>
                  <p className="text-sm text-muted-foreground">
                    Banking without borders
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="card-fintech gradient-primary text-center p-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                Ready to Transform Your Banking?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Join thousands of users who have already made the switch to smarter banking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 py-6 h-auto bg-background text-foreground hover:bg-background/90"
                  onClick={handleGetStarted}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <div>
                <div className="font-bold text-primary">Microbank Lite+</div>
                <div className="text-xs text-muted-foreground">Digital Banking Platform</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Microbank Lite+. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}