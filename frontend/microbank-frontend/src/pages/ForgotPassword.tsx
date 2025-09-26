import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock email sending
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md border-border/50 shadow-elegant">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Check Your Email
              </CardTitle>
              <CardDescription className="mt-2">
                We've sent password reset instructions to
              </CardDescription>
              <p className="text-sm font-medium text-foreground mt-1">{email}</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
              >
                Try Different Email
              </Button>
              
              <Link to="/login">
                <Button variant="ghost" className="w-full group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md border-border/50 shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Banknote className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Forgot Password?
            </CardTitle>
            <CardDescription className="mt-2">
              Enter your email and we'll send you reset instructions
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-all group"
              size="lg"
            >
              Send Reset Instructions
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}