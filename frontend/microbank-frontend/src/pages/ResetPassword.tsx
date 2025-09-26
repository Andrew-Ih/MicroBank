import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Banknote, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains number', met: /\d/.test(formData.password) },
  ];

  // Check if token is invalid/missing (in real app, you'd validate this server-side)
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md border-border/50 shadow-elegant">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Banknote className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-destructive">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="mt-2">
                This password reset link is invalid or has expired
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please request a new password reset link to continue.
            </p>
            
            <Link to="/forgot-password">
              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-all">
                Request New Reset Link
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md border-border/50 shadow-elegant">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                Password Reset Complete
              </CardTitle>
              <CardDescription className="mt-2">
                Your password has been successfully updated
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
            
            <Link to="/login">
              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-all group">
                Sign In Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
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
              Reset Password
            </CardTitle>
            <CardDescription className="mt-2">
              Create a new secure password for your account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {formData.password && (
                <div className="space-y-1 mt-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-green-500' : 'bg-muted'
                      }`}>
                        {req.met && <Check className="w-2 h-2 text-white" />}
                      </div>
                      <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-all group"
              size="lg"
              disabled={
                formData.password !== formData.confirmPassword ||
                !passwordRequirements.every(req => req.met)
              }
            >
              Update Password
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login">
              <Button variant="ghost">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}