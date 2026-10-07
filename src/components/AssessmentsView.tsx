import React, { useState } from 'react';
import {
  ClipboardList,
  Flame,
  Wind,
  Sparkles,
  BatteryCharging,
  Moon,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ASSESSMENTS } from '../data/assessmentsAndQuizzes';
import { Assessment, AssessmentInterpretation } from '../types';

export const AssessmentsView: React.FC = () => {
  const { assessmentResults, submitAssessmentResult, setActiveTab } = useApp();

  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completedResult, setCompletedResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-indigo-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5 text-purple-500" />;
      case 'Moon': return <Moon className="w-5 h-5 text-cyan-500" />;
      default: return <ClipboardList className="w-5 h-5 text-pink-500" />;
    }
  };

  const handleStart = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setCompletedResult(null);
  };

  const handleSelectOption = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    if (!activeAssessment) return;

    if (currentQuestionIdx < activeAssessment.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Calculate final score
      setIsSubmitting(true);
      const totalScore = Object.values(answers).reduce((acc, v) => acc + v, 0);
      const maxPossibleScore = activeAssessment.questions.reduce((acc, q) => {
        const maxVal = Math.max(...q.options.map((o) => o.value));
        return acc + maxVal;
      }, 0);

      // Find matching interpretation
      let interpretation: AssessmentInterpretation = activeAssessment.interpretations[0];
      for (const interp of activeAssessment.interpretations) {
        if (totalScore >= interp.minScore && totalScore <= interp.maxScore) {
          interpretation = interp;
          break;
        }
      }

      try {
        const saved = await submitAssessmentResult({
          assessmentId: activeAssessment.id,
          assessmentTitle: activeAssessment.title,
          score: totalScore,
          maxScore: maxPossibleScore,
          category: interpretation.category,
          feedback: interpretation.feedback,
          recommendations: interpretation.recommendations,
        });

        setCompletedResult({
          ...saved,
          interpTitle: interpretation.title,
          recommendations: interpretation.recommendations,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const categoryColor = {
    Minimal: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
    Mild: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300',
    Moderate: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
    High: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">
              Structured Self-Assessments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Evidence-informed reflective questionnaires to help you evaluate stress, worry, burnout, and sleep.
          </p>
        </div>

        {activeAssessment && (
          <button
            onClick={() => setActiveAssessment(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Assessments</span>
          </button>
        )}
      </div>

      {/* Non-Diagnostic Clinical Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-stone-800/60 border border-teal-200/60 dark:border-stone-700 flex items-center gap-3 text-xs text-stone-700 dark:text-stone-300">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
        <p>
          <strong>Self-Awareness & Educational Notice:</strong> These questionnaires are self-reflection tools intended to cultivate mindful self-understanding. They do not constitute or replace a clinical psychological diagnosis.
        </p>
      </div>

      {/* Active Assessment Flow */}
      {activeAssessment ? (
        <div className="max-w-2xl mx-auto">
          {completedResult ? (
            /* Result Screen */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-pink-200/80 dark:border-stone-800 shadow-xl space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center mx-auto mb-2">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  {completedResult.assessmentTitle} Result
                </span>
                <h2 className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
                  {completedResult.interpTitle || `${completedResult.category} Level`}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: completedResult.category === 'High' ? '#FFF1F2' : completedResult.category === 'Moderate' ? '#FEF3C7' : '#ECFDF5',
                    color: completedResult.category === 'High' ? '#BE123C' : completedResult.category === 'Moderate' ? '#B45309' : '#047857',
                    borderColor: completedResult.category === 'High' ? '#FECDD3' : completedResult.category === 'Moderate' ? '#FDE68A' : '#A7F3D0',
                  }}
                >
                  <span>Score Category: {completedResult.category}</span>
                  <span>•</span>
                  <span>{completedResult.score} / {completedResult.maxScore}</span>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-stone-500 font-mono">
                  <span>Score Index</span>
                  <span>{completedResult.percentage}% of scale</span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 transition-all duration-700"
                    style={{ width: `${completedResult.percentage}%` }}
                  />
                </div>
              </div>

              {/* Feedback description */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {completedResult.feedback}
              </div>

              {/* Supportive Suggestions */}
              {completedResult.recommendations && completedResult.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Gentle Recommended Next Steps:
                  </h3>
                  <div className="space-y-2">
                    {completedResult.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-pink-50/50 dark:bg-stone-800/40 border border-pink-100/60 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300">
                        <CheckCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => handleStart(activeAssessment)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Questionnaire</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('echo')}
                    className="px-4 py-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 hover:bg-pink-100 text-xs font-semibold transition-colors"
                  >
                    Discuss with Echo
                  </button>
                  <button
                    onClick={() => setActiveAssessment(null)}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold transition-colors"
                  >
                    Back to Assessments
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Question Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-md space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Question {currentQuestionIdx + 1} of {activeAssessment.questions.length}</span>
                  <span>{Math.round(((currentQuestionIdx) / activeAssessment.questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink-400 transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / activeAssessment.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h3 className="text-lg sm:text-xl font-bold font-heading text-stone-800 dark:text-stone-100 leading-snug">
                  {activeAssessment.questions[currentQuestionIdx].text}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {activeAssessment.questions[currentQuestionIdx].options.map((opt, i) => {
                  const qId = activeAssessment.questions[currentQuestionIdx].id;
                  const isSelected = answers[qId] === opt.value;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(qId, opt.value)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-400 text-pink-900 dark:text-pink-200 shadow-xs'
                          : 'bg-stone-50/50 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100/70 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-pink-500 bg-pink-500' : 'border-stone-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 disabled:opacity-30"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={answers[activeAssessment.questions[currentQuestionIdx].id] === undefined || isSubmitting}
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-pink-200/50 dark:shadow-none transition-all active:scale-95 disabled:opacity-40"
                >
                  <span>{currentQuestionIdx === activeAssessment.questions.length - 1 ? (isSubmitting ? 'Calculating...' : 'Finish & Reveal Results') : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Assessment Catalog Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSESSMENTS.map((assessment) => {
            const pastResult = assessmentResults.find((r) => r.assessmentId === assessment.id);

            return (
              <div
                key={assessment.id}
                className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 group-hover:scale-105 transition-transform">
                      {getIcon(assessment.iconName)}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {assessment.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
                    {assessment.title}
                  </h3>
                  <p className="text-xs text-pink-600 dark:text-pink-400 font-medium mb-2">
                    {assessment.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {assessment.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{assessment.timeEstimate}</span>
                    </span>
                    <span>{assessment.questions.length} questions</span>
                  </div>

                  {pastResult && (
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-stone-400">Last Score:</span>
                      <span className="font-semibold text-pink-600 dark:text-pink-400">
                        {pastResult.category} ({pastResult.score}/{pastResult.maxScore})
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleStart(assessment)}
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-pink-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 hover:text-pink-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{pastResult ? 'Retake Self-Check' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Historical Completed Assessments Table */}
      {assessmentResults.length > 0 && !activeAssessment && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
            Past Assessment Results History
          </h2>
          <div className="space-y-3">
            {assessmentResults.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {res.assessmentTitle}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 max-w-xl">
                    {res.feedback}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="px-2.5 py-1 rounded-full font-semibold border text-[11px]"
                    style={{
                      backgroundColor: res.category === 'High' ? '#FFF1F2' : res.category === 'Moderate' ? '#FEF3C7' : '#ECFDF5',
                      color: res.category === 'High' ? '#BE123C' : res.category === 'Moderate' ? '#B45309' : '#047857',
                      borderColor: res.category === 'High' ? '#FECDD3' : res.category === 'Moderate' ? '#FDE68A' : '#A7F3D0',
                    }}
                  >
                    {res.category} ({res.score}/{res.maxScore})
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {new Date(res.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
