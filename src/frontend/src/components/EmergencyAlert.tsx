import { useEmergencyAlert } from '../contexts/EmergencyAlertContext';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmergencyAlert() {
  const { alerts, dismissAlert } = useEmergencyAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 space-y-2 p-4">
      {alerts.map((alert) => {
        const bgColor =
          alert.severity === 'critical'
            ? 'bg-destructive text-destructive-foreground'
            : alert.severity === 'warning'
            ? 'bg-amber-600 text-white'
            : 'bg-blue-600 text-white';

        const Icon = alert.severity === 'info' ? Info : AlertTriangle;

        return (
          <div
            key={alert.id}
            className={`${bgColor} rounded-lg shadow-lg p-4 flex items-center justify-between animate-in slide-in-from-top`}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">{alert.message}</p>
                <p className="text-sm opacity-90">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="text-current hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
