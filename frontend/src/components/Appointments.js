import React, { useState, useEffect } from 'react';
import patientAvatars from '../utils/patientAvatars';

function Appointments() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  
  useEffect(() => {
    // Fetch appointments when component mounts
    fetchAppointments();
    
    // Get user information
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // If user is a doctor, fetch patients for booking form
      if (user.role === 'doctor') {
        fetchPatients(user.id);
      }
      // If user is a patient, fetch doctors for booking form
      else if (user.role === 'patient') {
        fetchDoctors();
      }
    }
  }, []);
  
  const fetchAppointments = async () => {
    let user;
    try {
      setLoading(true);
      user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`http://localhost:5000/api/appointments?userId=${user.id}&role=${user.role}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Process appointments data
        const processedAppointments = data.appointments.map(appointment => {
          // Parse the date and time
          const dateTime = new Date(appointment.date_time);
          
          // Patient name (other party for doctor, self for patient)
          const patientName = user.role === 'doctor' ? appointment.other_party_name : user.username;
          
          // Get photo from patientAvatars or use default
          const patientPhoto = patientAvatars[patientName] || 'https://randomuser.me/api/portraits/women/44.jpg';
          
          return {
            id: appointment.id,
            patient: {
              id: appointment.patient_id,
              name: patientName,
              photo: patientPhoto,
            },
            doctor: {
              name: user.role === 'patient' ? appointment.other_party_name : user.username,
              photo: 'https://randomuser.me/api/portraits/men/36.jpg', // Default doctor photo
            },
            userRole: user.role, // Store user role to determine display
            type: appointment.appointment_type,
            date: formatDate(dateTime),
            time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appointment.status,
            linkedEmbryo: appointment.linked_embryo_id,
            embryoGrade: appointment.embryo_grade
          };
        });
        
        setAppointments(processedAppointments);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      // Log more details for debugging
      console.log('User data:', user);
      console.log('API URL:', `http://localhost:5000/api/appointments?userId=${user.id}&role=${user.role}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPatients = async (doctorId) => {
    try {
      setLoadingPatients(true);
      const response = await fetch(`http://localhost:5000/api/patients?doctor_id=${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.patients);
      } else {
        // If API fails, use mock data
        setPatients([
          { id: 1, name: 'Emma Thompson' },
          { id: 2, name: 'John Smith' },
          { id: 3, name: 'Sarah Johnson' },
          { id: 4, name: 'Michael Brown' },
          { id: 5, name: 'Emily Davis' },
          { id: 6, name: 'Emma Jhonson', is_mock: true }
        ]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback to mock data
      setPatients([
        { id: 1, name: 'Emma Thompson' },
        { id: 2, name: 'John Smith' },
        { id: 3, name: 'Sarah Johnson' },
        { id: 4, name: 'Michael Brown' },
        { id: 5, name: 'Emily Davis' },
        { id: 6, name: 'Emma Jhonson', is_mock: true }
      ]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await fetch(`http://localhost:5000/api/doctors`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        // If API fails, use mock data
        setDoctors([
          { id: 1, name: 'Dr. Ahmet Yılmaz', specialization: 'Embriyo Uzmanı' },
          { id: 2, name: 'Dr. James Wilson', specialization: 'Reproductive Endocrinology' },
          { id: 3, name: 'Dr. Sarah Miller', specialization: 'Embryology' },
          { id: 4, name: 'Dr. Robert Johnson', specialization: 'Fertility Specialist' },
          { id: 5, name: 'Dr. Jennifer Lee', specialization: 'Reproductive Medicine' },
          { id: 6, name: 'Dr. David Chen', specialization: 'Reproductive Surgery' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback to mock data
      setDoctors([
        { id: 1, name: 'Dr. Ahmet Yılmaz', specialization: 'Embriyo Uzmanı' },
        { id: 2, name: 'Dr. James Wilson', specialization: 'Reproductive Endocrinology' },
        { id: 3, name: 'Dr. Sarah Miller', specialization: 'Embryology' },
        { id: 4, name: 'Dr. Robert Johnson', specialization: 'Fertility Specialist' },
        { id: 5, name: 'Dr. Jennifer Lee', specialization: 'Reproductive Medicine' },
        { id: 6, name: 'Dr. David Chen', specialization: 'Reproductive Surgery' }
      ]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00',
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up Consultation',
    'Embryo Transfer Discussion',
    'Treatment Planning',
    'Results Evaluation'
  ];

  // This mock data is now replaced by the patients state from API

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      // Get the current user
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User ID could not be verified');
      }
      
      // Determine patient and doctor IDs based on user role
      let patientId, doctorId;
      
      if (user.role === 'doctor') {
        // If user is a doctor, they select a patient
        if (!selectedPatient) {
          throw new Error('Please select a patient');
        }
        patientId = selectedPatient; // We're now using the ID directly from the select
        doctorId = user.id; // Doctor is the current user
      } else {
        // If user is a patient, they select a doctor
        if (!selectedDoctor) {
          throw new Error('Please select a doctor');
        }
        patientId = user.id; // Patient is the current user
        doctorId = selectedDoctor; // We're now using the ID directly from the select
      }
      
      // Format the date and time
      if (!selectedDate || !selectedTime) {
        throw new Error('Please select date and time');
      }
      const dateTime = `${selectedDate}T${selectedTime}:00`;
      
      if (!selectedType) {
        throw new Error('Please select appointment type');
      }
      
      console.log('Booking appointment with:', {
        patientId,
        doctorId,
        appointmentType: selectedType,
        dateTime
      });
      
      // Create the appointment
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId,
          doctorId: doctorId,
          appointmentType: selectedType,
          dateTime: dateTime
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Close the booking form and refresh appointments
        setShowBooking(false);
        fetchAppointments();
        alert('Appointment created successfully!');
      } else {
        throw new Error(result.message || 'An error occurred while creating the appointment');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert(err.message || 'An error occurred while creating the appointment');
    }
  };

  // Map of doctors to their avatar images
  const doctorAvatars = {
    'Dr. Smith': 'https://randomuser.me/api/portraits/men/32.jpg',
    'Dr. Johnson': 'https://randomuser.me/api/portraits/women/44.jpg'
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with aligned button */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your scheduled appointments</p>
          </div>
          <button
            onClick={() => setShowBooking(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all duration-150 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Yeni Randevu Oluştur
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
            </div>
            {!loading && (
              <div className="text-sm text-gray-500">
                {appointments.filter(a => a.status === 'upcoming' || a.status === 'scheduled').length} upcoming
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Appointments</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchAppointments} 
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : appointments.filter(a => a.status === 'upcoming' || a.status === 'scheduled').length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-600">You don't have any upcoming appointments scheduled.</p>
              <button 
                onClick={() => setShowBooking(true)} 
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.filter(a => a.status === 'upcoming' || a.status === 'scheduled').map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={appointment.userRole === 'doctor' ? appointment.patient.photo : appointment.doctor.photo}
                        alt={appointment.userRole === 'doctor' ? appointment.patient.name : appointment.doctor.name}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/48?text=User';
                        }}
                      />
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900">{appointment.userRole === 'doctor' ? appointment.patient.name : appointment.doctor.name}</h3>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                          {appointment.linkedEmbryo && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                                Embryo: {appointment.embryoGrade || 'Analysis'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-teal-600 font-medium">{appointment.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button 
                      className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-200 transition-colors"
                      onClick={() => window.open('https://meet.google.com', '_blank')}
                    >
                      Join Meeting
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        // In a real app, this would open a reschedule modal
                        alert('Reschedule functionality would open here');
                      }}
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        <div className="bg-gray-50 shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <div className="bg-gray-200 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base font-medium text-gray-600">Past Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {appointments
              .filter(apt => apt.status === 'completed')
              .map(app => (
                <div key={app.id} className="p-6 hover:bg-gray-100 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <img 
                          src={app.userRole === 'doctor' ? app.patient.photo : app.doctor.photo} 
                          alt={app.userRole === 'doctor' ? app.patient.name : app.doctor.name} 
                          className="h-12 w-12 rounded-full object-cover border border-gray-200 filter grayscale opacity-75" 
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-700">{app.type}</h3>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-gray-500">{app.doctor.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{app.date}</p>
                      <p className="text-sm text-gray-500 mt-1">{app.time}</p>
                      <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    onClick={() => setShowBooking(false)}
                    className="bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center justify-center mb-5">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-teal-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center sm:mt-5">
                    <h3 className="text-xl leading-6 font-semibold text-gray-900">
                      Create New Appointment
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Please select your preferred date, time, and appointment type.
                    </p>
                    
                    <form onSubmit={handleBookAppointment} className="mt-6 space-y-6 text-left">
                      {/* Show patient selection for doctor role */}
                      {JSON.parse(localStorage.getItem('user'))?.role === 'doctor' && (
                        <div>
                          <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Patient
                            </div>
                          </label>
                          <select
                            id="patient"
                            required
                            value={selectedPatient}
                            onChange={e => setSelectedPatient(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                          >
                            <option value="">Select patient</option>
                            {patients.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {/* Show doctor selection for patient role */}
                      {JSON.parse(localStorage.getItem('user'))?.role === 'patient' && (
                        <div>
                          <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Doctor
                            </div>
                          </label>
                          <select
                            id="doctor"
                            required
                            value={selectedDoctor}
                            onChange={e => setSelectedDoctor(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                          >
                            <option value="">Select doctor</option>
                            {doctors.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Date
                          </div>
                        </label>
                        <input
                          type="date"
                          id="date"
                          required
                          value={selectedDate || ''}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Time
                          </div>
                        </label>
                        <select
                          id="time"
                          required
                          value={selectedTime || ''}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        >
                          <option value="">Select time</option>
                          {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Appointment Type
                          </div>
                        </label>
                        <select
                          id="type"
                          required
                          value={selectedType || ''}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        >
                          <option value="">Select appointment type</option>
                          {appointmentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-8 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowBooking(false)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Create Appointment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
