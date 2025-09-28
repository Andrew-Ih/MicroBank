import { useEffect } from 'react';
import { ArrowRight, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
              Welcome Back
            </CardTitle>
            <CardDescription className="mt-2">
              Sign in to your Microbank account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Sign in to access your Microbank account
            </p>
            
            <Button
              onClick={() => loginWithRedirect()}
              className="w-full bg-gradient-primary hover:opacity-90 transition-all group"
              size="lg"
            >
              Sign In with Auth0
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}