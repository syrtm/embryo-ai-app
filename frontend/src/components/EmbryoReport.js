import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmbryoReport({ isDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);

  // Helper function to convert rating number to stars
  const getRatingStars = (rating) => {
    if (rating === undefined || rating === null) return null;
    
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
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

  // Generate available time slots for the selected date
  const getAvailableTimeSlots = () => {
    // Simulate available time slots
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
    ];
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // Fetch the specific report by ID
        const response = await fetch(`http://localhost:5000/api/report/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        
        const data = await response.json();
        
        if (data.success && data.report) {
          setReport(data.report);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleBookAppointment = async () => {
    try {
      setBookingStatus({ type: 'loading', message: 'Booking your appointment...' });
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // Format the date and time
      const dateTime = `${appointmentDate}T${appointmentTime}:00`;
      
      // Create the appointment
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: report.doctor_id,
          appointmentType: 'Embryo Transfer Consultation',
          linkedEmbryo: report.id,
          dateTime: dateTime
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBookingStatus({ type: 'success', message: 'Appointment booked successfully!' });
        // Close the modal after 2 seconds
        setTimeout(() => {
          setShowAppointmentModal(false);
          setBookingStatus(null);
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setBookingStatus({ type: 'error', message: err.message || 'Failed to book appointment' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Report Not Found</h2>
          <p className="text-yellow-600">The embryo report you're looking for could not be found.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-800'}`}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Report Header */}
      <div className={`rounded-xl shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Embryo Analysis Report
            </h1>
            <div className="mt-2 md:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(report.result)}`}>
                Grade: {report.result}
              </span>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Analysis Date: {new Date(report.created_at).toLocaleDateString()}
          </div>
          
          <div className="mt-1 text-sm text-gray-500">
            Analyzed by: Dr. {report.doctor_name || report.other_party_name || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className={`rounded-xl shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Embryo Image
            </h2>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              {report.image_path ? (
                <img 
                  src={`http://localhost:5000/uploads/${report.image_path}`} 
                  alt="Embryo" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Embryo+Image+Not+Available';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500 text-center">Embryo image not available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Analysis Details */}
        <div className={`rounded-xl shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Analysis Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Classification</h3>
                <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{report.result}</p>
              </div>
              
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confidence</h3>
                <div className="mt-1 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-teal-600 h-2.5 rounded-full" 
                      style={{ width: `${report.confidence}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{Math.round(report.confidence)}%</span>
                </div>
              </div>
              
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assessment</h3>
                <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getGradeDescription(report.result)}
                </p>
              </div>
              
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quality Ratings</h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Fragmentation</span>
                    <div className="text-yellow-500">
                      {getRatingStars(report.result.includes('1') ? 4 : (report.result.includes('2') ? 3 : (report.result.includes('3') ? 1 : 2)))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">Symmetry</span>
                    <div className="text-yellow-500">
                      {getRatingStars(report.result.includes('1') ? 4 : (report.result.includes('2') ? 3 : (report.result.includes('3') ? 1 : 2)))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">General Quality</span>
                    <div className="text-yellow-500">
                      {getRatingStars(report.result.includes('1') ? 4 : (report.result.includes('2') ? 3 : (report.result.includes('3') ? 1 : 2)))}
                    </div>
                  </div>
                </div>
              </div>
              
              {report.notes && (
                <div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Doctor's Notes</h3>
                  <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{report.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowAppointmentModal(true)}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Appointment with this Doctor
        </button>
      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Book an Appointment</h2>
                <button 
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setBookingStatus(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {bookingStatus ? (
                <div className={`p-4 rounded-lg ${bookingStatus.type === 'success' ? 'bg-green-50 text-green-800' : bookingStatus.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                  {bookingStatus.type === 'loading' && (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                      {bookingStatus.message}
                    </div>
                  )}
                  {bookingStatus.type === 'success' && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {bookingStatus.message}
                    </div>
                  )}
                  {bookingStatus.type === 'error' && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {bookingStatus.message}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {appointmentDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableTimeSlots().map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`px-3 py-2 text-sm font-medium rounded-md ${appointmentTime === time ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setAppointmentTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={handleBookAppointment}
                      disabled={!appointmentDate || !appointmentTime}
                      className={`w-full px-4 py-2 text-white rounded-lg ${!appointmentDate || !appointmentTime ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'} transition-colors`}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default EmbryoReport;
