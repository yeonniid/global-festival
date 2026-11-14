import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Camera,
  CheckCircle2,
  Compass,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { GeoFestival } from '../types/festival';
import { FestivalImage } from './FestivalImage';

interface IntroCompareStageProps {
  festivals: GeoFestival[];
  introReflection: string;
  onChangeReflection: (val: string) => void;
  onSelectFestival: (festival: GeoFestival, initialTab?: 'analysis' | 'climate') => void;
  onGoToInquiry: () => void;
}

export const IntroCompareStage: React.FC<IntroCompareStageProps> = ({
  festivals,
  introReflection,
  onChangeReflection,
  onSelectFestival,
  onGoToInquiry,
}) => {
  const [showClues, setShowClues] = useState(false);

  const songkran =
    festivals.find((f) => f.id === 'thailand-songkran') ?? festivals[1] ?? festivals[0];
  const tomatina =
    festivals.find((f) => f.id === 'spain-tomatina') ?? festivals[4] ?? festivals[1] ?? festivals[0];

  const compared = [
    {
      roleLabel: '사례 A · 계절·기후 활용 축제',
      fest: songkran,
      accentClass: 'text-emerald-800',
      keyContrast: '연중 고온·건기 끝(4월) 무더위를 식히고 우기 풍작을 비는 물 축제',
    },
    {
      roleLabel: '사례 B · 지역 특산물 활용 축제',
      fest: tomatina,
      accentClass: 'text-orange-700',
      keyContrast: '고온 건조한 지중해성 여름 햇살이 기른 완숙 토마토를 활용한 거리 축제',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Lesson Intro Header */}
      <section className="border-b border-stone-200 pb-8">
        <p className="text-xs font-medium text-orange-700">
          1단계 · 도입 및 사례 비교
        </p>
        <div className="mt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight leading-snug">
              두 축제가 세계적으로 성공할 수 있었던 배경은 무엇일까?
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-[66ch] leading-relaxed">
              타이(태국)의 <strong>송끄란 축제</strong>와 에스파냐(스페인)의{' '}
              <strong>부뇰 토마토 축제</strong>는 서로 다른 자연환경과 역사에서 출발했지만
              전 세계 여행자가 찾는 대표 축제로 자리 잡았습니다. 두 사례의 공통점과 차이점을
              사진·기후 자료로 비교하며 핵심 성공 배경을 추론해 보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToInquiry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start lg:self-auto"
          >
            <span>2단계 모둠 기획으로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Side-by-side Textbook Case Comparison */}
      <section aria-label="송끄란과 토마토 축제 비교" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {compared.map(({ roleLabel, fest, accentClass, keyContrast }) => (
          <article
            key={fest.id}
            className="border border-stone-200 rounded-2xl bg-white overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative">
                <FestivalImage
                  src={fest.imageUrl}
                  alt={fest.imageAlt}
                  title={fest.title}
                  aspectClassName="aspect-[16/10]"
                  priority
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="text-xs text-amber-200 font-medium">{roleLabel}</p>
                  <h2 className="text-xl sm:text-2xl font-semibold mt-0.5">{fest.title}</h2>
                  <p className="text-xs text-stone-200 mt-1 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>{fest.photoCaption}</span>
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`font-semibold ${accentClass}`}>{fest.environment}</span>
                  <span className="text-stone-300" aria-hidden="true">·</span>
                  <span className="text-stone-700">{fest.subFactor}</span>
                  <span className="text-stone-300" aria-hidden="true">·</span>
                  <span className="text-stone-600">{fest.country} {fest.city}</span>
                  <span className="text-stone-300" aria-hidden="true">·</span>
                  <span className="font-mono-num text-stone-600">{fest.seasonTiming}</span>
                </div>

                <p className="text-sm font-medium text-stone-900 bg-[#FAF9F6] border border-stone-200 rounded-xl p-3.5">
                  {keyContrast}
                </p>

                {/* Geo Formation Chain */}
                <div className="space-y-2.5 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl border border-stone-200 bg-white">
                      <p className="text-[11px] font-semibold text-stone-500">1. 자연·기후 조건</p>
                      <p className="text-xs text-stone-800 mt-1 leading-relaxed">
                        {fest.formationChain.step1Condition}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-stone-200 bg-white">
                      <p className="text-[11px] font-semibold text-stone-500">2. 지역 주민의 대응</p>
                      <p className="text-xs text-stone-800 mt-1 leading-relaxed">
                        {fest.formationChain.step2HumanResponse}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-stone-200 bg-white">
                      <p className="text-[11px] font-semibold text-stone-500">3. 축제의 성공 배경</p>
                      <p className="text-xs text-stone-800 mt-1 leading-relaxed">
                        {fest.successBackground}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regional Impact Summary */}
                <div className="pt-3 border-t border-stone-100">
                  <p className="text-xs font-semibold text-stone-700 mb-1.5">
                    지역 경제 · 문화적 영향
                  </p>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {fest.regionalImpacts.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onSelectFestival(fest, 'analysis')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                사진 속 지리 단서 보기
              </button>
              <button
                type="button"
                onClick={() => onSelectFestival(fest, 'climate')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-200 hover:border-stone-400 bg-[#FAF9F6] text-xs font-medium text-stone-800 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-orange-700" />
                {fest.festivalMonth}월 기후 그래프 비교
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Essential Inquiry Question Box */}
      <section className="border border-stone-200 rounded-2xl bg-white p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-orange-700 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-stone-900">
                도입 질문 · 축제가 성공할 수 있었던 배경은 무엇일까?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                송끄란 축제와 부뇰 토마토 축제를 비교해 보고, 자연환경 조건과 지역사회의 노력이
                어떻게 연결되었는지 내 생각을 정리해 보세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowClues((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] hover:border-stone-400 text-xs font-medium text-stone-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            {showClues ? '교과서 단서 닫기' : '교과서 핵심 단서 보기'}
          </button>
        </div>

        {showClues && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF9F6] border border-stone-200 rounded-xl p-4 text-xs leading-relaxed text-stone-700">
            <div>
              <p className="font-semibold text-stone-900 mb-1">1. 뚜렷한 지역 지리 특성</p>
              <p>
                타이(열대 사바나 건기 말 무더위·우기 기원)와 부뇰(지중해성 여름 고온건조와 풍부한
                토마토 생산)처럼 지역만의 자연환경을 축제의 소재로 삼았습니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-stone-900 mb-1">2. 주민·지방 정부·기업 협력</p>
              <p>
                주민의 자발적 참여에 지방 정부의 안전 관리·환경 정리·홍보 지원이 결합해
                지속 가능한 세계 축제로 성장했습니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-stone-900 mb-1">3. 인문 문화와 경제 효과 연결</p>
              <p>
                정화·풍작 기원이나 공동체 유대 같은 인문적 의미가 방문객 체험과 만나
                비수기·농가·소도시 경제를 활성화했습니다.
              </p>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="intro-hypothesis-input"
            className="block text-xs font-semibold text-stone-700 mb-2"
          >
            우리 모둠(나의) 가설 정리
          </label>
          <textarea
            id="intro-hypothesis-input"
            rows={3}
            value={introReflection}
            onChange={(e) => onChangeReflection(e.target.value)}
            placeholder="예: 두 축제 모두 지역의 고유한 기후·특산물(자연환경)을 바탕으로 주민들의 전통과 자발적 참여, 지방 정부의 체계적 지원(인문환경)이 결합되어 성공했다고 생각합니다."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-stone-500">
            가설을 세웠다면 이제 우리 모둠만의 세계 축제 조건을 설계하고 타당성을 검증해 봅시다.
          </p>
          <button
            type="button"
            onClick={onGoToInquiry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>2단계: 모둠 조건 설계 & 타당성 탐구</span>
          </button>
        </div>
      </section>
    </div>
  );
};
