import React from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface HistoryProps {
  feedbackHistory: any[];
}

export const InterviewHistory: React.FC<HistoryProps> = ({ feedbackHistory }) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 ring-emerald-600/20';
    if (score >= 60) return 'bg-amber-100 text-amber-700 ring-amber-600/20';
    return 'bg-red-100 text-red-700 ring-red-600/20';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Your Interview Journey
      </h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

        <div className="space-y-8">
          {feedbackHistory.map((interview, index) => (
            <div key={index} className="relative pl-16">
              {/* Timeline dot */}
              <div className="absolute left-7 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-500" />

              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatDate(interview.created_at)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {interview.role}
                    </h3>
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700">
                      {interview.domain}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ring-1 ring-inset ${getScoreBadgeStyle(interview.feedback.overallScore)}`}>
                      Score: {interview.feedback.overallScore}%
                    </span>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {expandedIndex === index && (
                  <div className="px-6 pb-6 space-y-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-3">
                          Strengths
                        </h4>
                        <p className="text-green-700 leading-relaxed">
                          {interview.feedback.strength}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3">
                          Growth Areas
                        </h4>
                        <p className="text-blue-700 leading-relaxed">
                          {interview.feedback.areasOfImprovement}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
                          Focus Points
                        </h4>
                        <p className="text-amber-700 leading-relaxed">
                          {interview.feedback.weakness}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Discussion Details
                      </h4>
                      <div className="space-y-4">
                        {interview.questions.map((q: any, qIndex: number) => (
                          <div 
                            key={qIndex}
                            className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm"
                          >
                            <p className="font-medium text-gray-900 mb-3">
                              {q.question}
                            </p>
                            <p className="text-gray-600 bg-white rounded-lg p-4 leading-relaxed">
                              {interview.answers[qIndex]?.answer || 'No response provided'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;