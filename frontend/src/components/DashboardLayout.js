import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';
import '../styles/darkMode.css';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from './NotificationPanel';

function DashboardLayout({ children, userRole, onLogout }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const navigation = {
    patient: [
      { name: 'Dashboard', path: '/patient', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'Profile', path: '/patient/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { name: 'Medical Records', path: '/patient/records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'Messages', path: '/patient/messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
      { name: 'Appointments', path: '/patient/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { name: 'Treatment Plan', path: '/patient/treatment', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
      { name: 'Settings', path: '/patient/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'Patients', path: '/doctor/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      { name: 'Messages', path: '/doctor/messages', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
      { name: 'Appointments', path: '/doctor/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { name: 'Analysis', path: '/doctor/analysis', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { name: 'Settings', path: '/doctor/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ],
  };

  useEffect(() => {
    // Apply dark mode to the body element
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const currentNavigation = navigation[userRole] || [];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Fixed Logo Banner */}
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-teal-600'} py-2 px-4 shadow-md sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={embryoLogo} alt="EmbryoAI Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white">
              EmbryoAI
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                className={`relative p-2 rounded-full transition-all duration-200 ${isDarkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white' 
                  : 'bg-teal-500 bg-opacity-20 hover:bg-opacity-30 text-white hover:ring-2 hover:ring-teal-300'}`}
                title="Bildirimler"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-900">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              
              {isNotificationPanelOpen && (
                <NotificationPanel isDarkMode={isDarkMode} onClose={() => setIsNotificationPanelOpen(false)} />
              )}
            </div>
            
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-200 ${isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-300 hover:text-yellow-200 hover:ring-2 hover:ring-yellow-500' 
                : 'bg-opacity-20 bg-white text-white hover:bg-opacity-30'}`}
              title="Toggle theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* User menu */}
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${isDarkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-white hover:ring-2 hover:ring-teal-300 text-teal-600'} ${isUserMenuOpen ? 'ring-2 ring-teal-400' : ''}`}
                title={userRole === 'doctor' ? 'Dr. Smith' : 'Sarah'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 py-2 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-xl z-20 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 border-b border-gray-200 mb-1 flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      {userRole === 'doctor' ? '👨🏻‍⚕️' : '👩🏻'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Welcome, {userRole === 'doctor' ? 'Dr. Smith' : 'Sarah'}</p>
                      <p className="text-xs text-gray-500">{userRole === 'doctor' ? 'Fertility Specialist' : 'Patient'}</p>
                    </div>
                  </div>
                  <Link to={userRole === 'doctor' ? '/doctor/profile' : '/patient/profile'} className={`block px-4 py-2 hover:${isDarkMode ? 'bg-slate-700' : 'bg-teal-50'} transition-colors duration-150`}>Profile</Link>
                  <Link to={userRole === 'doctor' ? '/doctor/settings' : '/patient/settings'} className={`block px-4 py-2 hover:${isDarkMode ? 'bg-slate-700' : 'bg-teal-50'} transition-colors duration-150`}>Settings</Link>
                  <button 
                    onClick={onLogout} 
                    className={`w-full text-left block px-4 py-2 text-red-500 hover:${isDarkMode ? 'bg-slate-700' : 'bg-teal-50'} transition-colors duration-150`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} shadow-lg sticky top-14 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Navigation Links - Desktop */}
              <div className="flex md:space-x-1">
                {currentNavigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                        ${isActive 
                          ? `${isDarkMode ? 'bg-gray-900' : 'bg-teal-50'} text-teal-600 font-medium`
                          : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:text-teal-500`
                        } 
                        rounded-lg flex items-center px-3 py-2 text-sm transition-colors duration-150 ease-in-out
                      `}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 mr-1.5 ${isActive ? 'text-teal-500' : 'text-gray-400'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                      {isActive && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-teal-500"></span>}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentNavigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    ${isActive 
                      ? 'bg-teal-50 text-teal-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-teal-500'
                    } 
                    block rounded-md px-3 py-2 text-base font-medium flex items-center
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isActive ? 'text-teal-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'} rounded-lg my-6 shadow-sm transition-colors duration-200`}>
        <div className={`${isDarkMode ? 'dark-mode' : ''}`}>
          {React.Children.map(children, child => {
            // Clone each child component and pass the isDarkMode prop
            return React.isValidElement(child) 
              ? React.cloneElement(child, { isDarkMode })
              : child;
          })}
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`mt-auto py-6 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <img src={embryoLogo} alt="EmbryoAI Logo" className="h-6 w-6" />
              <span className="text-sm font-medium">EmbryoAI &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:text-teal-500">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-teal-500">Terms of Service</a>
              <a href="#" className="text-sm hover:text-teal-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;
