import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

function NotificationPanel({ isDarkMode, onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Close the panel after clicking a notification
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`notifications-panel absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg shadow-lg z-50 overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bildirimler</h2>
          <button 
            onClick={markAllAsRead}
            className={`text-xs font-medium ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
          >
            Tümünü okundu işaretle
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>Bildirim bulunmuyor</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {notifications.map((notification) => {
              const notificationTime = new Date(notification.timestamp);
              const timeAgo = getTimeAgo(notificationTime);
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 ${notification.read ? '' : 'bg-blue-50 dark:bg-slate-700'} hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.color} flex items-center justify-center ${isDarkMode ? 'opacity-80' : ''}`}>
                      <span className="text-xl">{notification.icon}</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</p>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{timeAgo}</span>
                      </div>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification.message}</p>
                      
                      {notification.type === 'appointment' && (
                        <Link 
                          to="/patient/appointments" 
                          className={`mt-2 inline-flex items-center text-xs font-medium ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Randevuları görüntüle
                          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                      
                      {notification.type === 'analysis' && (
                        <Link 
                          to="/patient" 
                          className={`mt-2 inline-flex items-center text-xs font-medium ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Analiz sonuçlarını görüntüle
                          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-teal-500"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-slate-700">
        <button 
          onClick={onClose}
          className={`w-full py-2 text-sm text-center rounded-md ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Az önce';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} gün önce`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ay önce`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} yıl önce`;
}

export default NotificationPanel;
