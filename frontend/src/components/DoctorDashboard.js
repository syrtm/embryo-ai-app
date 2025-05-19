import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';

function DoctorDashboard() {
  /* ------------------------------------------------------------------
   * Local state
   * ----------------------------------------------------------------*/
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  /* ------------------------------------------------------------------
   * Mock data (replace with real API calls once backend is ready)
   * ----------------------------------------------------------------*/
  const stats = [
    { 
      title: 'Total Patients', 
      value: 78, 
      icon: '👥', 
      color: 'from-teal-500 to-teal-400',
      trend: 'up',
      change: '+12%',
      chartData: [35, 40, 45, 50, 55, 60, 78]
    },
    { 
      title: 'Pending Reviews', 
      value: 12, 
      icon: '📋', 
      color: 'from-indigo-500 to-indigo-400',
      trend: 'down',
      change: '-3%',
      chartData: [18, 16, 14, 15, 13, 14, 12]
    },
    { 
      title: "Today's Appointments", 
      value: 13, 
      icon: '📅', 
      color: 'from-cyan-500 to-cyan-400',
      trend: 'up',
      change: '+5%',
      chartData: [8, 9, 7, 8, 10, 11, 13]
    },
    { 
      title: 'Scheduled Procedures', 
      value: 1, 
      icon: '🔬', 
      color: 'from-emerald-500 to-emerald-400',
      trend: 'same',
      change: '0%',
      chartData: [1, 2, 1, 1, 0, 1, 1]
    }
  ];

  const patients = [
    { id: 1, name: 'Emma Thompson', age: 34, status: 'Waiting for Upload', avatar: '👩🏼', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'Sarah Johnson', age: 29, status: 'Analysis Complete', avatar: '👩🏻', photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { id: 3, name: 'Lisa Davis', age: 31, status: 'Waiting for Upload', avatar: '👩🏽', photo: 'https://randomuser.me/api/portraits/women/63.jpg' },
    { id: 4, name: 'Emily Brown', age: 36, status: 'Analysis Complete', avatar: '👩🏼', photo: 'https://randomuser.me/api/portraits/women/68.jpg' }
  ];

  const notifications = [
    { title: 'New Appointment Request', icon: '📅', time: '5m', color: 'bg-blue-100 text-blue-800' },
    { title: 'Embryo Upload Needed', icon: '🔬', time: '12m', color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Analysis Complete', icon: '📊', time: '25m', color: 'bg-green-100 text-green-800' },
    { title: 'New Patient Message', icon: '💬', time: '30m', color: 'bg-purple-100 text-purple-800' }
  ];

  /* ------------------------------------------------------------------
   * Helpers
   * ----------------------------------------------------------------*/
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleAnalysis = () => {
    if (!selectedImage || !selectedPatient) return;
    // TODO: send analysis request to backend
    // eslint-disable-next-line no-console
    console.log('Analyse embryo for', selectedPatient.name);
  };

  const getMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    // prefix blanks (Mon = 1, Sun = 0 -> treat as 7)
    const blanks = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < blanks; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    return cells;
  };

  /* ------------------------------------------------------------------
   * Render
   * ----------------------------------------------------------------*/
  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-900'}`}>
      <main className="flex-1 overflow-auto p-8 space-y-10">

        {/* ------------------------------------------------------------ */}
        {/* Stats cards                                               */}
        {/* ------------------------------------------------------------ */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            // Special handling for Scheduled Procedures card which has only 1 value
            const isScheduledProcedures = s.title === 'Scheduled Procedures';
            
            return (
              <div key={idx} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden`}>
                {/* Card header with icon and value */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${s.color} shadow-sm`}>
                    <span className="text-2xl text-white">{s.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{s.value}</p>
                      <div className={`flex items-center ${s.trend === 'up' ? 'text-emerald-500' : s.trend === 'down' ? 'text-rose-500' : 'text-gray-500'}`}>
                        {s.trend === 'up' && (
                          <span className="flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            {s.change}
                          </span>
                        )}
                        {s.trend === 'down' && (
                          <span className="flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                            </svg>
                            {s.change}
                          </span>
                        )}
                        {s.trend === 'same' && (
                          <span className="flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clipRule="evenodd" />
                            </svg>
                            {s.change}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{s.title}</p>
                  </div>
                </div>
                
                {/* Different visualization for Scheduled Procedures vs other cards */}
                {isScheduledProcedures ? (
                  <div className="mt-4 relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                          Today
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-teal-600">
                          {s.value}/5 Slots
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                      <div style={{ width: `${(s.value / 5) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
                    </div>
                    <div className="flex justify-center mt-2">
                      <div className={`text-center px-3 py-1 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-teal-50'} text-xs`}>
                        <span className="font-semibold">Next:</span> Embryo Transfer at 2:00 PM
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 w-full flex items-end space-x-1 mt-2">
                    {s.chartData.map((value, i) => {
                      const maxValue = Math.max(...s.chartData);
                      const height = (value / maxValue) * 100;
                      const isLast = i === s.chartData.length - 1;
                      return (
                        <div 
                          key={i} 
                          className={`relative flex-1 ${isLast ? `bg-gradient-to-t ${s.color}` : isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-md transition-all duration-300 hover:opacity-90`} 
                          style={{ height: `${height}%` }}
                        >
                          {isLast && (
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Patient list & analysis panel                              */}
        {/* ------------------------------------------------------------ */}
        <section className="grid grid-cols-2 gap-6">
          {/* Patient list */}
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border overflow-hidden`}>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Patient</h2>
                <div className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {patients.length} Patients
                </div>
              </div>
              
              <div className="space-y-3">
                {patients.map((p) => {
                  const selected = p.id === selectedPatient?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        selected 
                          ? isDarkMode 
                            ? 'bg-teal-900 border-2 border-teal-600 shadow-md' 
                            : 'bg-teal-50 border-2 border-teal-400 shadow-md' 
                          : isDarkMode 
                            ? 'border border-slate-700 hover:bg-slate-700' 
                            : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} flex items-center justify-center shadow-sm overflow-hidden`}>
                          <img src={p.photo} alt="Patient" className="w-full h-full object-cover" />
                          {selected && (
                            <div className="absolute -top-1 -right-1 bg-teal-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center">
                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                            {selected && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Age: {p.age}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${p.status === 'Analysis Complete'
                            ? isDarkMode 
                              ? 'bg-green-900 text-green-100' 
                              : 'bg-green-100 text-green-800 border border-green-200'
                            : isDarkMode 
                              ? 'bg-amber-900 text-amber-100' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.status === 'Analysis Complete' ? (
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {p.status}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                            {p.status}
                          </div>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Analysis Card */}
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border overflow-hidden`}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Embryo Analysis</h2>
              </div>
              
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <div className="text-center space-y-2 max-w-xs">
                  <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Analyze Embryo Images</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Use our advanced AI to analyze embryo images and get detailed quality assessments
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    if (selectedPatient) {
                      navigate('/doctor/analysis', { state: { patient: selectedPatient } });
                    } else {
                      alert('Please select a patient first');
                    }
                  }}
                  className={`px-6 py-3 rounded-lg ${selectedPatient ? 
                    `${isDarkMode ? 'bg-teal-600 hover:bg-teal-500' : 'bg-teal-500 hover:bg-teal-600'} text-white shadow-md` : 
                    'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors flex items-center space-x-2`}
                  disabled={!selectedPatient}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span>Go to Analysis {selectedPatient ? `for ${selectedPatient.name}` : ''}</span>
                </button>
                
                {!selectedPatient && (
                  <p className="text-xs text-amber-500 italic">
                    Please select a patient first
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Calendar & notifications                                  */}
        {/* ------------------------------------------------------------ */}
        <section className="grid grid-cols-2 gap-6 pb-10">
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Calendar</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="p-2">
                    {d}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {getMonthDays().map((day, idx) => {
                  const isToday = day && 
                    day === today.getDate() && 
                    selectedDate.getMonth() === today.getMonth() && 
                    selectedDate.getFullYear() === today.getFullYear();
                  
                  const hasAppointment = day && [5, 12, 18, 25].includes(day);
                  
                  return (
                    <button
                      key={idx}
                      disabled={!day}
                      className={`relative p-2 rounded-lg text-sm transition-all duration-150 ${
                        isToday ? 'bg-rose-600 text-white font-medium' : 
                        day ? 'hover:bg-gray-100' : ''
                      }`}
                    >
                      {day ?? ''}
                      {hasAppointment && !isToday && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming Appointments</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span className="text-sm">Emma Thompson</span>
                    </div>
                    <span className="text-xs text-gray-500">Today, 2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Michael Brown</span>
                    </div>
                    <span className="text-xs text-gray-500">Tomorrow, 10:30 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">Mark all as read</button>
              </div>
              
              {/* Notification filters */}
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                <button className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium whitespace-nowrap">All</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium whitespace-nowrap">Appointments</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium whitespace-nowrap">Messages</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium whitespace-nowrap">System</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium whitespace-nowrap">Analysis</button>
              </div>
              
              <div className="space-y-3">
                {notifications.map((n, idx) => {
                  const isUnread = idx < 2;
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg flex items-center space-x-3 ${n.color} ${isUnread ? 'border-l-4 border-teal-500' : ''} relative`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white bg-opacity-50 flex items-center justify-center">
                        <span className="text-xl">{n.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{n.title}</p>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white bg-opacity-50">{n.time} ago</span>
                        </div>
                        <p className="text-xs mt-1 opacity-60 text-gray-600">
                          <span className="inline-flex items-center">
                            {idx % 2 === 0 ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Dr. Johnson
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                Patient Portal
                              </>
                            )}
                          </span>
                        </p>
                      </div>
                      {isUnread && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <button className="w-full mt-4 text-sm text-center text-gray-500 hover:text-gray-700 py-2">
                View all notifications
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DoctorDashboard;
