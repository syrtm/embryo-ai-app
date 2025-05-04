import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.svg';

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('results');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data
  const recentAnalyses = [
    {
      id: 1,
      date: '03/05/2025',
      grade: 'AA',
      recommendation: 'Excellent quality embryo, recommended for transfer',
      image: '/embryo1.jpg',
      status: 'Completed',
      doctor: 'Dr. Smith',
      confidence: 98
    },
    {
      id: 2,
      date: '02/05/2025',
      grade: 'BB',
      recommendation: 'Good quality embryo, suitable for transfer',
      image: '/embryo2.jpg',
      status: 'Completed',
      doctor: 'Dr. Johnson',
      confidence: 85
    }
  ];

  const appointments = [
    {
      id: 1,
      date: '05/05/2025',
      time: '09:00',
      doctor: 'Dr. Smith',
      type: 'Follow-up Consultation',
      location: 'Virtual Appointment'
    },
    {
      id: 2,
      date: '10/05/2025',
      time: '14:30',
      doctor: 'Dr. Johnson',
      type: 'Embryo Transfer Discussion',
      location: 'Clinic - Room 305'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={embryoLogo} alt="EmbryoAI Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">EmbryoAI</h1>
            </div>
            <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome, Sarah</h1>
            <div className="flex items-center space-x-4">
              <button className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} relative`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-teal-500"></span>
              </button>
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <img src="/avatar.jpg" alt="Patient" className="w-8 h-8 rounded-full bg-gray-200 ring-2 ring-teal-500" />
                </button>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-yellow-300' : 'bg-gray-200 text-slate-700'}`}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Analysis Results */}
          <div className="md:col-span-2 space-y-6">
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm`}>
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your Embryo Analysis Results
                </h2>
                <div className="space-y-6">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className={`flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl transition-all hover:shadow-md`}>
                      <div className="relative">
                        <img
                          src={analysis.image}
                          alt="Embryo"
                          className="w-full sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-teal-500"
                        />
                        <div className="absolute bottom-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          {analysis.confidence}%
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h3 className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis #{analysis.id}</h3>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{analysis.date}</span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>Analyzed by {analysis.doctor}</p>
                        <div className="mt-3 flex items-center">
                          <span className="mr-2 text-sm font-medium">Grade:</span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${analysis.grade === 'AA' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {analysis.grade}
                          </span>
                        </div>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{analysis.recommendation}</p>
                        <div className="mt-3 flex justify-end">
                          <button className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center">
                            View Full Report
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {recentAnalyses.map((analysis) => (
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
                              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${analysis.grade === 'AA' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                {analysis.confidence}% confidence
                              </span>
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
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className={`border-l-4 ${isDarkMode ? 'border-teal-500 bg-slate-700' : 'border-teal-500 bg-teal-50'} p-4 rounded-r-xl transition-all hover:shadow-md`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{appointment.type}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>with {appointment.doctor}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{appointment.location}</p>
                      </div>
                      <div className={`mt-2 sm:mt-0 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} px-3 py-2 rounded-lg`}>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{appointment.date}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-center`}>{appointment.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2 justify-end">
                      <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}>
                        Reschedule
                      </button>
                      <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-teal-600 text-white hover:bg-teal-500' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'} transition-colors`}>
                        Confirm
                      </button>
                    </div>
                  </div>
                ))}
                <button className={`w-full ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'} px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Schedule New Appointment
                </button>
              </div>
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
    </div>
  );
}

export default PatientDashboard;
