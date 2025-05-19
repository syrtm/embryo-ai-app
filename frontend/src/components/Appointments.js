import React, { useState } from 'react';

function Appointments() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');

  // Mock data
  const appointments = [
    {
      id: 1,
      patient: {
        name: 'Emma Thompson',
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      doctor: 'Dr. Smith',
      type: 'Follow-up Consultation',
      date: 'Monday, May 5, 2025',
      time: '09:00',
      status: 'upcoming'
    },
    {
      id: 2,
      patient: {
        name: 'Sarah Johnson',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      doctor: 'Dr. Johnson',
      type: 'Embryo Transfer Discussion',
      date: 'Saturday, May 10, 2025',
      time: '14:30',
      status: 'upcoming'
    },
    {
      id: 3,
      patient: {
        name: 'Lisa Davis',
        photo: 'https://randomuser.me/api/portraits/women/63.jpg',
      },
      doctor: 'Dr. Smith',
      type: 'Initial Consultation',
      date: 'Monday, April 28, 2025',
      time: '11:00',
      status: 'completed'
    }
  ];

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00',
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up Consultation',
    'Embryo Transfer Discussion',
    'Treatment Planning',
    'Results Review'
  ];

  // Kadın hastalar listesi
  const patients = [
    { name: 'Emma Thompson', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Sarah Johnson', photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Lisa Davis', photo: 'https://randomuser.me/api/portraits/women/63.jpg' },
  ];

  const handleBookAppointment = (e) => {
    e.preventDefault();
    // In a real app, this would send the booking to the backend
    const patientObj = patients.find(p => p.name === selectedPatient);
    console.log('Booking appointment:', { selectedPatient: patientObj, selectedDate, selectedTime, selectedType });
    setShowBooking(false);
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
            Book New Appointment
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="bg-green-200 text-green-700 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-lg font-semibold">Upcoming Appointments</span>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{appointments.filter(a => a.status === 'upcoming').length} Scheduled</span>
          </div>
          {appointments.filter(a => a.status === 'upcoming').map(app => (
            <div key={app.id} className="flex items-center space-x-6 bg-white rounded-xl shadow p-5 mb-6 border border-gray-100">
              <img src={app.patient.photo} alt={app.patient.name} className="w-16 h-16 rounded-full object-cover border-2 border-teal-500" />
              <div className="flex-1">
                <div className="font-semibold text-lg">{app.type}</div>
                <div className="text-gray-700">{app.patient.name}</div>
                <div className="text-sm text-gray-500 flex items-center"><svg className="w-4 h-4 mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Doctor: {app.doctor}</div>
                      </div>
              <div className="flex flex-col items-end">
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-right mb-2">
                  <div className="text-xs">{app.date}</div>
                  <div className="text-2xl font-bold">{app.time}</div>
                        </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Reschedule</button>
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded-lg flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>Cancel</button>
                      </div>
                  </div>
                </div>
              ))}
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
                          src={app.patient.photo} 
                          alt={app.patient.name} 
                          className="h-12 w-12 rounded-full object-cover border border-gray-200 filter grayscale opacity-75" 
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-700">{app.type}</h3>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-gray-500">{app.doctor}</p>
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
                      Book New Appointment
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Please select your preferred date, time, and appointment type.
                    </p>
                    
                    <form onSubmit={handleBookAppointment} className="mt-6 space-y-6 text-left">
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
                          <option value="">Select a patient</option>
                          {patients.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>

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
                          <option value="">Select a time</option>
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
                          <option value="">Select type</option>
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
                          Book Appointment
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
