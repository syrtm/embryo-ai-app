import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientAvatars from '../utils/patientAvatars';

// Deduplication function (unique by ID)
function uniqueBy(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const key = item.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function Patients() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  // Fetch patients from API
  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSelectPatient = async (patientId, patient) => {
    try {
      // Make API call to select patient
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('API çağrısı yapılıyor, doctor_id:', user.id, 'patient_id:', patientId);
      
      const response = await fetch('http://localhost:5000/api/doctor/select-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: user.id,
          patient_id: patientId
        })
      });

      const data = await response.json();
      console.log('API yanıtı:', data);
      
      if (data.success) {
        setSelectedPatient(patientId);
        fetchPatients();
        // name ve age alanlarını garanti altına al
        const patientForAnalysis = {
          ...patient,
          name: patient.full_name || patient.name,
          age: patient.age || ''
        };
        navigate('/doctor/analysis', { state: { patient: patientForAnalysis } });
      } else {
        setError(data.message || 'An error occurred while selecting the patient');
      }
    } catch (err) {
      console.error('Error selecting patient:', err);
      setError('An error occurred while selecting the patient');
    }
  };

  // fetchPatients retrieves patients from API, uses real database data
  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'doctor') {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      setError('');
      
      // Önce doktorun hastalarını çek
      try {
        const response = await fetch(`http://localhost:5000/api/doctor/patients?doctor_id=${user.id}`);
        const doctorData = await response.json();
        console.log('Doktor hastaları API yanıtı:', doctorData);
        
        if (doctorData.success && Array.isArray(doctorData.patients) && doctorData.patients.length > 0) {
          console.log('Doctor patients found:', doctorData.patients.length);
          setDoctorPatients(doctorData.patients);
          setPatients(doctorData.patients);
          setLoading(false);
          return;
        } else {
          console.log('No patients found for doctor or an error occurred, fetching all patients');
          
          // Doktor hastaları yoksa veya hata varsa, tüm hastaları çek
          try {
            const allPatientsResponse = await fetch('http://localhost:5000/api/patients');
            const data = await allPatientsResponse.json();
            console.log('Tüm hastalar API yanıtı:', data);
            
            if (Array.isArray(data) && data.length > 0) {
              // Veritabanı verilerini kullan
              const dbPatients = data.map(p => ({
                ...p,
                is_mock: false
              }));
              console.log('Database patients:', dbPatients);
              setPatients(dbPatients);
            } else {
              console.log('API did not return a valid array or returned an empty array');
              setError('No patient data found');
            }
          } catch (apiError) {
            console.error('API error while fetching patients:', apiError);
            setError('An error occurred while loading patients. Please try again later.');
          }
        }
      } catch (doctorApiError) {
        console.error('API error while fetching doctor patients:', doctorApiError);
        setError('An error occurred while loading doctor patients. Please try again later.');
      }
    } catch (err) {
      console.error('General error:', err);
      setError('An error occurred while loading patients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, [navigate]);

  // Filtered and deduplicated patient list
  console.log('Filtreleme öncesi hastalar:', patients);
  
  const filteredPatients = uniqueBy(patients)
    .filter(p => {
      const fullName = p.full_name || p.name || '';
      const email = p.email || '';
      const searchLower = search.toLowerCase();
      const nameMatch = fullName.toLowerCase().includes(searchLower);
      const emailMatch = email.toLowerCase().includes(searchLower);
      return search === '' || nameMatch || emailMatch;
    });
  
  console.log('Filtreleme sonrası hastalar:', filteredPatients);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Patients</h1>
      <input
        type="text"
        placeholder="İsim veya email ile ara..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="bg-white rounded-xl shadow p-5 flex items-center space-x-4 border border-gray-100">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
              {patientAvatars[patient.full_name || patient.name] ? (
                <img 
                  src={patientAvatars[patient.full_name || patient.name]} 
                  alt={patient.full_name || patient.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl text-teal-600">
                    {(patient.full_name || patient.name || '?').charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{patient.full_name || patient.name || 'Unnamed Patient'}</h2>
              <p className="text-sm text-gray-500">{patient.email || 'No email'}</p>
              <p className="text-sm text-gray-500">@{patient.username || 'no-username'}</p>
              {patient.is_mock && (
                <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full mt-1">
                  Demo Patient
                </span>
              )}
            </div>
            <button
              onClick={() => handleSelectPatient(patient.id, patient)}
              className={`px-4 py-2 rounded-lg ${
                patient.is_selected
                  ? 'bg-green-100 text-green-700'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              Select Patient
            </button>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-10">
            {search ? 'No results found.' : 'No patients found yet.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients; 