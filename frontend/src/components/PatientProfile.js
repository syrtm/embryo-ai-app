import React, { useState } from 'react';

function PatientProfile() {
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+90 555 123 4567',
    dateOfBirth: '1990-05-15',
    address: 'Kadıköy, Istanbul',
    bloodType: 'A+',
    emergencyContact: 'John Johnson',
    emergencyPhone: '+90 555 987 6543',
    allergies: 'None',
    medicalHistory: 'No significant medical history'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Patient Profile
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={isEditing ? editedProfile.firstName : profile.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={isEditing ? editedProfile.lastName : profile.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={isEditing ? editedProfile.phone : profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                    Blood Type
                  </label>
                  <input
                    type="text"
                    name="bloodType"
                    id="bloodType"
                    value={isEditing ? editedProfile.bloodType : profile.bloodType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={isEditing ? editedProfile.address : profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    id="emergencyContact"
                    value={isEditing ? editedProfile.emergencyContact : profile.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    id="emergencyPhone"
                    value={isEditing ? editedProfile.emergencyPhone : profile.emergencyPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    id="allergies"
                    value={isEditing ? editedProfile.allergies : profile.allergies}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    id="medicalHistory"
                    rows={3}
                    value={isEditing ? editedProfile.medicalHistory : profile.medicalHistory}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
