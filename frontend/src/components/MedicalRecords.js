import React from 'react';

function MedicalRecords() {
  // Mock data
  const records = [
    {
      id: 1,
      date: '2025-04-28',
      type: 'Lab Results',
      doctor: 'Dr. Smith',
      description: 'Hormone Level Analysis',
      status: 'completed'
    },
    {
      id: 2,
      date: '2025-04-25',
      type: 'Ultrasound',
      doctor: 'Dr. Johnson',
      description: 'Follicle Development Check',
      status: 'completed'
    },
    {
      id: 3,
      date: '2025-04-20',
      type: 'Embryo Analysis',
      doctor: 'Dr. Smith',
      description: 'Grade A Embryos Selected',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
          <p className="mt-2 text-sm text-gray-600">
            View your complete medical history and test results
          </p>
        </div>

        {/* Records List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Records</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {records.map((record) => (
              <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        {record.type === 'Lab Results' && (
                          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        )}
                        {record.type === 'Ultrasound' && (
                          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        {record.type === 'Embryo Analysis' && (
                          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{record.type}</h3>
                      <p className="text-sm text-gray-500">{record.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{record.date}</p>
                    <p className="text-sm text-gray-500">by {record.doctor}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button className="text-sm text-red-600 hover:text-red-500">
                    View Details
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-500">
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Request Medical Records
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Need a copy of your medical records? You can request them here and we'll send them to your email.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Request Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;
