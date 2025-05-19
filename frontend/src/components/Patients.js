import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock veriler
const mockPatients = [
  { id: 'mock1', full_name: 'Emma Thompson', email: 'emma.thompson@example.com', username: 'emma', is_mock: true, age: 34 },
  { id: 'mock2', full_name: 'Sarah Johnson', email: 'sarah.johnson@example.com', username: 'sarah', is_mock: true, age: 29 },
  { id: 'mock3', full_name: 'Lisa Davis', email: 'lisa.davis@example.com', username: 'lisa', is_mock: true, age: 31 },
  { id: 'mock4', full_name: 'Emily Brown', email: 'emily.brown@example.com', username: 'emily', is_mock: true, age: 36 }
];

// Tekilleştirme fonksiyonu (email VEYA username aynıysa tekilleştir)
function uniqueBy(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const key = (item.email || '') + '|' + (item.username || '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function Patients() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  // Mock hastaları sadece ilk yüklemede ekle
  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const handleSelectPatient = async (patientId, patient) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
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
        setError(data.message);
      }
    } catch (err) {
      setError('Hasta seçilirken bir hata oluştu');
    }
  };

  // fetchPatients sadece veritabanı hastalarını günceller, mock'ları tekrar eklemez
  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'doctor') {
        navigate('/login');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/doctor/patients?doctor_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        const dbPatients = data.patients.map(patient => ({
          ...patient,
          is_mock: false
        }));
        setPatients(prev => [
          ...dbPatients,
          ...prev.filter(p => p.is_mock)
        ]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Hastalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, [navigate]);

  // Filtrelenmiş ve tekilleştirilmiş hasta listesi
  const filteredPatients = uniqueBy(
    patients
      .filter(p =>
        (p.full_name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()))
        && !(p.username && p.username.startsWith('demo')) // demo usernamelileri çıkar
      )
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">Yükleniyor...</div>
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
      <h1 className="text-2xl font-bold mb-6">Hastalarım</h1>
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
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-2xl text-teal-600">
                {patient.full_name.charAt(0)}
              </span>
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{patient.full_name}</h2>
              <p className="text-sm text-gray-500">{patient.email}</p>
              <p className="text-sm text-gray-500">@{patient.username}</p>
              {patient.is_mock && (
                <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full mt-1">
                  Demo Hasta
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
              Hasta Seç
            </button>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-10">
            {search ? 'Arama sonucu bulunamadı.' : 'Henüz hasta bulunmuyor.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients; 