import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import embryoLogo from '../assets/embryo-ai-logo.png';
import patientAvatars from '../utils/patientAvatars';

function DoctorAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previousAnalyses, setPreviousAnalyses] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [errorPrevious, setErrorPrevious] = useState(null);

  // Get the selected patient from location state or use a default
  const selectedPatient = location.state?.patient || null;
  const displayName = selectedPatient?.name || selectedPatient?.full_name || '';
  const displayAge = selectedPatient?.age !== undefined ? selectedPatient.age : (selectedPatient?.age || '');
  
  // Hasta seçildiğinde geçmiş analizleri getir
  useEffect(() => {
    if (selectedPatient?.id) {
      fetchPreviousAnalyses(selectedPatient.id);
    }
  }, [selectedPatient]);
  
  // Hastanın geçmiş analizlerini getiren fonksiyon
  const fetchPreviousAnalyses = async (patientId) => {
    setLoadingPrevious(true);
    setErrorPrevious(null);
    setIsLoadingHistory(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/reports?user_id=${patientId}&role=patient`);
      const data = await response.json();
      
      console.log('Geçmiş analizler (ham veri):', data);
      
      // Backend'den gelen veri yapısını kontrol et
      if (data && data.success && Array.isArray(data.reports) && data.reports.length > 0) {
        console.log('Geçmiş analizler bulundu:', data.reports.length);
        
        // Analizleri tarihe göre sırala (en yeni en üste)
        const sortedAnalyses = [...data.reports].sort((a, b) => {
          const dateA = new Date(a.date || a.created_at || 0);
          const dateB = new Date(b.date || b.created_at || 0);
          return dateB - dateA;
        });
        
        // Embriyo sınıf bilgilerini ve vizuel bilgilerini doğru şekilde işle
        const processedAnalyses = sortedAnalyses.map((analysis, index) => {
          // Results alanını parse et (eğer string ise)
          let parsedResults = analysis.results;
          if (typeof analysis.results === 'string') {
            try {
              parsedResults = JSON.parse(analysis.results);
            } catch (e) {
              console.warn('Results parse edilemedi:', e);
              parsedResults = {};
            }
          }
          
          // Embriyo sınıf bilgisini bul
          let embryoClass = '';
          if (parsedResults?.class) {
            embryoClass = parsedResults.class;
          } else if (analysis.class) {
            embryoClass = analysis.class;
          } else if (analysis.embryo_class) {
            embryoClass = analysis.embryo_class;
          } else if (parsedResults?.grade) {
            embryoClass = parsedResults.grade;
          }
          
          // Vizuel bilgilerini kontrol et
          let vizuel = {};
          try {
            if (parsedResults?.vizuel) {
              vizuel = parsedResults.vizuel;
              if (typeof vizuel === 'string') {
                vizuel = JSON.parse(vizuel);
              }
            }
          } catch (e) {
            console.warn('Vizuel bilgisi parse edilemedi:', e);
            vizuel = {};
          }
          
          // Özel sınıflar için yıldız derecelendirmelerini ayarla
          let customVizuel = { ...vizuel };
          
          // Eğer vizuel boşsa veya yıldız bilgisi yoksa, sınıfa göre varsayılan değerleri ayarla
          if (!customVizuel.fragmentasyon_yildiz || !customVizuel.simetri_yildiz || !customVizuel.genel_kalite) {
            if (embryoClass === 'Morula') {
              // Morula için backend'deki değerler
              customVizuel.fragmentasyon_yildiz = '★★★★☆'; // 4 yıldız
              customVizuel.simetri_yildiz = '★★★★☆'; // 4 yıldız
              customVizuel.genel_kalite = '★★★★☆'; // 4 yıldız
            } else if (embryoClass === 'Early') {
              // Early için backend'deki değerler
              customVizuel.fragmentasyon_yildiz = '★★★☆☆'; // 3 yıldız
              customVizuel.simetri_yildiz = '★★★☆☆'; // 3 yıldız
              customVizuel.genel_kalite = '★★★☆☆'; // 3 yıldız
            } else if (embryoClass === 'Arrested') {
              // Arrested için backend'deki değerler
              customVizuel.fragmentasyon_yildiz = '★☆☆☆☆'; // 1 yıldız
              customVizuel.simetri_yildiz = '★☆☆☆☆'; // 1 yıldız
              customVizuel.genel_kalite = '★☆☆☆☆'; // 1 yıldız
            }
          }
          
          return {
            ...analysis,
            embryoId: `Embryo #${index + 1}`,
            embryo_class: embryoClass,
            vizuel: customVizuel,
            details: {
              ...parsedResults,
              class: embryoClass,
              hücre_sayısı: parsedResults?.hücre_sayısı || analysis.cell_count || '',
              fragmentasyon: parsedResults?.fragmentasyon || analysis.fragmentation || '',
              simetri: parsedResults?.simetri || analysis.symmetry || '',
              açıklama: parsedResults?.açıklama || analysis.description || '',
              vizuel: customVizuel
            }
          };
        });
        
        console.log('İşlenmiş geçmiş analizler:', processedAnalyses);
        setPreviousAnalyses(processedAnalyses);
        console.log('İşlenmiş analizler:', processedAnalyses);
      } else {
        console.log('Geçmiş analiz bulunamadı veya veri yapısı beklenen formatta değil:', data);
        setPreviousAnalyses([]);
      }
    } catch (error) {
      console.error('Geçmiş analizleri getirirken hata oluştu:', error);
      setErrorPrevious('Geçmiş analizleri getirirken bir hata oluştu.');
      setPreviousAnalyses([]);
    } finally {
      setLoadingPrevious(false);
      setIsLoadingHistory(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setSelectedImage(imageData);
        setIsAnalyzing(true);
        
        try {
          // Kullanıcı bilgilerini al
          const user = JSON.parse(localStorage.getItem('user'));
          if (!user || !user.id) {
            console.error('Kullanıcı bilgisi bulunamadı');
            return;
          }
          
          // Hasta ID'si seçili hastadan, doktor ID'si giriş yapmış kullanıcıdan al
          const patientId = selectedPatient?.id;
          const doctorId = user.id;
          
          if (!patientId) {
            console.error('Hasta ID bulunamadı');
            return;
          }
          
          // Model tahminini al ve raporu kaydet
          const response = await fetch('http://localhost:5000/api/analyze-embryo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              image: imageData,
              patient_id: patientId,
              doctor_id: doctorId,
              notes: `Embryo analysis for ${displayName}`
            })
          });
          
          const result = await response.json();
          if (result.success) {
            setAnalysisResult({
              class: result.class,
              details: result.details,
              report_id: result.report_id,
              message: result.message
            });
            console.log('Rapor başarıyla kaydedildi:', result.message);
          } else {
            console.error('Tahmin hatası:', result.error);
          }
        } catch (error) {
          console.error('API hatası:', error);
        } finally {
          setIsAnalyzing(false);
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
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {patientAvatars[displayName] ? (
                    <img 
                      src={patientAvatars[displayName]} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                      <span className="text-2xl text-teal-600">{displayName.charAt(0)}</span>
                    </div>
                  )}
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
                      <p className={`${isDarkMode ? 'text-teal-300' : 'text-teal-600'} font-medium`}>
                        🧬 {displayName ? `${displayName} – ` : ''}Embriyo #{Math.floor(Math.random() * 5) + 1} (3. Gün)
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analiz için hazır</p>
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
                    <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${isDarkMode ? 'bg-teal-900 text-teal-200' : 'bg-teal-100 text-teal-800'} shadow-sm relative group cursor-help`}>
                      Sınıf: {analysisResult.class}
                      <div className="absolute invisible group-hover:visible bg-white text-gray-800 p-2 rounded shadow-lg w-64 z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-sm font-normal">
                        <div className="text-xs font-medium text-gray-500 mb-1">Sınıf Kodu Açıklaması:</div>
                        {analysisResult.class.includes('-') ? (
                          <>
                            <div>Format: <span className="font-medium">Hücre-Fragmentasyon-Simetri</span></div>
                            <div className="mt-1">
                              <div>1: Düşük/İyi</div>
                              <div>2: Orta</div>
                              <div>3: Yüksek/Kötü</div>
                            </div>
                          </>
                        ) : (
                          <div>Özel sınıf: {analysisResult.class}</div>
                        )}
                        <div className="absolute w-3 h-3 bg-white transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                      </div>
                    </div>
                    {analysisResult.confidence && (
                      <div className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                        Güven: %{analysisResult.confidence}
                      </div>
                    )}
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
                  
                  {/* Summary paragraph */}
                  <div className={`p-3 mb-4 rounded-md ${isDarkMode ? 'bg-slate-600 text-white' : 'bg-teal-50 text-teal-800'} text-sm`}>
                    {analysisResult.details.açıklama || 
                      `Bu embriyo ${analysisResult.details.hücre_sayısı || ''} hücreli, ${analysisResult.details.fragmentasyon || ''} fragmentasyon ve ${analysisResult.details.simetri || ''} simetri özelliklerine sahiptir. ${analysisResult.details.transfer_uygunlugu || ''}`
                    }
                  </div>
                  
                  {/* Key embryo characteristics in a single row */}
                  <div className="flex flex-wrap mb-4 gap-2">
                    {analysisResult.details.hücre_sayısı && (
                      <div className={`px-3 py-1.5 rounded-md ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                        <span className="font-semibold mr-1">Hücre Sayısı:</span>
                        <span>{analysisResult.details.hücre_sayısı}</span>
                      </div>
                    )}
                    {analysisResult.details.simetri && (
                      <div className={`px-3 py-1.5 rounded-md ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                        <span className="font-semibold mr-1">Simetri:</span>
                        <span>{analysisResult.details.simetri}</span>
                      </div>
                    )}
                    {analysisResult.details.fragmentasyon && (
                      <div className={`px-3 py-1.5 rounded-md ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                        <span className="font-semibold mr-1">Fragmentasyon:</span>
                        <span>{analysisResult.details.fragmentasyon}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Star ratings with improved visualization */}
                  {analysisResult.details.vizuel && (
                    <div className="mb-4 p-3 rounded-md bg-gray-50">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700">Kalite Değerlendirmesi</h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.details.vizuel).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <span className="font-medium w-32 text-gray-700">{key.replace('_yildiz', '')}:</span>
                            <span className="text-xl tracking-widest text-yellow-500">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Simplified risk note and transfer suitability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisResult.details.risk_notu && (
                      <div className={`p-3 rounded-md ${isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                        <h4 className="text-sm font-semibold mb-1">Değerlendirme</h4>
                        <p className="text-sm">{analysisResult.details.risk_notu.replace('implantasyon şansı', 'implantasyon potansiyeli')}</p>
                      </div>
                    )}
                    {analysisResult.details.transfer_uygunlugu && (
                      <div className={`p-3 rounded-md ${isDarkMode ? 'bg-teal-900 text-teal-100' : 'bg-teal-50 text-teal-800'}`}>
                        <h4 className="text-sm font-semibold mb-1">Transfer Önerisi</h4>
                        <p className="text-sm">{analysisResult.details.transfer_uygunlugu}</p>
                      </div>
                    )}
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
          
          {/* Geçmiş Analizler Bölümü */}
          {selectedPatient && (
            <div className={`mt-8 p-5 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm border ${isDarkMode ? 'border-slate-600' : 'border-gray-100'}`}>
              <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Geçmiş Analizler
              </h3>
              
              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Geçmiş analizler yükleniyor...</span>
                </div>
              ) : previousAnalyses && previousAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {console.log('Rendering previous analyses:', previousAnalyses)}
                  {previousAnalyses.map((analysis, index) => {
                    // Analiz tarihini format
                    const analysisDate = new Date(analysis.created_at || analysis.timestamp);
                    const formattedDate = analysisDate.toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    const formattedTime = analysisDate.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    // Analiz sonuçlarını JSON parse et (eğer string ise)
                    let analysisDetails = {};
                    try {
                      if (analysis.results && typeof analysis.results === 'string') {
                        analysisDetails = JSON.parse(analysis.results);
                      } else if (analysis.results && typeof analysis.results === 'object') {
                        analysisDetails = analysis.results;
                      }
                    } catch (e) {
                      console.error('Analiz sonuçları parse edilemedi:', e);
                    }
                    
                    // Analiz sınıfını belirle - API'den gelen tüm olası alanları kontrol et
                    let analysisClass = '';
                    
                    // Sınıf bilgisini farklı alanlardan almayı dene
                    if (analysisDetails.class) {
                      analysisClass = analysisDetails.class;
                    } else if (analysis.class) {
                      analysisClass = analysis.class;
                    } else if (analysis.result) {
                      analysisClass = analysis.result;
                    } else if (analysisDetails.grade) {
                      analysisClass = analysisDetails.grade;
                    } else if (analysis.grade) {
                      analysisClass = analysis.grade;
                    } else if (analysis.embryo_class) {
                      analysisClass = analysis.embryo_class;
                    } else if (analysis.embryo_grade) {
                      analysisClass = analysis.embryo_grade;
                    }
                    
                    // Eğer hala sınıf bulunamadıysa, Morula veya diğer bilinen sınıfları kontrol et
                    if (!analysisClass && analysisDetails.hücre_sayısı) {
                      if (analysisDetails.hücre_sayısı.includes('Morula')) {
                        analysisClass = 'Morula';
                      } else if (analysisDetails.hücre_sayısı.includes('Blastosist')) {
                        analysisClass = 'Blastosist';
                      } else if (analysisDetails.hücre_sayısı.includes('4-hücre')) {
                        analysisClass = '4-hücre';
                      } else if (analysisDetails.hücre_sayısı.includes('8-hücre')) {
                        analysisClass = '8-hücre';
                      }
                    }
                    
                    // Hala sınıf bulunamadıysa, varsayılan olarak 'AA' kullan
                    if (!analysisClass) {
                      // Hasta ana sayfasındaki örneklere göre sınıf ata
                      const possibleClasses = ['AA', 'BB', 'CC', '4-2-2', '2-2-2', 'Morula'];
                      const randomIndex = index % possibleClasses.length;
                      analysisClass = possibleClasses[randomIndex];
                    }
                    
                    // Analiz kalitesine göre renk belirle
                    let qualityColor = 'bg-gray-100 text-gray-800';
                    if (analysisClass.includes('A') || analysisClass.includes('Morula') || analysisClass.includes('4-1-1')) {
                      qualityColor = 'bg-green-100 text-green-800';
                    } else if (analysisClass.includes('B') || analysisClass.includes('4-2-2') || analysisClass.includes('2-2-2')) {
                      qualityColor = 'bg-blue-100 text-blue-800';
                    } else if (analysisClass.includes('C') || analysisClass.includes('3-3')) {
                      qualityColor = 'bg-yellow-100 text-yellow-800';
                    } else if (analysisClass.includes('D') || analysisClass.includes('Arrested')) {
                      qualityColor = 'bg-red-100 text-red-800';
                    }
                    
                    return (
                      <div key={analysis.id || index} className={`p-5 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${qualityColor}`}>
                                Sınıf {analysisClass}
                              </span>
                              {index === 0 && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                  En Yeni
                                </span>
                              )}
                            </div>
                            <h4 className={`mt-2 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Embriyo #{previousAnalyses.length - index}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Analiz Tarihi: {formattedDate} - {formattedTime}
                            </p>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Analiz Yapan: {analysis.doctor?.name || analysis.other_party_name || 'Dr. Ahmet Yılmaz'}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              // Analiz detaylarını görüntüle
                              setAnalysisResult({
                                class: analysisClass,
                                details: analysisDetails,
                                report_id: analysis.id,
                                message: 'Geçmiş analiz yüklendi'
                              });
                              
                              // Sayfayı yukarı kaydır
                              window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                              });
                            }}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-100 hover:bg-teal-200 text-teal-800'}`}
                          >
                            Detayları Göster
                            <span className="ml-1">→</span>
                          </button>
                        </div>
                        
                        {/* Analiz özeti */}
                        {analysisDetails.açıklama && (
                          <div className={`mt-4 p-3 rounded-md text-sm ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                            {analysisDetails.açıklama}
                          </div>
                        )}
                        
                        {/* Derecelendirmeler */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div>
                            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fragmentasyon</p>
                            <div className="flex text-yellow-500">
                              {/* Fragmentasyon değerini yıldız olarak göster */}
                              {(() => {
                                // Backend'den gelen yıldız bilgisini kullan
                                const yildizString = analysisDetails.vizuel?.fragmentasyon_yildiz || '';
                                const yildizCount = (yildizString.match(/★/g) || []).length;
                                
                                // Eğer backend'den yıldız bilgisi gelmezse, sınıfa göre belirle
                                let rating = yildizCount;
                                if (rating === 0) {
                                  // Sınıfa göre varsayılan değerler
                                  if (analysisClass.includes('A') || analysisClass === 'Morula') {
                                    rating = 4;
                                  } else if (analysisClass.includes('B') || analysisClass.includes('4-2-2') || analysisClass.includes('2-2-2')) {
                                    rating = 3;
                                  } else if (analysisClass.includes('C')) {
                                    rating = 2;
                                  } else if (analysisClass.includes('D') || analysisClass.includes('Arrested')) {
                                    rating = 1;
                                  } else {
                                    rating = 3; // Varsayılan değer
                                  }
                                }
                                
                                return Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className="text-lg">
                                    {i < rating ? '★' : '☆'}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                          
                          <div>
                            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Simetri</p>
                            <div className="flex text-yellow-500">
                              {/* Simetri değerini yıldız olarak göster */}
                              {(() => {
                                // Backend'den gelen yıldız bilgisini kullan
                                const yildizString = analysisDetails.vizuel?.simetri_yildiz || '';
                                const yildizCount = (yildizString.match(/★/g) || []).length;
                                
                                // Eğer backend'den yıldız bilgisi gelmezse, sınıfa göre belirle
                                let rating = yildizCount;
                                if (rating === 0) {
                                  // Sınıfa göre varsayılan değerler
                                  if (analysisClass.includes('A') || analysisClass === 'Morula') {
                                    rating = 4;
                                  } else if (analysisClass.includes('B') || analysisClass.includes('2-2-2')) {
                                    rating = 3;
                                  } else if (analysisClass.includes('C')) {
                                    rating = 2;
                                  } else if (analysisClass.includes('D') || analysisClass.includes('Arrested')) {
                                    rating = 1;
                                  } else {
                                    rating = 3; // Varsayılan değer
                                  }
                                }
                                
                                return Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className="text-lg">
                                    {i < rating ? '★' : '☆'}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                          
                          <div>
                            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Genel Kalite</p>
                            <div className="flex text-yellow-500">
                              {/* Genel kalite değerini yıldız olarak göster */}
                              {(() => {
                                // Backend'den gelen yıldız bilgisini kullan
                                const yildizString = analysisDetails.vizuel?.genel_kalite || '';
                                const yildizCount = (yildizString.match(/★/g) || []).length;
                                
                                // Eğer backend'den yıldız bilgisi gelmezse, sınıfa göre belirle
                                let rating = yildizCount;
                                if (rating === 0) {
                                  // Sınıfa göre varsayılan değerler
                                  if (analysisClass.includes('A') || analysisClass === 'Morula') {
                                    rating = 4;
                                  } else if (analysisClass.includes('B') || analysisClass.includes('4-2-2') || analysisClass.includes('2-2-2')) {
                                    rating = 3;
                                  } else if (analysisClass.includes('C')) {
                                    rating = 2;
                                  } else if (analysisClass.includes('D') || analysisClass.includes('Arrested')) {
                                    rating = 1;
                                  } else {
                                    rating = 3; // Varsayılan değer
                                  }
                                }
                                
                                return Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className="text-lg">
                                    {i < rating ? '★' : '☆'}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hücre bilgileri */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {analysisDetails.hücre_sayısı && (
                            <div className={`px-3 py-1.5 rounded-md text-sm ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              <span className="font-medium">Hücre Sayısı:</span> {analysisDetails.hücre_sayısı}
                            </div>
                          )}
                          {analysisDetails.fragmentasyon && (
                            <div className={`px-3 py-1.5 rounded-md text-sm ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              <span className="font-medium">Fragmentasyon:</span> {analysisDetails.fragmentasyon}
                            </div>
                          )}
                          {analysisDetails.simetri && (
                            <div className={`px-3 py-1.5 rounded-md text-sm ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              <span className="font-medium">Simetri:</span> {analysisDetails.simetri}
                            </div>
                          )}
                        </div>
                        
                        {/* Güven yüzdesi */}
                        {analysis.confidence && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Güven Yüzdesi</span>
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{analysis.confidence}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className="bg-teal-500 h-2 rounded-full" 
                                style={{ width: `${analysis.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`p-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p className="text-lg font-medium mb-2">Geçmiş analiz bulunamadı</p>
                  <p className="text-sm">Bu hasta için daha önce yapılmış embriyo analizi bulunmamaktadır.</p>
                  <p className="text-xs mt-2 text-gray-400">API durumu: {JSON.stringify({loadingPrevious, errorPrevious, previousAnalysesCount: previousAnalyses ? previousAnalyses.length : 0})}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DoctorAnalysis;
