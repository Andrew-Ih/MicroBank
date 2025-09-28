import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Microbank
            </h1>
            <Badge variant="outline" className="text-xs">
              Lite+
            </Badge>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Modern Banking
              <br />
              Reimagined
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of banking with real-time updates, secure transactions, 
              and a beautiful interface powered by polyglot microservices architecture.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-all group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-large transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Secure & Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-grade security with end-to-end encryption and fraud protection.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-large transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Instant notifications and live transaction updates as they happen.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-large transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Modern Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Beautiful, intuitive interface designed for the modern user.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-16">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Microbank Lite+ - Polyglot Microservices Banking Platform
          </p>
          <p className="text-xs text-muted-foreground">
            Rails • Kotlin • React • SNS/SQS • S3 • PostgreSQL • Observability
          </p>
        </div>
      </footer>
    </div>
  );
}