import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('results');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [embryoResults, setEmbryoResults] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert grade to patient-friendly description
  const getGradeDescription = (grade) => {
    if (!grade) return '';
    
    if (grade === 'AA' || grade === '2-1-1' || grade === '3-1-1') {
      return 'Excellent quality embryo, recommended for transfer';
    } else if (grade === 'BB' || grade.includes('2-2') || grade.includes('3-2')) {
      return 'Good quality embryo, suitable for transfer';
    } else if (grade === 'Arrested') {
      return 'Embryo development stopped. Transfer not recommended.';
    } else if (grade === 'Morula') {
      return 'Embryo has reached the morula stage, showing good development';
    } else if (grade === 'Early') {
      return 'Early stage embryo, continuing to monitor development';
    } else {
      return 'Embryo quality varies. Consult with your doctor for more details.';
    }
  };

  // Helper function to get color based on grade
  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    
    if (grade === 'AA' || grade === '2-1-1' || grade === '3-1-1' || grade === 'Morula') {
      return 'bg-green-100 text-green-800';
    } else if (grade === 'BB' || grade.includes('2-2') || grade.includes('3-2')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (grade === 'Arrested' || grade.includes('3-3') || grade.includes('2-3')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  // Helper function to convert rating number to stars
  const getRatingStars = (rating) => {
    if (rating === undefined || rating === null) return null;
    
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
  };

  // Fetch embryo results and appointments for the current patient
  useEffect(() => {
    const fetchEmbryoResults = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch reports from the API
        const response = await fetch(`http://localhost:5000/api/reports?user_id=${user.id}&role=patient`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.reports)) {
          // Transform the API data to match our required format
          const formattedResults = data.reports.map((report, index) => {
            // Parse the result field which contains the embryo classification
            let grade = report.result || '';
            let confidence = report.confidence || 0;
            
            // Format the date
            const createdDate = new Date(report.created_at);
            const formattedDate = createdDate.toLocaleDateString();
            
            return {
              id: report.id,
              embryoId: `Embryo #${index + 1}`,
              date: formattedDate,
              grade: grade,
              doctor: report.other_party_name || 'Unknown Doctor',
              confidence: confidence,
              notes: report.notes,
              // These would ideally come from the API, but we're using placeholder values for now
              fragmentation: grade.includes('1') ? 4 : (grade.includes('2') ? 3 : (grade.includes('3') ? 1 : 2)),
              symmetry: grade.includes('1') ? 4 : (grade.includes('2') ? 3 : (grade.includes('3') ? 1 : 2)),
              generalQuality: grade.includes('1') ? 4 : (grade.includes('2') ? 3 : (grade.includes('3') ? 1 : 2))
            };
          });
          
          setEmbryoResults(formattedResults);
        } else {
          // If there's no data or an error, set empty results
          setEmbryoResults([]);
        }
      } catch (err) {
        console.error('Error fetching embryo results:', err);
        setError('Failed to load embryo results');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbryoResults();
  }, []);

  // Fetch appointments for the current patient
  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.id) {
        setAppointmentsLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/appointments?userId=${user.id}&role=${user.role}`);
      if (!response.ok) {
        throw new Error('Randevuları getirirken bir hata oluştu');
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.appointments)) {
        // Process appointments data
        const formattedAppointments = data.appointments.map(appointment => {
          // Parse the date and time
          const dateTime = new Date(appointment.date_time);
          
          return {
            id: appointment.id,
            date: dateTime.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: dateTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            type: appointment.appointment_type,
            doctor: appointment.other_party_name,
            location: 'Klinik',
            notes: '',
            virtual: appointment.location === 'Virtual',
            embryoGrade: appointment.embryo_grade
          };
        });
        
        // Sort appointments by date (earliest first)
        const sortedAppointments = formattedAppointments.sort((a, b) => {
          const dateA = new Date(a.date.split('.').reverse().join('-') + 'T' + a.time);
          const dateB = new Date(b.date.split('.').reverse().join('-') + 'T' + b.time);
          return dateA - dateB;
        });
        
        setAppointments(sortedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // useEffect ile fetchAppointments fonksiyonunu çağıralım
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Analysis Results */}
        <div className="md:col-span-2 space-y-6">
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm`}>
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Embryo Analysis Results</h2>
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button 
                      className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </div>
                ) : embryoResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No embryo analysis results found.</p>
                  </div>
                ) : (
                  embryoResults.map((result) => (
                    <div 
                      key={result.id} 
                      className={`flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl transition-all hover:shadow-md border-l-4 ${getGradeColor(result.grade).replace('bg-', 'border-').replace(' text-', ' border-')}`}
                    >
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h3 className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{result.embryoId}</h3>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{result.date}</span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>Analyzed by {result.doctor}</p>
                        
                        <div className="mt-3 flex items-center flex-wrap gap-2">
                          <span className="mr-2 text-sm font-medium">Grade:</span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getGradeColor(result.grade)}`}>{result.grade}</span>
                          
                          {result.confidence && (
                            <span className="ml-auto inline-flex items-center px-2 py-1 rounded-lg bg-teal-500 text-white text-xs font-bold">
                              {Math.round(result.confidence)}% Confidence
                            </span>
                          )}
                        </div>
                        
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {getGradeDescription(result.grade)}
                        </p>
                        
                        {/* Detailed ratings with stars */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {result.fragmentation !== undefined && (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Fragmentation</span>
                              <span className="text-sm text-yellow-500">{getRatingStars(result.fragmentation)}</span>
                            </div>
                          )}
                          
                          {result.symmetry !== undefined && (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Symmetry</span>
                              <span className="text-sm text-yellow-500">{getRatingStars(result.symmetry)}</span>
                            </div>
                          )}
                          
                          {result.generalQuality !== undefined && (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">General Quality</span>
                              <span className="text-sm text-yellow-500">{getRatingStars(result.generalQuality)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Link 
                            to={`/patient/embryo-report/${result.id}`}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center"
                          >
                            View Full Report
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 text-center">
                <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-medium transition-colors`}>
                  View All Analysis Results
                </button>
              </div>
            </div>
          </div>

          {/* Treatment Timeline */}
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Treatment Timeline</h2>
            <div className="relative">
              <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`}></div>
              <div className="space-y-8">
                {embryoResults.map((analysis) => (
                  <div key={analysis.id} className="relative flex items-start ml-4">
                    <div className="absolute -left-6 mt-1">
                      <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4 flex-1 transition-all hover:shadow-md`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Embryo Analysis</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>Grade {analysis.grade} - {analysis.doctor}</p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${analysis.grade === 'AA' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`}>{analysis.confidence}% confidence</span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} inline-block px-2 py-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>{analysis.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add a future appointment to the timeline */}
                <div className="relative flex items-start ml-4">
                  <div className="absolute -left-6 mt-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className={`border border-dashed ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-50'} rounded-xl p-4 flex-1`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Scheduled Embryo Transfer</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>With Dr. Smith</p>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} inline-block px-2 py-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>15/05/2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Appointments and Progress */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Appointments</h2>
            {appointmentsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>Yaklaşan randevunuz bulunmamaktadır.</p>
                <Link to="/appointments" className={`inline-block mt-4 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white font-medium transition-colors`}>
                  Randevu Al
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="mb-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex-shrink-0 mr-4 overflow-hidden flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.doctor}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{appointment.type}</p>
                            {appointment.embryoGrade && (
                              <span className="inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                Embriyo: {appointment.embryoGrade}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{appointment.date}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{appointment.time}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2 justify-end">
                          <button className="text-xs px-3 py-1.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                            Reschedule
                          </button>
                          {appointment.virtual ? (
                            <button className="text-xs px-3 py-1.5 rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors">
                              Join Meeting
                            </button>
                          ) : (
                            <button className="text-xs px-3 py-1.5 rounded bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors">
                              Confirm
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className={`w-full ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'} px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Schedule New Appointment
            </button>
          </div>

          {/* Treatment Progress */}
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Treatment Progress</h2>
            <div className="space-y-5">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Initial Consultation</span>
                  <span className={`text-sm ${isDarkMode ? 'text-teal-400' : 'text-teal-600'} font-medium`}>Completed</span>
                </div>
                <div className={`overflow-hidden h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 w-full rounded-full"></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Embryo Analysis</span>
                  <span className={`text-sm ${isDarkMode ? 'text-teal-400' : 'text-teal-600'} font-medium`}>In Progress</span>
                </div>
                <div className={`overflow-hidden h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 w-2/3 rounded-full"></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Treatment Plan</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</span>
                </div>
                <div className={`overflow-hidden h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div className={`h-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} w-1/3 rounded-full`}></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Embryo Transfer</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scheduled</span>
                </div>
                <div className={`overflow-hidden h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div className={`h-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} w-1/4 rounded-full`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
            <div className="space-y-3">
              <button className={`w-full flex items-center justify-between px-4 py-3 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-500'} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>View Medical Records</span>
                </div>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className={`w-full flex items-center justify-between px-4 py-3 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-500'} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Message Your Doctor</span>
                </div>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className={`w-full flex items-center justify-between px-4 py-3 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-500'} mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Update Personal Info</span>
                </div>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PatientDashboard;
