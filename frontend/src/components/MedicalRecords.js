import React, { useState, useEffect } from 'react';

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  
  useEffect(() => {
    // Fetch medical records from API
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          throw new Error('User not authenticated');
        }
        
        // Fetch embryo analysis reports
        const reportsResponse = await fetch(`http://localhost:5000/api/reports?user_id=${user.id}&role=patient`);
        if (!reportsResponse.ok) {
          throw new Error('Failed to fetch embryo reports');
        }
        
        const reportsData = await reportsResponse.json();
        
        // Convert reports to medical record format
        const embryoReports = reportsData.success ? reportsData.reports.map(report => ({
          id: report.id,
          date: report.created_at,
          type: 'Embryo Analysis',
          doctor: report.other_party_name,
          description: `Embryo Grade: ${report.result || 'Not specified'}`,
          status: 'completed',
          pdfUrl: `/documents/embryo-report-${report.id}.pdf`,
          isEmbryoReport: true,
          embryoData: report
        })) : [];
        
        // Combine with mock medical records
        // In a real app, we would fetch other medical records from another API endpoint
        // const medicalResponse = await fetch(`http://localhost:5000/api/medical-records?patientId=${user.id}`);
        // const medicalData = await medicalResponse.json();
        // const medicalRecords = medicalData.records;
        
        // Combine both types of records and sort by date
        const allRecords = [...embryoReports, ...mockMedicalRecords].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
        setRecords(allRecords);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medical records:', err);
        setError(err.message || 'Failed to load medical records');
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);
  
  // Mock data
  const mockMedicalRecords = [
    {
      id: 1,
      date: '2025-04-28',
      type: 'Lab Results',
      doctor: 'Dr. Smith',
      description: 'Hormone Level Analysis',
      status: 'completed',
      pdfUrl: '/documents/lab-results-20250428.pdf'
    },
    {
      id: 2,
      date: '2025-04-25',
      type: 'Ultrasound',
      doctor: 'Dr. Johnson',
      description: 'Follicle Development Check',
      status: 'completed',
      pdfUrl: '/documents/ultrasound-20250425.pdf'
    },
    {
      id: 3,
      date: '2025-04-20',
      type: 'Embryo Analysis',
      doctor: 'Dr. Smith',
      description: 'Grade A Embryos Selected',
      status: 'completed',
      pdfUrl: '/documents/embryo-analysis-20250420.pdf'
    },
    {
      id: 4,
      date: '2025-04-15',
      type: 'Consultation',
      doctor: 'Dr. Williams',
      description: 'Treatment Plan Discussion',
      status: 'completed',
      pdfUrl: '/documents/consultation-20250415.pdf'
    },
    {
      id: 5,
      date: '2025-04-10',
      type: 'Lab Results',
      doctor: 'Dr. Brown',
      description: 'Blood Work Analysis',
      status: 'completed',
      pdfUrl: '/documents/lab-results-20250410.pdf'
    }
  ];

  // Function to get the appropriate icon based on record type
  const getRecordIcon = (type) => {
    switch(type) {
      case 'Lab Results':
        return (
          <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Ultrasound':
        return (
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Embryo Analysis':
        return (
          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'Consultation':
        return (
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  // Function to get background color based on record type
  const getBackgroundColor = (type) => {
    switch(type) {
      case 'Lab Results':
        return 'bg-teal-100';
      case 'Ultrasound':
        return 'bg-blue-100';
      case 'Embryo Analysis':
        return 'bg-purple-100';
      case 'Consultation':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Handle PDF download
  const handleDownloadPDF = async (record) => {
    try {
      setDownloadingPdf(true);
      
      // Get the user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('Kullanıcı kimliği doğrulanamadı');
      }
      
      // Create the URL for the PDF download endpoint
      let downloadUrl;
      
      if (record.isEmbryoReport) {
        // For embryo reports, use the embryo report endpoint
        downloadUrl = `http://localhost:5000/api/reports/${record.id}/pdf?userId=${user.id}`;
      } else {
        // For other medical records, use the medical records endpoint
        downloadUrl = `http://localhost:5000/api/medical-records/${record.id}/pdf?userId=${user.id}`;
      }
      
      // Fetch the PDF
      console.log('PDF indirme URL:', downloadUrl);
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        // Hata detaylarını almaya çalış
        let errorMessage = 'PDF indirilemedi';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Sunucu hatası:', errorData);
        } catch (e) {
          console.error('Hata detayları alınamadı:', e);
        }
        throw new Error(errorMessage);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the file name
      const fileName = record.isEmbryoReport 
        ? `embriyo-rapor-${record.id}.pdf` 
        : `medikal-kayit-${record.id}.pdf`;
      
      link.setAttribute('download', fileName);
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Click the link to start the download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      alert(error.message || 'PDF indirme sırasında bir hata oluştu');
    } finally {
      setDownloadingPdf(false);
    }
  };

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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Records</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Try Again
              </button>
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records Available Yet</h3>
              <p className="text-gray-600">Your medical records will appear here once they are added by your healthcare provider.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {records.map((record) => (
                <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full ${getBackgroundColor(record.type)} flex items-center justify-center`}>
                          {getRecordIcon(record.type)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{record.type}</h3>
                        <p className="text-sm text-gray-500">{record.description}</p>
                      </div>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <p className="text-sm font-medium text-gray-900">{formatDate(record.date)}</p>
                      <p className="text-sm text-gray-500">by {record.doctor}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    <a 
                      href={record.isEmbryoReport ? `/patient/embryo-report/${record.id}` : `/patient/record/${record.id}`} 
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors"
                    >
                      <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </a>
                    <button 
                      onClick={() => handleDownloadPDF(record)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF İndir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
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
