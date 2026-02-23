import { createContext, useContext, useState, ReactNode } from 'react';

export interface EmergencyAlertType {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: number;
}

interface EmergencyAlertContextType {
  alerts: EmergencyAlertType[];
  addAlert: (message: string, severity: EmergencyAlertType['severity']) => void;
  dismissAlert: (id: string) => void;
  alertHistory: EmergencyAlertType[];
}

const EmergencyAlertContext = createContext<EmergencyAlertContextType | undefined>(undefined);

export function EmergencyAlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<EmergencyAlertType[]>([]);
  const [alertHistory, setAlertHistory] = useState<EmergencyAlertType[]>([]);

  const addAlert = (message: string, severity: EmergencyAlertType['severity']) => {
    const newAlert: EmergencyAlertType = {
      id: Date.now().toString(),
      message,
      severity,
      timestamp: Date.now(),
    };
    setAlerts((prev) => [...prev, newAlert]);
    setAlertHistory((prev) => [newAlert, ...prev]);
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <EmergencyAlertContext.Provider value={{ alerts, addAlert, dismissAlert, alertHistory }}>
      {children}
    </EmergencyAlertContext.Provider>
  );
}

export function useEmergencyAlert() {
  const context = useContext(EmergencyAlertContext);
  if (!context) {
    throw new Error('useEmergencyAlert must be used within EmergencyAlertProvider');
  }
  return context;
}
