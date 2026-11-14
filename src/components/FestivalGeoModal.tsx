import React, { useState } from 'react';
import {
  ArrowRight,
  Camera,
  Globe,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
} from 'lucide-react';
import { GeoFestival } from '../types/festival';
import { FestivalImage } from './FestivalImage';
import { ClimateChartVisualizer } from './ClimateChartVisualizer';

interface FestivalGeoModalProps {
  festival: GeoFestival;
  initialTab?: 'analysis' | 'climate';
  onClose: () => void;
}

export const FestivalGeoModal: React.FC<FestivalGeoModalProps> = ({
  festival,
  initialTab = 'analysis',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'climate'>(initialTab);
  const [isLightbox, setIsLightbox] = useState(false);

  const isNatural = festival.environment === '자연환경';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="geo-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#FAF9F6] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-stone-200 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold ${isNatural ? 'text-emerald-700' : 'text-orange-700'}`}>
                {festival.environment} 활용 축제
              </span>
              <span className="text-stone-300" aria-hidden="true">
                ·
              </span>
              <span className="text-stone-600">{festival.subFactor}</span>
              <span className="text-stone-300" aria-hidden="true">
                ·
              </span>
              <span className="text-stone-500">
                {festival.country} {festival.city}
              </span>
            </div>
            <h2
              id="geo-modal-title"
              className="text-xl sm:text-2xl font-semibold text-stone-900 truncate mt-0.5"
            >
              {festival.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="창 닫기"
            className="w-10 h-10 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:border-stone-400 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Documentary Photo Banner */}
          <div className="relative bg-stone-900">
            <FestivalImage
              src={festival.imageUrl}
              alt={festival.imageAlt}
              title={festival.title}
              aspectClassName={
                isLightbox ? 'aspect-[16/10] max-h-[68vh]' : 'aspect-[16/7] max-h-[340px]'
              }
              className="w-full"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4 text-white">
              <div className="max-w-2xl">
                <p className="text-xs text-stone-200/90 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>현장 사진 속 지리 경관</span>
                </p>
                <p className="text-sm sm:text-base font-medium text-white mt-1">
                  {festival.photoCaption}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightbox((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black/55 hover:bg-black/75 border border-white/25 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isLightbox ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    사진 축소
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    사진 크게 보기
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="px-6 pt-4 border-b border-stone-200 bg-white flex items-center gap-6">
            {[
              { id: 'analysis', label: '지리적 형성 배경 · 지역 영향' },
              { id: 'climate', label: '기후 그래프 · 위치 데이터' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-orange-700 text-stone-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'analysis' ? (
              <div className="space-y-8">
                {/* Photo Geographic Clues */}
                <section>
                  <h3 className="text-base font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-orange-700" />
                    <span>사진 속에서 읽어내는 지리적 단서</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {festival.photoClues.map((clue, idx) => (
                      <div
                        key={idx}
                        className="border border-stone-200 rounded-xl bg-white p-4 space-y-1.5"
                      >
                        <p className="text-xs font-mono-num text-orange-700 font-semibold">
                          단서 0{idx + 1}
                        </p>
                        <h4 className="text-sm font-semibold text-stone-900">{clue.title}</h4>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {clue.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Causal Formation Chain */}
                <section className="pt-6 border-t border-stone-200">
                  <h3 className="text-base font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-700" />
                    <span>축제가 형성된 지리적 인과 과정</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-stone-200 rounded-xl bg-white p-5">
                      <span className="text-xs font-mono-num text-stone-400 block">
                        01. {festival.environment} 조건
                      </span>
                      <p className="text-sm text-stone-800 leading-relaxed mt-2">
                        {festival.formationChain.step1Condition}
                      </p>
                    </div>
                    <div className="border border-stone-200 rounded-xl bg-white p-5">
                      <span className="text-xs font-mono-num text-stone-400 flex items-center gap-1">
                        02. 지역 주민의 대응 <ArrowRight className="w-3 h-3" />
                      </span>
                      <p className="text-sm text-stone-800 leading-relaxed mt-2">
                        {festival.formationChain.step2HumanResponse}
                      </p>
                    </div>
                    <div className="border border-orange-200 rounded-xl bg-orange-50/40 p-5">
                      <span className="text-xs font-mono-num text-orange-700 font-semibold block">
                        03. 오늘날의 축제 형성
                      </span>
                      <p className="text-sm text-stone-900 font-medium leading-relaxed mt-2">
                        {festival.formationChain.step3FestivalForm}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Success Background & Regional Impacts (Textbook Activity 2) */}
                <section className="pt-6 border-t border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 border border-stone-200 rounded-xl bg-white p-5">
                    <h4 className="text-sm font-semibold text-stone-900 mb-2">
                      축제의 성공 배경
                    </h4>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {festival.successBackground}
                    </p>
                  </div>

                  <div className="lg:col-span-7 border border-stone-200 rounded-xl bg-white p-5">
                    <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-700" />
                      <span>지역 경제 및 사회·문화적 영향</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-stone-700">
                      {festival.regionalImpacts.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="font-mono-num text-xs text-orange-700 font-semibold mt-0.5">
                            0{i + 1}
                          </span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <span className="text-xs text-stone-500 block mb-1.5">대표 체험 · 행사</span>
                      <p className="text-xs text-stone-700">
                        {festival.keyActivities.join(' · ')}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <ClimateChartVisualizer festival={festival} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
