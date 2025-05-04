import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';


function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      appointments: true,
      results: true,
      reminders: true
    },
    privacy: {
      shareData: false,
      anonymousData: true
    },
    preferences: {
      language: 'English',
      theme: 'light',
      timeZone: 'Europe/Istanbul'
    }
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Handle password change logic here
    console.log('Password change requested:', password);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 bg-white shadow-sm rounded-lg p-6 border-l-4 border-teal-500">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="space-y-8">
          {/* Notifications Settings */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="px-6 py-6 sm:p-6 space-y-6 bg-white">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="pr-4">
                    <label htmlFor={`notification-${key}`} className="text-base font-medium text-gray-800 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive notifications about {key.toLowerCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      value ? 'bg-teal-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-7 w-14 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                    onClick={() => handleNotificationChange(key)}
                  >
                    <span
                      className={`${
                        value ? 'translate-x-7' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-6 w-6 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
            </div>
            <div className="px-6 py-6 sm:p-6 space-y-6 bg-white">
              {Object.entries(settings.privacy).map(([key, value]) => {
                const infoText = key === 'shareData'
                  ? 'Allows your healthcare providers to access your data for better treatment planning and follow-up care.'
                  : 'Allows the clinic to use anonymized data for research purposes to improve embryo assessment techniques.';
                
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="pr-4">
                      <div className="flex items-center">
                        <label htmlFor={`privacy-${key}`} className="text-base font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div 
                          className="ml-2 text-gray-400 hover:text-gray-600 cursor-help"
                          data-tooltip-id={`tooltip-${key}`}
                          data-tooltip-content={infoText}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <Tooltip id={`tooltip-${key}`} place="right" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {key === 'shareData'
                          ? 'Share your data with your healthcare providers'
                          : 'Contribute anonymous data for research'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${
                        value ? 'bg-teal-600' : 'bg-gray-200'
                      } relative inline-flex flex-shrink-0 h-7 w-14 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                      onClick={() => handlePrivacyChange(key)}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-7' : 'translate-x-0'
                        } pointer-events-none relative inline-block h-6 w-6 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            </div>
            <div className="px-6 py-6 sm:p-6 space-y-8 bg-white">
              <div className="relative">
                <label htmlFor="language" className="flex items-center text-base font-medium text-gray-800 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578l-.244 2.437a6.01 6.01 0 01-4.682 5.118l-.137.025A6 6 0 119.578 7H8.453l.243-2.437A1 1 0 017.7 3H5a1 1 0 110-2h2zm0 8a1 1 0 011 1v1h3a1 1 0 110 2H9.578l-.244 2.437a6.01 6.01 0 01-4.682 5.118l-.137.025A6 6 0 119.578 15H8.453l.243-2.437A1 1 0 017.7 11H5a1 1 0 110-2h2z" clipRule="evenodd" />
                  </svg>
                  Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={settings.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="English">English</option>
                    <option value="Turkish">Turkish</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {settings.preferences.language === 'English' ? (
                      <span className="text-lg">🇬🇧</span>
                    ) : (
                      <span className="text-lg">🇹🇷</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="theme" className="flex items-center text-base font-medium text-gray-800 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    {settings.preferences.theme === 'light' ? (
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    ) : (
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    )}
                  </svg>
                  Theme
                </label>
                <div className="relative">
                  <select
                    id="theme"
                    value={settings.preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {settings.preferences.theme === 'light' ? (
                      <span className="text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="timezone" className="flex items-center text-base font-medium text-gray-800 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Time Zone
                </label>
                <div className="relative">
                  <select
                    id="timezone"
                    value={settings.preferences.timeZone}
                    onChange={(e) => handlePreferenceChange('timeZone', e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="Europe/Istanbul">Istanbul (GMT+3)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mt-10">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            </div>
            <div className="px-6 py-8 sm:p-8 bg-white">
              <p className="text-sm text-gray-600 mb-6">
                For security reasons, we recommend changing your password regularly. Your new password must be at least 8 characters long.
              </p>
              <form onSubmit={handlePasswordChange} className="space-y-8">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <label htmlFor="current-password" className="block text-base font-medium text-gray-800 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="current-password"
                      value={password.current}
                      onChange={(e) => setPassword({ ...password, current: e.target.value })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-base py-3"
                      placeholder="Enter your current password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <label htmlFor="new-password" className="block text-base font-medium text-gray-800 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="new-password"
                      value={password.new}
                      onChange={(e) => setPassword({ ...password, new: e.target.value })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-base py-3"
                      placeholder="Enter your new password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <label htmlFor="confirm-password" className="block text-base font-medium text-gray-800 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-base py-3"
                      placeholder="Confirm your new password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
