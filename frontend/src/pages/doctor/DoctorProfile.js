import React, { useState } from 'react';

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: 'Dr. Smith',
    title: 'Fertility Specialist',
    specialization: 'IVF and Infertility',
    experience: '15 years',
    email: 'dr.smith@embryoai.com',
    phone: '+1 (555) 123-4567',
    education: [
      'Medical School - Harvard University (2005)',
      'Obstetrics & Gynecology - Johns Hopkins (2010)',
      'Reproductive Medicine Fellowship - Yale (2012)'
    ],
    statistics: {
      totalPatients: 1250,
      successRate: 68,
      consultationsThisMonth: 45,
      rating: 4.8
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // API call will be added
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex space-x-6">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-4xl">
              👩🏻‍⚕️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctorData.name}</h1>
              <p className="text-lg text-teal-600">{doctorData.title}</p>
              <p className="text-gray-600">{doctorData.specialization}</p>
              <p className="text-gray-500">Experience: {doctorData.experience}</p>
            </div>
          </div>
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        {/* Contact & Education */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            <div className="space-y-2">
              <p>{doctorData.email}</p>
              <p>{doctorData.phone}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">Education</h2>
            <ul className="space-y-2">
              {doctorData.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 