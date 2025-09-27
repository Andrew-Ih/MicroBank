import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { Bell, Settings, User, ChevronDown, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth0 } from '@auth0/auth0-react';

interface HeaderProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  notificationCount?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export function Header({ connectionStatus, notificationCount = 0, user }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user: auth0User, logout } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const displayUser = auth0User || user;
  const userInitials = displayUser?.name 
    ? displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : displayUser?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
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
        </div>

        {/* Connection Status */}
        <div className="hidden md:flex items-center space-x-4">
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-destructive text-destructive-foreground"
                  >
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notificationCount === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {Array.from({ length: Math.min(notificationCount, 5) }, (_, i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start space-y-1 p-4">
                      <p className="text-sm font-medium">Transaction Completed</p>
                      <p className="text-xs text-muted-foreground">
                        Your deposit of $500.00 has been processed
                      </p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {displayUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {displayUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}