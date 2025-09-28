import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'success',
    title: 'Transaction Completed',
    message: 'Your deposit of $2,500.00 has been successfully processed',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false
  },
  {
    id: 'notif_2', 
    type: 'info',
    title: 'Account Statement Ready',
    message: 'Your monthly statement for January is now available',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false
  },
  {
    id: 'notif_3',
    type: 'warning',
    title: 'Low Balance Alert',
    message: 'Your account balance is below your set threshold of $500.00',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-success bg-success/5';
      case 'warning':
        return 'border-l-warning bg-warning/5';
      case 'error':
        return 'border-l-destructive bg-destructive/5';
      case 'info':
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative hover:bg-accent/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <Card className="absolute right-0 top-full mt-2 w-96 z-50 card-fintech max-h-96 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="space-y-2 p-4 pt-0">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200
                          ${getColorClass(notification.type)}
                          ${!notification.read ? 'opacity-100' : 'opacity-60'}
                          hover:bg-accent/20
                        `}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}