import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setPredictions(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-1">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xl font-medium">AI IVF Care</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/upload" className="text-gray-600 hover:text-gray-900">Upload</Link>
              <Link to="/results" className="text-gray-600 hover:text-gray-900">Results</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upload Embryo Image</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              {preview && (
                <div className="mb-4">
                  <img src={preview} alt="Preview" className="max-w-md rounded-lg shadow-sm" />
                </div>
              )}
              
              <div className="flex items-center justify-center w-full max-w-md">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border-2 border-dashed border-gray-300 cursor-pointer hover:border-red-500">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-2 text-base text-gray-600">Select embryo image</span>
                  <input type="file" className="hidden" onChange={handleChange} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || loading}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  !file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {predictions && (
          <>
            {/* Embryo Quality Grades */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Embryo Quality Grades</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {predictions.embryos?.map((embryo, index) => (
                  <div key={index} className="bg-gray-200 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700">Embryo {index + 1}</h3>
                    <p className="text-gray-600">Grade: {embryo.grade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recommendations</h2>
              <p className="text-gray-600 leading-relaxed">
                Based on your embryos' quality, we recommend scheduling a consultation with your specialist to discuss the next steps in your IVF journey.
              </p>
            </div>

            {/* Important Information */}
            <div className="bg-white shadow rounded-lg p-6 mb-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Important Information</h2>
              <p className="text-gray-600 leading-relaxed">
                Understanding embryo grading can help you make informed decisions. It is crucial to consider factors beyond grades, including age and medical history, when planning your IVF treatment.
              </p>
            </div>

            {/* Resources and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Resources</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Contact Us</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Email: <a href="mailto:support@aivfcare.com" className="text-gray-900">support@aivfcare.com</a>
                  </p>
                  <p className="text-gray-600">
                    Phone: +1 234 567 890
                  </p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="text-red-600 hover:text-red-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-gray-900 font-medium mb-2">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-medium mb-2">Contact Us</h3>
              <p className="text-gray-600">Email: support@aivfcare.com</p>
              <p className="text-gray-600">Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-6">
            <a href="#" className="text-red-600 hover:text-red-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-red-600 hover:text-red-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-red-600 hover:text-red-500">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UploadForm;
