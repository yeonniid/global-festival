import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Camera,
  Globe,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  EnvironmentCategory,
  GeoFestival,
  GeoSubFactor,
} from '../types/festival';
import { FestivalImage } from './FestivalImage';
import { WorldGeoMap } from './WorldGeoMap';
import { EnvironmentCompareView } from './EnvironmentCompareView';
import { GeoQuizView } from './GeoQuizView';

interface ReferenceAtlasStageProps {
  festivals: GeoFestival[];
  onSelectFestival: (festival: GeoFestival, initialTab?: 'analysis' | 'climate') => void;
}

type AtlasSubTab = 'map-grid' | 'compare-all' | 'quiz';

export const ReferenceAtlasStage: React.FC<ReferenceAtlasStageProps> = ({
  festivals,
  onSelectFestival,
}) => {
  const [subTab, setSubTab] = useState<AtlasSubTab>('map-grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<'전체' | EnvironmentCategory>('전체');
  const [subFactorFilter, setSubFactorFilter] = useState<'전체' | GeoSubFactor>('전체');

  const filteredFestivals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return festivals.filter((f) => {
      if (envFilter !== '전체' && f.environment !== envFilter) return false;
      if (subFactorFilter !== '전체' && f.subFactor !== subFactorFilter) return false;
      if (q) {
        const hay =
          `${f.title} ${f.subtitle} ${f.country} ${f.city} ${f.climateZone} ${f.coreGeoFactor} ${f.subFactor}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [festivals, searchQuery, envFilter, subFactorFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || envFilter !== '전체' || subFactorFilter !== '전체';

  const resetFilters = () => {
    setSearchQuery('');
    setEnvFilter('전체');
    setSubFactorFilter('전체');
  };

  return (
    <div className="space-y-8">
      {/* Header + Sub-mode Switcher */}
      <section className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-emerald-800">
            교과서 자료실 · 세계 축제 지리 도감
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mt-1">
            세계 지도와 13개 대표 축제로 확인하는 지리 요인
          </h1>
          <p className="text-sm text-stone-600 mt-1.5 max-w-[65ch]">
            자연환경과 인문환경의 6개 세부 요인이 전 세계 대륙에서 어떻게 축제로 이어졌는지
            지도·기후 그래프·퀴즈로 확인하세요.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start md:self-auto">
          {[
            { id: 'map-grid', label: '세계 지도 · 도감' },
            { id: 'compare-all', label: '자연 vs 인문 체계' },
            { id: 'quiz', label: '지리 요인 퀴즈' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as AtlasSubTab)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                subTab === tab.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {subTab === 'map-grid' && (
        <div className="space-y-8">
          <WorldGeoMap
            festivals={festivals}
            envFilter={envFilter}
            onChangeEnvFilter={(nextEnv) => {
              setEnvFilter(nextEnv);
              setSubFactorFilter('전체');
            }}
            onSelectFestival={onSelectFestival}
          />

          <section aria-label="지리 요인별 축제 검색 및 필터" className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="국가, 기후(지중해성, 냉대), 종교(사순절), 특산물 검색..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto">
                {(['전체', '자연환경', '인문환경'] as const).map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => {
                      setEnvFilter(env);
                      setSubFactorFilter('전체');
                    }}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      envFilter === env
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {env === '전체' ? '전체 환경' : `${env} 요인`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  세부 지리 요인
                </span>
                {(
                  [
                    '전체',
                    '위치(고위도)',
                    '기후·계절',
                    '지역 특산물',
                    '종교',
                    '전통문화',
                    '공연·예술',
                  ] as const
                ).map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubFactorFilter(sub)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      subFactorFilter === sub
                        ? 'bg-stone-900 border-stone-900 text-white font-medium'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {sub}
                  </button>
                ))}

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-2.5 py-1.5 text-xs text-orange-700 hover:underline whitespace-nowrap"
                  >
                    초기화
                  </button>
                )}
              </div>

              <p className="text-xs text-stone-500 font-mono-num">
                총 {filteredFestivals.length}개 축제 사례
              </p>
            </div>
          </section>

          <section
            aria-label="세계 축제 지리 사례 목록"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFestivals.map((fest) => {
              const isNatural = fest.environment === '자연환경';
              return (
                <article
                  key={fest.id}
                  className="group border border-stone-200 rounded-2xl bg-white overflow-hidden flex flex-col justify-between transition-colors hover:border-stone-400"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectFestival(fest, 'analysis')}
                      className="relative w-full text-left block overflow-hidden cursor-pointer"
                    >
                      <FestivalImage
                        src={fest.imageUrl}
                        alt={fest.imageAlt}
                        title={fest.title}
                        aspectClassName="aspect-[4/3]"
                        className="group-hover:scale-[1.03] transition-transform duration-300"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-white">
                        <span className="text-[11px] text-stone-100/95 truncate flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span className="truncate">{fest.photoClues[0]?.title}</span>
                        </span>
                        <span className="text-[11px] font-mono-num text-stone-200 shrink-0">
                          {fest.festivalMonth}월
                        </span>
                      </div>
                    </button>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            isNatural ? 'text-emerald-700' : 'text-orange-700'
                          }`}
                        >
                          {fest.environment}
                        </span>
                        <span className="text-stone-300" aria-hidden="true">·</span>
                        <span className="text-stone-600">{fest.subFactor}</span>
                        <span className="text-stone-300" aria-hidden="true">·</span>
                        <span className="text-stone-500">
                          {fest.country} {fest.city}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectFestival(fest, 'analysis')}
                        className="text-left block w-full mt-1.5 cursor-pointer"
                      >
                        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-orange-700 transition-colors leading-snug">
                          {fest.title}
                        </h3>
                      </button>

                      <p className="text-sm text-stone-600 leading-relaxed mt-2 line-clamp-2">
                        {fest.coreGeoFactor}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectFestival(fest, 'analysis')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      지리 요인 탐구
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectFestival(fest, 'climate')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 hover:border-stone-400 bg-[#FAF9F6] text-xs font-medium text-stone-800 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-orange-700" />
                      기후 그래프
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      )}

      {subTab === 'compare-all' && (
        <EnvironmentCompareView
          festivals={festivals}
          onSelectFestival={onSelectFestival}
        />
      )}

      {subTab === 'quiz' && (
        <GeoQuizView festivals={festivals} onSelectFestival={onSelectFestival} />
      )}
    </div>
  );
};
