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
    console.log('Trying to add notification:', notification);
    
    // Check if this is a duplicate notification
    const isDuplicate = notifications.some(n => {
      // For appointment notifications
      if (notification.type === 'appointment' && n.type === 'appointment' && 
          notification.appointmentId === n.appointmentId) {
        console.log('Duplicate appointment notification found with ID:', notification.appointmentId);
        return true;
      }
      
      // For analysis notifications
      if (notification.type === 'analysis' && n.type === 'analysis' && 
          notification.reportId === n.reportId) {
        console.log('Duplicate analysis notification found with ID:', notification.reportId);
        return true;
      }
      
      // For other notifications, check title and message
      if (notification.title === n.title && notification.message === n.message) {
        // If the notification is less than 1 hour old, consider it a duplicate
        const notificationTime = new Date(n.timestamp);
        const now = new Date();
        const timeDiff = now - notificationTime;
        const hourInMs = 60 * 60 * 1000;
        
        if (timeDiff < hourInMs) {
          console.log('Duplicate notification found with same title and message (within 1 hour)');
          return true;
        }
      }
      
      return false;
    });
    
    // If it's a duplicate, don't add it
    if (isDuplicate) {
      console.log('Duplicate notification skipped:', notification);
      return;
    }
    
    console.log('Adding new notification:', notification);
    
    // Yeni bildirim oluştur ve zaman damgası ekle
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    // Bildirim ekleniyor
    setNotifications(prev => {
      const updatedNotifications = [newNotification, ...prev];
      console.log('Updated notifications:', updatedNotifications);
      return updatedNotifications;
    });
    
    // Bildirim sesli uyarı (opsiyonel)
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Notification sound could not be played:', e));
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
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
      console.log('Checking for new notifications at', new Date().toLocaleString());
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        console.log('No user found, skipping notification check');
        return;
      }
      
      console.log('Checking notifications for user:', user.id, 'with role:', user.role);
      
      // Bildirim kontrolü için son kontrol zamanını al
      // Eğer yoksa 24 saat öncesini kullan (tüm yeni bildirimleri görmek için)
      const lastNotificationCheckTime = localStorage.getItem('lastNotificationCheckTime');
      let lastCheckDate = null;
      
      if (lastNotificationCheckTime) {
        lastCheckDate = new Date(parseInt(lastNotificationCheckTime));
        console.log('Last notification check time:', lastCheckDate.toLocaleString());
      } else {
        // Son 24 saatteki bildirimleri kontrol et
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        lastCheckDate = oneDayAgo;
        console.log('No previous check time, using 24h ago:', lastCheckDate.toLocaleString());
      }
      
      // Yeni kontrol zamanı
      const currentTime = new Date();
      console.log('Current check time:', currentTime.toLocaleString());
      
      // Get a list of already notified appointment IDs
      const notifiedAppointmentIds = new Set(
        notifications
          .filter(n => n.type === 'appointment' && n.appointmentId)
          .map(n => n.appointmentId)
      );
      
      // Get a list of already notified report IDs
      const notifiedReportIds = new Set(
        notifications
          .filter(n => n.type === 'analysis' && n.reportId)
          .map(n => n.reportId)
      );
      
      console.log('Already notified appointment IDs:', [...notifiedAppointmentIds]);
      console.log('Already notified report IDs:', [...notifiedReportIds]);
      
      // Check for new appointments
      const appointmentsResponse = await fetch(`http://localhost:5000/api/appointments?userId=${user.id}&role=${user.role}`);
      const appointmentsData = await appointmentsResponse.json();
      
      if (appointmentsData.success && Array.isArray(appointmentsData.appointments)) {
        console.log(`Processing ${appointmentsData.appointments.length} appointments for ${user.role} with ID ${user.id}`);
        
        // Daha sıkı filtreleme yaparak sadece kullanıcıya ait randevuları al
        const newAppointments = appointmentsData.appointments.filter(appointment => {
          // Skip if we've already notified about this appointment
          if (notifiedAppointmentIds.has(appointment.id)) {
            console.log(`Skipping already notified appointment ID: ${appointment.id}`);
            return false;
          }
          
          // Hasta için: Sadece kendisine ait randevuları göster
          if (user.role === 'patient') {
            const isPatientAppointment = appointment.patient_id === user.id;
            console.log(`Appointment ${appointment.id} belongs to patient ${appointment.patient_id}, current user: ${user.id}, match: ${isPatientAppointment}`);
            if (!isPatientAppointment) return false;
          } 
          // Doktor için: Sadece kendisinin oluşturduğu randevuları göster
          else if (user.role === 'doctor') {
            const isDoctorAppointment = appointment.doctor_id === user.id;
            console.log(`Appointment ${appointment.id} belongs to doctor ${appointment.doctor_id}, current user: ${user.id}, match: ${isDoctorAppointment}`);
            if (!isDoctorAppointment) return false;
          }
          
          // Check if the appointment was created after the last check time
          if (lastCheckDate) {
            const appointmentCreatedAt = new Date(appointment.created_at || appointment.date_time);
            const isAfterLastCheck = appointmentCreatedAt > lastCheckDate;
            console.log(`Appointment ${appointment.id} created at ${appointmentCreatedAt.toLocaleString()}, last check: ${lastCheckDate.toLocaleString()}, is after: ${isAfterLastCheck}`);
            return isAfterLastCheck;
          }
          
          // If no last check time, only show appointments created in the last 24 hours
          const appointmentCreatedAt = new Date(appointment.created_at || appointment.date_time);
          const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
          const isWithin24Hours = appointmentCreatedAt > oneDayAgo;
          console.log(`Appointment ${appointment.id} created at ${appointmentCreatedAt.toLocaleString()}, is within 24 hours: ${isWithin24Hours}`);
          return isWithin24Hours;
        });
        
        console.log('New appointments found after filtering:', newAppointments.length);
        
        // Only notify about the first 3 new appointments to avoid overwhelming the user
        newAppointments.slice(0, 3).forEach(appointment => {
          let title, message;
          
          // Hasta için bildirim mesajı
          if (user.role === 'patient') {
            title = 'Yeni Randevu Planlandı';
            message = `Dr. ${appointment.doctor?.name || appointment.other_party_name || 'Doktorunuz'} ile ${new Date(appointment.date_time).toLocaleString()} tarihinde yeni bir randevunuz var.`;
            console.log(`Creating patient notification for appointment ${appointment.id}`);
          } 
          // Doktor için bildirim mesajı
          else if (user.role === 'doctor') {
            title = 'Yeni Hasta Randevusu';
            message = `${appointment.patient?.name || appointment.other_party_name || 'Bir hasta'} ile ${new Date(appointment.date_time).toLocaleString()} tarihinde yeni bir randevunuz var.`;
            console.log(`Creating doctor notification for appointment ${appointment.id}`);
          }
          
          // Kullanıcı ID'sini bildirime ekleyerek kime ait olduğunu belirt
          addNotification({
            type: 'appointment',
            title,
            message,
            icon: '📅',
            color: 'bg-blue-100 text-blue-800',
            appointmentId: appointment.id,
            userId: user.id,  // Bildirim sahibinin ID'sini ekle
            userRole: user.role  // Kullanıcı rolünü ekle
          });
        });
      }
      
      // Check for new analysis results - Farklı endpoint'ler kullanarak sadece ilgili kullanıcıya ait raporlar
      // Hasta ve doktor için farklı endpoint'ler kullan
      const reportsEndpoint = user.role === 'doctor' 
        ? `http://localhost:5000/api/reports?user_id=${user.id}&role=doctor`
        : `http://localhost:5000/api/reports?user_id=${user.id}&role=patient`;
      
      const reportsResponse = await fetch(reportsEndpoint);
      const reportsData = await reportsResponse.json();
      
      if (reportsData.success && Array.isArray(reportsData.reports)) {
        console.log(`Processing ${reportsData.reports.length} reports for ${user.role} with ID ${user.id}`);
        
        // Daha sıkı filtreleme yaparak sadece kullanıcıya ait raporları al
        const newReports = reportsData.reports.filter(report => {
          // Skip if we've already notified about this report
          if (notifiedReportIds.has(report.id)) {
            console.log(`Skipping already notified report ID: ${report.id}`);
            return false;
          }
          
          // Hasta için: Sadece kendisine ait raporları göster
          if (user.role === 'patient') {
            const isPatientReport = report.patient_id === user.id;
            console.log(`Report ${report.id} belongs to patient ${report.patient_id}, current user: ${user.id}, match: ${isPatientReport}`);
            if (!isPatientReport) return false;
          } 
          // Doktor için: Sadece kendisinin oluşturduğu raporları göster
          else if (user.role === 'doctor') {
            const isDoctorReport = report.doctor_id === user.id;
            console.log(`Report ${report.id} belongs to doctor ${report.doctor_id}, current user: ${user.id}, match: ${isDoctorReport}`);
            if (!isDoctorReport) return false;
          }
          
          // Check if the report was created after the last check time
          if (lastCheckDate) {
            const reportCreatedAt = new Date(report.created_at || report.timestamp);
            const isAfterLastCheck = reportCreatedAt > lastCheckDate;
            console.log(`Report ${report.id} created at ${reportCreatedAt.toLocaleString()}, last check: ${lastCheckDate.toLocaleString()}, is after: ${isAfterLastCheck}`);
            return isAfterLastCheck;
          }
          
          // If no last check time, only show reports created in the last 24 hours
          const reportCreatedAt = new Date(report.created_at || report.timestamp);
          const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
          const isWithin24Hours = reportCreatedAt > oneDayAgo;
          console.log(`Report ${report.id} created at ${reportCreatedAt.toLocaleString()}, is within 24 hours: ${isWithin24Hours}`);
          return isWithin24Hours;
        });
        
        console.log('New reports found after filtering:', newReports.length);
        
        // Only notify about the first 3 new reports to avoid overwhelming the user
        newReports.slice(0, 3).forEach(report => {
          let title, message;
          
          // Hasta için bildirim mesajı
          if (user.role === 'patient') {
            title = 'Yeni Embriyo Analiz Sonuçları';
            message = `Dr. ${report.doctor?.name || report.other_party_name || 'Doktorunuz'} sizinle yeni embriyo analiz sonuçlarını paylaştı.`;
            console.log(`Creating patient notification for report ${report.id}`);
          } 
          // Doktor için bildirim mesajı
          else if (user.role === 'doctor') {
            title = 'Embriyo Analizi Tamamlandı';
            message = `${report.patient?.name || report.other_party_name || 'Bir hasta'} için embriyo analizi tamamlandı.`;
            console.log(`Creating doctor notification for report ${report.id}`);
          }
          
          // Kullanıcı ID'sini bildirime ekleyerek kime ait olduğunu belirt
          addNotification({
            type: 'analysis',
            title,
            message,
            icon: '🔬',
            color: 'bg-green-100 text-green-800',
            reportId: report.id,
            userId: user.id,  // Bildirim sahibinin ID'sini ekle
            userRole: user.role  // Kullanıcı rolünü ekle
          });
        });
      }
      
      // Son kontrol zamanını güncelle
      localStorage.setItem('lastNotificationCheckTime', currentTime.getTime().toString());
    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  };
  
  // Check for new notifications periodically
  useEffect(() => {
    // Bildirim kontrol zamanlarını sıfırlama - bu sayede her zaman kontrol edilecek
    localStorage.removeItem('lastNotificationCheck');
    localStorage.removeItem('lastNotificationCheckTime');
    
    // Bildirim kontrolü için 24 saat öncesini ayarla (tüm yeni bildirimleri görmek için)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    localStorage.setItem('lastNotificationCheckTime', yesterday.getTime().toString());
    
    console.log('Checking for notifications - initial check with 24h lookback');
    console.log('Set notification check time to:', yesterday.toLocaleString());
    
    // Uygulama açıldığında hemen kontrol et
    setTimeout(() => {
      checkForNewNotifications();
    }, 2000); // 2 saniye sonra kontrol et (uygulamanu0131n yu00fcklenmesi iu00e7in zaman ver)
    
    // 2 dakikada bir kontrol et (daha sık kontrol)
    const interval = setInterval(() => {
      console.log('Checking for notifications - interval check');
      checkForNewNotifications();
    }, 2 * 60000); // 2 dakika
    
    // Sayfa odaklanmasında da kontrol et
    const handleFocus = () => {
      const lastCheckTime = localStorage.getItem('lastNotificationCheckTime');
      const now = Date.now();
      
      // Son kontrolden bu yana en az 5 dakika geçtiyse kontrol et
      if (!lastCheckTime || (now - parseInt(lastCheckTime)) > 5 * 60000) {
        console.log('Checking for notifications - focus check');
        checkForNewNotifications();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
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
