import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';
import patientAvatars from '../utils/patientAvatars';

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
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentError, setAppointmentError] = useState(null);

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

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('Kullanıcı bilgisi bulunamadı');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/doctor/patients?doctor_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Duplicate patients'i kaldırmak için uniqueBy fonksiyonunu kullan
        const uniquePatients = data.patients.filter((patient, index, self) => 
          index === self.findIndex(p => p.id === patient.id)
        ).map(patient => ({
          id: patient.id,
          name: patient.full_name,
          age: patient.age,
          status: patient.is_selected ? 'Analysis Complete' : 'Waiting for Upload',
          initials: patient.full_name.split(' ')[0][0] + (patient.full_name.split(' ')[1]?.[0] || '')
        }));
        
        setPatients(uniquePatients);
      } else {
        console.error('Backend hatası:', data.message);
        setPatients([]);
      }
    } catch (error) {
      console.error('Hasta listesi yüklenirken hata:', error);
      setPatients([]);
    }
  };

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

  // Fetch upcoming appointments for the doctor
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setAppointmentError(null);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`http://localhost:5000/api/appointments?userId=${user.id}&role=doctor`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Sort appointments by date (upcoming first)
        const sortedAppointments = data.appointments.sort((a, b) => {
          return new Date(a.date_time) - new Date(b.date_time);
        });
        
        // Filter to only show upcoming appointments
        const upcoming = sortedAppointments.filter(appointment => {
          return new Date(appointment.date_time) >= new Date();
        });
        
        setUpcomingAppointments(upcoming);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointmentError(err.message);
    } finally {
      setLoadingAppointments(false);
    }
  };
  
  // Format date and time for display
  const formatAppointmentDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  // Handle appointment status update
  const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh appointments list
        fetchAppointments();
      } else {
        console.error('Failed to update appointment status:', data.message);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
    }
  };

  /* ------------------------------------------------------------------
   * Effects
   * ----------------------------------------------------------------*/
  useEffect(() => {
    // Fetch appointments when component mounts
    fetchAppointments();
  }, []);

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
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden shadow-sm`}>
                          {patientAvatars[p.name] ? (
                            <img 
                              src={patientAvatars[p.name]} 
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center`}>
                              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-800'}`}>
                                {p.initials.toUpperCase()}
                              </span>
                            </div>
                          )}
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
                    Please select a patient to proceed with analysis
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Upcoming Appointments                                    */}
        {/* ------------------------------------------------------------ */}
        <section className="mb-6">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Appointments
          </h2>
          
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border overflow-hidden p-6`}>
            {loadingAppointments ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : appointmentError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">{appointmentError}</p>
                <button 
                  onClick={fetchAppointments} 
                  className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">No upcoming appointments scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => {
                  const { date, time } = formatAppointmentDateTime(appointment.date_time);
                  return (
                    <div 
                      key={appointment.id} 
                      className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} shadow-sm border-l-4 ${
                        appointment.status === 'completed' ? 'border-green-500' : 
                        appointment.status === 'cancelled' ? 'border-red-500' : 'border-teal-500'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
                            {patientAvatars[appointment.other_party_name] ? (
                              <img 
                                src={patientAvatars[appointment.other_party_name]} 
                                alt={appointment.other_party_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full ${isDarkMode ? 'bg-gradient-to-r from-teal-500 to-cyan-400' : 'bg-gradient-to-r from-teal-500 to-cyan-400'} flex items-center justify-center text-white`}>
                                <span className="text-xl">
                                  {appointment.other_party_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {appointment.other_party_name}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-500">{appointment.appointment_type}</span>
                              {appointment.linked_embryo_id && (
                                <>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    appointment.embryo_grade === 'AA' || appointment.embryo_grade === '2-1-1' || appointment.embryo_grade === '3-1-1' 
                                      ? 'bg-green-100 text-green-800' 
                                      : appointment.embryo_grade === 'BB' || appointment.embryo_grade?.includes('2-2') || appointment.embryo_grade?.includes('3-2')
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : appointment.embryo_grade === 'Arrested' || appointment.embryo_grade?.includes('3-3')
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    Embryo: {appointment.embryo_grade || 'Unknown'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="flex items-center justify-end">
                            <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{date}</span>
                          </div>
                          <div className="flex items-center justify-end mt-1">
                            <svg className="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        <button 
                          className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium hover:bg-teal-200 transition-colors flex items-center"
                          onClick={() => window.open('https://meet.google.com', '_blank')}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Join Meeting
                        </button>
                        
                        <button 
                          className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center"
                          onClick={() => handleAppointmentStatusUpdate(appointment.id, 'completed')}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Completed
                        </button>
                        
                        <button 
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Reschedule
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                      {patientAvatars['Emma Thompson'] ? (
                        <img 
                          src={patientAvatars['Emma Thompson']} 
                          alt="Emma Thompson"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-rose-800">ET</span>
                        </div>
                      )}
                      <span className="text-sm">Emma Thompson</span>
                    </div>
                    <span className="text-xs text-gray-500">Today, 2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      {patientAvatars['Emma Jhonson'] ? (
                        <img 
                          src={patientAvatars['Emma Jhonson']} 
                          alt="Emma Jhonson"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-800">EJ</span>
                        </div>
                      )}
                      <span className="text-sm">Emma Jhonson</span>
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
                <h2 className="text-lg font-semibold notifications-title">Notifications</h2>
                <button className="text-xs text-teal-500 hover:text-teal-400 font-medium">Mark all as read</button>
              </div>
              
              {/* Notification filters */}
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                <button className="px-3 py-1 bg-teal-100 text-teal-800 dark-mode-button-active rounded-full text-xs font-medium whitespace-nowrap">All</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 dark-mode-button rounded-full text-xs font-medium whitespace-nowrap">Appointments</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 dark-mode-button rounded-full text-xs font-medium whitespace-nowrap">Messages</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 dark-mode-button rounded-full text-xs font-medium whitespace-nowrap">System</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 dark-mode-button rounded-full text-xs font-medium whitespace-nowrap">Analysis</button>
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
