import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Seed-based random number generator
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return () => Math.abs(hash % 1000) / 1000;
}

// Generate consistent statistics based on doctor's name
function generateDoctorStats(name) {
  const random = seededRandom(name);
  return {
    totalPatients: Math.floor(random() * 1000) + 100, // 100-1099
    successRate: Math.floor(random() * 80) + 20, // 20-100
    consultationsThisMonth: Math.floor(random() * 50) + 10, // 10-59
    rating: Math.floor(random() * 5) + 1 // 1-5
  };
}

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get doctor username from localStorage
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    // If both username and token are missing, redirect to login
    if (!username || !token) {
      window.location.href = '/login';
      return;
    }

    // If only username is missing, try to get it from token
    if (!username && token) {
      // Here you would decode the token to get the username
      // For now, we'll just show an error
      setError('Geçersiz token');
      setLoading(false);
      return;
    }

    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/profile/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const data = response.data.doctor;
          const stats = generateDoctorStats(data.name);
          setDoctorData({
            name: data.name,
            department: data.department,
            email: data.email,
            phone: data.phone,
            education: data.education ? data.education.split(', ') : [],
            statistics: stats
          });
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Doktor profilini yüklerken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      if (!username || !token) {
        setError('Giriş bilgileri bulunamadı');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/doctor/profile/${username}`,
        doctorData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setIsEditing(false);
        setError('');
      } else {
        setError('Doktor detayları güncellenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Doktor detayları güncellenirken bir hata oluştu');
      console.error('Save error:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Doktor profilini yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!doctorData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex space-x-6">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-4xl">
              {doctorData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={doctorData.name}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Adınız"
                  />
                  <input
                    type="text"
                    value={doctorData.department}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Departman"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{doctorData.name}</h1>
                  <p className="text-lg text-teal-600">{doctorData.department}</p>
                  
                  {/* Statistics */}
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-teal-50 p-4 rounded">
                        <p className="text-sm text-teal-600">Total Patients</p>
                        <p className="text-2xl font-bold text-teal-700">{doctorData.statistics.totalPatients}</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded">
                        <p className="text-sm text-teal-600">Success Rate</p>
                        <p className="text-2xl font-bold text-teal-700">{doctorData.statistics.successRate}%</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded">
                        <p className="text-sm text-teal-600">Monthly Consultations</p>
                        <p className="text-2xl font-bold text-teal-700">{doctorData.statistics.consultationsThisMonth}</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded">
                        <p className="text-sm text-teal-600">Rating</p>
                        <p className="text-2xl font-bold text-teal-700">{doctorData.statistics.rating}/5.0</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Contact & Education */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="email"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="E-posta"
                />
                <input
                  type="tel"
                  value={doctorData.phone}
                  onChange={(e) => setDoctorData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Telefon"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p>{doctorData.email}</p>
                <p>{doctorData.phone}</p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">Education</h2>
            {isEditing ? (
              <div className="space-y-2">
                {doctorData.education.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => {
                        const newEducation = [...doctorData.education];
                        newEducation[index] = e.target.value;
                        setDoctorData(prev => ({ ...prev, education: newEducation }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => {
                        const newEducation = [...doctorData.education];
                        newEducation.splice(index, 1);
                        setDoctorData(prev => ({ ...prev, education: newEducation }));
                      }}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setDoctorData(prev => ({
                    ...prev,
                    education: [...prev.education, '']
                  }))}
                  className="text-teal-600 hover:text-teal-700"
                >
                  + Eğitim Ekle
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {doctorData.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;