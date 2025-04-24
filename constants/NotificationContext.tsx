import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import SocketService from './SocketService';
import ApiService from './ApiService';
import { useTranslation } from 'react-i18next';

// Define the shape of a notification
export interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

// Define the context shape
interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  refreshNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { t } = useTranslation(['notifications']);

  // Fetch all notifications
  const refreshNotifications = async () => {
    try {
      const response: any = await ApiService.get('/notifications');
      if (response.data && response.data.status === 'success') {
        setNotifications(response.data.data);

        // Calculate unread count
        const unread = response.data.data.filter(
          (notification: Notification) => !notification.read,
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await ApiService.post('/notifications/read-all');
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    try {
      await ApiService.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await Promise.all(
        notifications.map((notification) =>
          ApiService.delete(`/notifications/${notification._id}`),
        ),
      );
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  // Setup WebSocket for real-time notifications
  useEffect(() => {
    const setupSocket = async () => {
      try {
        // Initial fetch of notifications
        await refreshNotifications();

        // Connect to socket and subscribe to notifications
        const socket = await SocketService.connect();
        socket.emit('subscribeToNotifications');

        // Listen for new notifications
        socket.on('notification', (newNotification) => {
          // Add the new notification to state
          setNotifications((prev) => [newNotification, ...prev]);

          // Increment unread count
          setUnreadCount((prev) => prev + 1);
        });
      } catch (error) {
        console.error('Failed to setup socket connection:', error);
      }
    };

    setupSocket();

    return () => {
      // Cleanup socket connection on unmount
      SocketService.disconnect();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        refreshNotifications,
        markAllAsRead,
        markAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};
