import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter(n => !n.read).length);
    }
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  
  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Check for new appointments and analysis results
  const checkForNewNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) return;
      
      // Only proceed for patient role
      if (user.role !== 'patient') return;
      
      // Get a list of already notified appointment IDs
      const notifiedAppointmentIds = notifications
        .filter(n => n.type === 'appointment' && n.appointmentId)
        .map(n => n.appointmentId);
      
      // Get a list of already notified report IDs
      const notifiedReportIds = notifications
        .filter(n => n.type === 'analysis' && n.reportId)
        .map(n => n.reportId);
      
      console.log('Already notified appointment IDs:', notifiedAppointmentIds);
      console.log('Already notified report IDs:', notifiedReportIds);
      
      // Check for new appointments
      const appointmentsResponse = await fetch(`http://localhost:5000/api/appointments?userId=${user.id}&role=${user.role}`);
      const appointmentsData = await appointmentsResponse.json();
      
      if (appointmentsData.success && Array.isArray(appointmentsData.appointments)) {
        // Filter only appointments we haven't notified about yet
        const newAppointments = appointmentsData.appointments.filter(
          appointment => !notifiedAppointmentIds.includes(appointment.id)
        );
        
        console.log('New appointments found:', newAppointments.length);
        
        newAppointments.forEach(appointment => {
          addNotification({
            type: 'appointment',
            title: 'Yeni Randevu Planlandı',
            message: `Dr. ${appointment.doctor?.name || appointment.other_party_name || 'Doktorunuz'} ile ${new Date(appointment.date_time).toLocaleString()} tarihinde yeni bir randevunuz var.`,
            icon: '📅',
            color: 'bg-blue-100 text-blue-800',
            appointmentId: appointment.id
          });
        });
      }
      
      // Check for new analysis results
      const reportsResponse = await fetch(`http://localhost:5000/api/reports?user_id=${user.id}&role=patient`);
      const reportsData = await reportsResponse.json();
      
      if (reportsData.success && Array.isArray(reportsData.reports)) {
        // Filter only reports we haven't notified about yet
        const newReports = reportsData.reports.filter(
          report => !notifiedReportIds.includes(report.id)
        );
        
        console.log('New reports found:', newReports.length);
        
        newReports.forEach(report => {
          addNotification({
            type: 'analysis',
            title: 'Yeni Embriyo Analiz Sonuçları',
            message: `Dr. ${report.doctor?.name || report.other_party_name || 'Doktorunuz'} sizinle yeni embriyo analiz sonuçlarını paylaştı.`,
            icon: '🔬',
            color: 'bg-green-100 text-green-800',
            reportId: report.id
          });
        });
      }
    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  };
  
  // Check for new notifications periodically
  useEffect(() => {
    // Check immediately on mount
    checkForNewNotifications();
    
    // Then check every minute
    const interval = setInterval(checkForNewNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        checkForNewNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
