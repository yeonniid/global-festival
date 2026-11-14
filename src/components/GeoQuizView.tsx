import React, { useState } from 'react';
import { Award, CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { GEO_QUIZ_QUESTIONS } from '../data/festivals';
import { GeoFestival } from '../types/festival';
import { FestivalImage } from './FestivalImage';

interface GeoQuizViewProps {
  festivals: GeoFestival[];
  onSelectFestival: (festival: GeoFestival, initialTab?: 'analysis' | 'climate') => void;
}

export const GeoQuizView: React.FC<GeoQuizViewProps> = ({ festivals, onSelectFestival }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = GEO_QUIZ_QUESTIONS[currentIndex];
  const targetFestival = festivals.find((f) => f.id === currentQuestion.festivalId);
  const chosenIndex = selectedAnswers[currentQuestion.id];
  const hasAnswered = chosenIndex !== undefined;

  const totalQuestions = GEO_QUIZ_QUESTIONS.length;
  const correctCount = GEO_QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    return (
      <section className="max-w-3xl mx-auto border border-stone-200 rounded-2xl bg-white p-8 text-center space-y-6">
        <Award className="w-12 h-12 text-orange-700 mx-auto" strokeWidth={1.5} />
        <div>
          <p className="text-xs text-stone-500 font-mono-num">지리 요인 탐구 활동 완료</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
            총 {totalQuestions}문항 중 {correctCount}문항 정답 ({scorePct}%)
          </h2>
          <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
            자연환경(위치·기후·특산물)과 인문환경(종교·전통문화·예술)이 세계 각국의 축제로
            발전한 지리적 원리를 확인했습니다.
          </p>
        </div>

        <div className="text-left border border-stone-200 rounded-xl divide-y divide-stone-100">
          {GEO_QUIZ_QUESTIONS.map((q, idx) => {
            const isCorrect = selectedAnswers[q.id] === q.correctIndex;
            const fest = festivals.find((f) => f.id === q.festivalId);
            return (
              <div key={q.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-stone-500">
                    0{idx + 1} · {fest?.title}
                  </p>
                  <p className="text-sm font-medium text-stone-900 truncate mt-0.5">
                    {q.prompt}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium shrink-0 inline-flex items-center gap-1 ${
                    isCorrect ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      정답
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      오답
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          다시 탐구하기
        </button>
      </section>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-700" />
            <span>세계 축제의 지리적 형성 요인 탐구 퀴즈</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            현장 사진을 보고 각 축제가 어떤 자연환경 또는 인문환경 배경에서 비롯되었는지 추론해보세요.
          </p>
        </div>

        <span className="text-sm font-mono-num font-semibold text-stone-700">
          문제 {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-700 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border border-stone-200 rounded-2xl bg-white overflow-hidden">
        {/* Left: Realistic Festival Photo Clue */}
        {targetFestival && (
          <div className="lg:col-span-5 bg-stone-50 border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col justify-between">
            <div>
              <FestivalImage
                src={targetFestival.imageUrl}
                alt={targetFestival.imageAlt}
                aspectClassName="aspect-[4/3]"
              />
              <div className="p-5 space-y-2">
                <p className="text-xs text-stone-500">
                  {targetFestival.country} {targetFestival.city} · {targetFestival.seasonTiming}
                </p>
                <h3 className="text-base font-semibold text-stone-900">
                  {targetFestival.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {targetFestival.photoCaption}
                </p>
              </div>
            </div>

            {hasAnswered && (
              <div className="px-5 pb-5">
                <button
                  type="button"
                  onClick={() => onSelectFestival(targetFestival, 'analysis')}
                  className="text-xs font-medium text-orange-700 hover:underline cursor-pointer"
                >
                  이 축제의 지리 해설 &amp; 기후 그래프 전체 보기
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right: Question & Options */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-stone-900 leading-snug">
              {currentQuestion.prompt}
            </h3>

            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = chosenIndex === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let stateClass =
                  'border-stone-200 bg-[#FAF9F6] hover:border-stone-400 text-stone-800';
                if (hasAnswered) {
                  if (isCorrect) {
                    stateClass = 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium';
                  } else if (isSelected && !isCorrect) {
                    stateClass = 'border-red-500 bg-red-50/70 text-red-900';
                  } else {
                    stateClass = 'border-stone-200 bg-white text-stone-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-colors flex items-start justify-between gap-3 ${stateClass} ${
                      !hasAnswered ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span>
                      <span className="font-mono-num text-xs mr-2.5 opacity-60">0{idx + 1}</span>
                      {opt}
                    </span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <p className="text-xs font-semibold text-stone-900">
                  {chosenIndex === currentQuestion.correctIndex ? '정답입니다.' : '해설을 확인해보세요.'}
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <span className="text-xs font-mono-num text-stone-500">
              현재 정답: {correctCount}개
            </span>
            <button
              type="button"
              disabled={!hasAnswered}
              onClick={handleNext}
              className="px-5 py-2.5 rounded-lg bg-orange-700 hover:bg-orange-800 disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {currentIndex < totalQuestions - 1 ? '다음 문제' : '결과 확인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
