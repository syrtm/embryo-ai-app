import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';

function DoctorAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get the selected patient from location state or use a default
  const selectedPatient = location.state?.patient || null;
  const displayName = selectedPatient?.name || selectedPatient?.full_name || '';
  const displayAge = selectedPatient?.age !== undefined ? selectedPatient.age : (selectedPatient?.age || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setSelectedImage(imageData);
        
        try {
          // Model tahminini al
          const response = await fetch('http://localhost:5000/api/analyze-embryo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
          });
          
          const result = await response.json();
          if (result.success) {
            setAnalysisResult({
              class: result.class,
              details: result.details
            });
          } else {
            console.error('Tahmin hatası:', result.error);
          }
        } catch (error) {
          console.error('API hatası:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'}`}>
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        {/* Patient banner */}
        {selectedPatient ? (
          <div className={`mb-6 ${isDarkMode ? 'bg-teal-900' : 'bg-teal-50'} rounded-xl p-4 shadow-sm border ${isDarkMode ? 'border-teal-800' : 'border-teal-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl">{selectedPatient.avatar}</span>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{displayName}</h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className={`text-sm ${isDarkMode ? 'text-teal-300' : 'text-teal-700'}`}>Age: {displayAge}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Selected Patient
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                  View History
                </button>
                <button className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-teal-700 text-white hover:bg-teal-600' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
                  Patient Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-800'} border ${isDarkMode ? 'border-red-800' : 'border-red-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">No patient selected</span>
              <button 
                onClick={() => navigate('/doctor')}
                className="ml-2 underline text-sm hover:text-red-700 transition-colors"
              >
                Select a patient
              </button>
            </div>
          </div>
        )}

        {/* Analysis content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload section */}
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'} rounded-xl shadow-md p-6 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg>
              Upload Embryo Image
            </h2>

            {/* Step-by-step guidance */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <ol className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full ${selectedPatient ? 'bg-teal-100 text-teal-800' : 'bg-gray-200 text-gray-600'} flex items-center justify-center mr-2 font-medium text-sm`}>1</div>
                  <div>
                    <p className={`font-medium ${selectedPatient ? (isDarkMode ? 'text-teal-300' : 'text-teal-600') : ''}`}>Select a patient</p>
                    <p className="text-xs text-gray-500">{selectedPatient ? `Selected: ${selectedPatient.name}` : 'Return to dashboard to select a patient'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full ${selectedImage ? 'bg-teal-100 text-teal-800' : 'bg-gray-200 text-gray-600'} flex items-center justify-center mr-2 font-medium text-sm`}>2</div>
                  <div>
                    <p className={`font-medium ${selectedImage ? (isDarkMode ? 'text-teal-300' : 'text-teal-600') : ''}`}>Upload embryo image (JPG/PNG)</p>
                    <p className="text-xs text-gray-500">{selectedImage ? 'Image uploaded successfully' : 'High-quality image recommended'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full ${analysisResult ? 'bg-teal-100 text-teal-800' : 'bg-gray-200 text-gray-600'} flex items-center justify-center mr-2 font-medium text-sm`}>3</div>
                  <div>
                    <p className={`font-medium ${analysisResult ? (isDarkMode ? 'text-teal-300' : 'text-teal-600') : ''}`}>View analysis results</p>
                    <p className="text-xs text-gray-500">{analysisResult ? 'Analysis complete' : 'Results will appear in the right panel'}</p>
                  </div>
                </li>
              </ol>
            </div>

            {selectedPatient ? (
              <div className={`border-2 border-dashed ${isDarkMode ? 'border-slate-600' : 'border-gray-200'} rounded-xl p-6 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                {selectedImage ? (
                  <div className="space-y-4">
                    <img src={selectedImage} alt="Embryo" className="max-w-full h-auto mx-auto rounded-lg shadow-md" />
                    <div className="text-center">
                      <p className={`${isDarkMode ? 'text-teal-300' : 'text-teal-600'} font-medium`}>Image uploaded successfully</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ready for analysis</p>
                    </div>
                    <div className="flex justify-center mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        id="embryo-upload-replace"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="embryo-upload-replace"
                        className={`cursor-pointer inline-flex items-center px-4 py-2 ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-200 hover:bg-gray-300'} rounded-md transition-all duration-150`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                        Replace Image
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-600'} font-medium`}>
                      Please select a high-quality embryo image for analysis
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                      Supported formats: JPG, PNG, TIFF (max 10MB)
                    </p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      id="embryo-upload"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="embryo-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-md hover:from-teal-700 hover:to-teal-600 shadow-md transition-all duration-150"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Embryo Image
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className={`border-2 border-dashed ${isDarkMode ? 'border-slate-600' : 'border-gray-200'} rounded-xl p-6 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-600'} font-medium`}>
                    Please select a patient first
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                    You need to select a patient before uploading an embryo image for analysis
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*"
                    id="embryo-upload-disabled"
                    className="hidden"
                    disabled
                  />
                  <label
                    htmlFor="embryo-upload-disabled"
                    className="cursor-not-allowed inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Embryo Image
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Results section */}
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'} rounded-xl shadow-md p-6 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Analysis Results
            </h2>

            {analysisResult ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${isDarkMode ? 'bg-teal-900 text-teal-200' : 'bg-teal-100 text-teal-800'} shadow-sm`}>
                      Sınıf: {analysisResult.class}
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm border ${isDarkMode ? 'border-slate-600' : 'border-gray-100'}`}> 
                  <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Detaylı Değerlendirme
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysisResult.details).map(([key, value]) => (
                      <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-md">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{key}</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-64 ${isDarkMode ? 'bg-slate-700' : 'bg-white'} rounded-xl p-6 border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'} shadow-sm`}>
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Henüz analiz sonucu yok</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mt-2`}>
                  {selectedImage 
                    ? "Resim yüklendi, analiz sonucu bekleniyor."
                    : "Lütfen önce bir embriyo resmi yükleyin"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DoctorAnalysis;
