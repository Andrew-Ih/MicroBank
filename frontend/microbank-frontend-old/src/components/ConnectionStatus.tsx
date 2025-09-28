import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  className?: string;
}

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          variant: 'default' as const,
          className: 'text-success bg-success/10 border-success/20',
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Connecting...',
          variant: 'secondary' as const,
          className: 'text-warning bg-warning/10 border-warning/20',
        };
      case 'error':
        return {
          icon: AlertTriangle,
          text: 'Error',
          variant: 'destructive' as const,
          className: 'text-destructive bg-destructive/10 border-destructive/20',
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          text: 'Disconnected',
          variant: 'outline' as const,
          className: 'text-muted-foreground bg-muted/10 border-muted/20',
        };
    }
  };

  const { icon: Icon, text, className: statusClassName } = getStatusConfig(status);

  return (
    <Badge 
      className={cn(
        'flex items-center space-x-1 text-xs',
        statusClassName,
        className
      )}
    >
      <Icon className={cn(
        'h-3 w-3',
        status === 'connecting' && 'animate-spin'
      )} />
      <span>{text}</span>
    </Badge>
  );
}