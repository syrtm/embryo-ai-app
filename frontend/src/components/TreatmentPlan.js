import React from 'react';

function TreatmentPlan() {
  // Mock data
  const treatmentSteps = [
    {
      id: 1,
      title: 'Initial Consultation',
      date: '2025-04-15',
      status: 'completed',
      description: 'Initial evaluation and treatment planning discussion with Dr. Smith.'
    },
    {
      id: 2,
      title: 'Hormone Therapy',
      date: '2025-04-20',
      status: 'completed',
      description: 'Start of controlled ovarian stimulation with daily hormone injections.'
    },
    {
      id: 3,
      title: 'Egg Retrieval',
      date: '2025-04-28',
      status: 'completed',
      description: 'Successful retrieval of 12 eggs under light anesthesia.'
    },
    {
      id: 4,
      title: 'Embryo Development',
      date: '2025-05-03',
      status: 'in-progress',
      description: 'Monitoring embryo development and AI-based grading.'
    },
    {
      id: 5,
      title: 'Embryo Transfer',
      date: '2025-05-05',
      status: 'upcoming',
      description: 'Transfer of selected embryos.'
    },
    {
      id: 6,
      title: 'Pregnancy Test',
      date: '2025-05-19',
      status: 'upcoming',
      description: 'Blood test to confirm pregnancy.'
    }
  ];

  const medications = [
    {
      name: 'Gonal-F',
      dosage: '225 IU',
      frequency: 'Daily',
      startDate: '2025-04-20',
      endDate: '2025-04-27',
      instructions: 'Inject subcutaneously in the evening'
    },
    {
      name: 'Menopur',
      dosage: '75 IU',
      frequency: 'Daily',
      startDate: '2025-04-20',
      endDate: '2025-04-27',
      instructions: 'Inject subcutaneously in the evening'
    },
    {
      name: 'Cetrotide',
      dosage: '0.25 mg',
      frequency: 'Daily',
      startDate: '2025-04-23',
      endDate: '2025-04-27',
      instructions: 'Inject subcutaneously in the morning'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Treatment Plan</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your IVF journey and upcoming steps
          </p>
        </div>

        {/* Treatment Timeline */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Treatment Timeline</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {treatmentSteps.map((step, stepIdx) => (
                  <li key={step.id}>
                    <div className="relative pb-8">
                      {stepIdx !== treatmentSteps.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              step.status === 'completed'
                                ? 'bg-green-500'
                                : step.status === 'in-progress'
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            {step.status === 'completed' ? (
                              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : step.status === 'in-progress' ? (
                              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-gray-600" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{step.title}</p>
                            <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={step.date}>{step.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Current Medications</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {medications.map((medication) => (
                <div
                  key={medication.name}
                  className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                    <dl className="mt-2 divide-y divide-gray-200">
                      <div className="py-3 flex justify-between text-sm">
                        <dt className="text-gray-500">Dosage:</dt>
                        <dd className="text-gray-900">{medication.dosage}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm">
                        <dt className="text-gray-500">Frequency:</dt>
                        <dd className="text-gray-900">{medication.frequency}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm">
                        <dt className="text-gray-500">Start Date:</dt>
                        <dd className="text-gray-900">{medication.startDate}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm">
                        <dt className="text-gray-500">End Date:</dt>
                        <dd className="text-gray-900">{medication.endDate}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">{medication.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreatmentPlan;
