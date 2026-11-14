import React, { useState } from 'react';
import { ArrowLeftRight, Compass, Users } from 'lucide-react';
import { GeoFestival } from '../types/festival';
import { FestivalImage } from './FestivalImage';

interface EnvironmentCompareViewProps {
  festivals: GeoFestival[];
  onSelectFestival: (festival: GeoFestival, initialTab?: 'analysis' | 'climate') => void;
}

export const EnvironmentCompareView: React.FC<EnvironmentCompareViewProps> = ({
  festivals,
  onSelectFestival,
}) => {
  const [leftId, setLeftId] = useState<string>(festivals[2]?.id ?? festivals[0]?.id ?? '');
  const [rightId, setRightId] = useState<string>(festivals[8]?.id ?? festivals[1]?.id ?? '');

  const leftFest = festivals.find((f) => f.id === leftId) ?? festivals[0];
  const rightFest = festivals.find((f) => f.id === rightId) ?? festivals[1] ?? festivals[0];

  const naturalFestivals = festivals.filter((f) => f.environment === '자연환경');
  const humanFestivals = festivals.filter((f) => f.environment === '인문환경');

  return (
    <div className="space-y-10">
      {/* Section 1: Taxonomy Overview */}
      <section className="space-y-5">
        <div className="pb-4 border-b border-stone-200">
          <h2 className="text-2xl font-semibold text-stone-900">
            자연환경 vs 인문환경 축제 형성 체계
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            세계의 다양한 축제는 그 지역의 위치·기후·특산물(자연환경) 또는 종교·전통문화·예술(인문환경)을 바탕으로 형성됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Natural Environment Column */}
          <div className="border border-stone-200 rounded-2xl bg-white p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
                <Compass className="w-5 h-5" />
                <span>자연환경을 활용한 축제 ({naturalFestivals.length})</span>
              </h3>
              <span className="text-xs text-stone-500">위치 · 기후 · 특산물</span>
            </div>

            <div className="space-y-4">
              {(['위치(고위도)', '기후·계절', '지역 특산물'] as const).map((sub) => {
                const items = naturalFestivals.filter((f) => f.subFactor === sub);
                return (
                  <div key={sub} className="space-y-2">
                    <h4 className="text-xs font-semibold text-stone-700">{sub}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {items.map((fest) => (
                        <button
                          key={fest.id}
                          type="button"
                          onClick={() => onSelectFestival(fest, 'analysis')}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-emerald-700/50 bg-[#FAF9F6] text-left transition-colors cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                            <FestivalImage
                              src={fest.imageUrl}
                              alt={fest.imageAlt}
                              aspectClassName="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-emerald-700 font-medium">{fest.country}</p>
                            <p className="text-sm font-semibold text-stone-900 truncate">
                              {fest.title}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {fest.climateZone}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Human Environment Column */}
          <div className="border border-stone-200 rounded-2xl bg-white p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>인문환경을 활용한 축제 ({humanFestivals.length})</span>
              </h3>
              <span className="text-xs text-stone-500">종교 · 전통문화 · 예술</span>
            </div>

            <div className="space-y-4">
              {(['종교', '전통문화', '공연·예술'] as const).map((sub) => {
                const items = humanFestivals.filter((f) => f.subFactor === sub);
                return (
                  <div key={sub} className="space-y-2">
                    <h4 className="text-xs font-semibold text-stone-700">{sub}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {items.map((fest) => (
                        <button
                          key={fest.id}
                          type="button"
                          onClick={() => onSelectFestival(fest, 'analysis')}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-orange-700/50 bg-[#FAF9F6] text-left transition-colors cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                            <FestivalImage
                              src={fest.imageUrl}
                              alt={fest.imageAlt}
                              aspectClassName="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-orange-700 font-medium">{fest.country}</p>
                            <p className="text-sm font-semibold text-stone-900 truncate">
                              {fest.title}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {fest.seasonTiming}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Side-by-Side Comparison */}
      {leftFest && rightFest && (
        <section className="border border-stone-200 rounded-2xl bg-white p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-orange-700" />
                <span>두 축제 지리적 요인 직접 비교하기</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                비교할 두 축제를 선택해 자연·인문 환경 차이와 지역사회 영향을 나란히 살펴보세요.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={leftFest.id}
                onChange={(e) => setLeftId(e.target.value)}
                aria-label="비교 기준 축제 A"
                className="px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium bg-[#FAF9F6]"
              >
                {festivals.map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.environment}] {f.title}
                  </option>
                ))}
              </select>
              <span className="text-xs text-stone-400">vs</span>
              <select
                value={rightFest.id}
                onChange={(e) => setRightId(e.target.value)}
                aria-label="비교 대상 축제 B"
                className="px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium bg-[#FAF9F6]"
              >
                {festivals.map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.environment}] {f.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[leftFest, rightFest].map((fest, idx) => (
              <div
                key={`${fest.id}-${idx}`}
                className="border border-stone-200 rounded-xl overflow-hidden bg-[#FAF9F6] flex flex-col justify-between"
              >
                <div>
                  <FestivalImage
                    src={fest.imageUrl}
                    alt={fest.imageAlt}
                    aspectClassName="aspect-[16/9]"
                  />
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-xs font-medium">
                        <span
                          className={
                            fest.environment === '자연환경' ? 'text-emerald-700' : 'text-orange-700'
                          }
                        >
                          {fest.environment} · {fest.subFactor}
                        </span>
                        <span className="text-stone-400 mx-1.5">·</span>
                        <span className="text-stone-600">
                          {fest.country} {fest.city}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-stone-900 mt-1">{fest.title}</h4>
                    </div>

                    <dl className="space-y-3 text-xs sm:text-sm divide-y divide-stone-200/80">
                      <div className="pt-2">
                        <dt className="text-xs text-stone-500">핵심 지리적 형성 요인</dt>
                        <dd className="text-stone-900 font-medium mt-0.5 leading-relaxed">
                          {fest.coreGeoFactor}
                        </dd>
                      </div>
                      <div className="pt-3">
                        <dt className="text-xs text-stone-500">위치 · 기후 특성</dt>
                        <dd className="text-stone-700 mt-0.5">
                          {fest.latitudeLabel} · {fest.climateZone}
                        </dd>
                      </div>
                      <div className="pt-3">
                        <dt className="text-xs text-stone-500">성공 배경</dt>
                        <dd className="text-stone-700 mt-0.5 leading-relaxed">
                          {fest.successBackground}
                        </dd>
                      </div>
                      <div className="pt-3">
                        <dt className="text-xs text-stone-500">지역사회·경제 영향</dt>
                        <dd className="text-stone-700 mt-0.5 leading-relaxed">
                          {fest.regionalImpacts[0]}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => onSelectFestival(fest, 'climate')}
                    className="w-full py-2 rounded-lg border border-stone-300 bg-white hover:border-stone-500 text-xs font-medium text-stone-800 cursor-pointer"
                  >
                    기후 그래프 · 상세 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
