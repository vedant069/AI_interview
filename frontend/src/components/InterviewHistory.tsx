import React from 'react';
import { ChevronDown, ChevronUp, Calendar, Briefcase, Target } from 'lucide-react';

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
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    if (score >= 60) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Interview History</h2>
        <p className="text-gray-600 mt-2">Track your progress and growth across interviews</p>
      </div>

      <div className="space-y-4">
        {feedbackHistory.map((interview, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 rounded-xl"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600 min-w-[140px]">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(interview.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{interview.role}</span>
                </div>

                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
                  {interview.domain}
                </span>

                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getScoreBadgeStyle(interview.feedback.overallScore)}`}>
                  {interview.feedback.overallScore}%
                </span>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedIndex === index && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Key Strengths
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {interview.feedback.strength}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Areas for Growth
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {interview.feedback.areasOfImprovement}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-amber-600" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Action Items
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {interview.feedback.weakness}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Discussion Points
                  </h4>
                  <div className="space-y-4">
                    {interview.questions.map((q: any, qIndex: number) => (
                      <div 
                        key={qIndex}
                        className="bg-gray-50 rounded-lg p-5"
                      >
                        <p className="font-medium text-gray-900 mb-3">
                          {q.question}
                        </p>
                        <p className="text-gray-600 bg-white rounded-lg p-4 text-sm leading-relaxed">
                          {interview.answers[qIndex]?.answer || 'No response provided'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;