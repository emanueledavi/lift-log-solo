import { useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

// Singleton notification manager to prevent duplicates
export function useNotificationManager() {
  const { toast } = useToast();
  const shownNotifications = useRef<Set<string>>(new Set());
  const recentNotifications = useRef<NotificationData[]>([]);
  const cooldownActive = useRef<boolean>(false);

  const showNotification = useCallback((id: string, title: string, description: string) => {
    // Check if already shown
    if (shownNotifications.current.has(id)) {
      return false;
    }

    // Check cooldown
    if (cooldownActive.current) {
      return false;
    }

    // Check for recent similar notifications
    const now = Date.now();
    const recentSimilar = recentNotifications.current.find(
      n => n.title === title && (now - n.timestamp) < 5000
    );
    
    if (recentSimilar) {
      return false;
    }

    // Activate cooldown
    cooldownActive.current = true;
    setTimeout(() => {
      cooldownActive.current = false;
    }, 2000);

    // Add to shown notifications
    shownNotifications.current.add(id);
    
    // Add to recent notifications
    recentNotifications.current.push({ id, title, description, timestamp: now });
    
    // Clean old recent notifications (keep only last 10)
    if (recentNotifications.current.length > 10) {
      recentNotifications.current = recentNotifications.current.slice(-10);
    }

    // Show the notification
    toast({ title, description });
    return true;
  }, [toast]);

  const clearNotificationHistory = useCallback(() => {
    shownNotifications.current.clear();
    recentNotifications.current = [];
  }, []);

  return {
    showNotification,
    clearNotificationHistory
  };
}
