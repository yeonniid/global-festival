import React, { useState } from 'react';
import { BookOpen, Globe, Layers, MapPin } from 'lucide-react';
import { EnvironmentCategory, GeoFestival } from '../types/festival';
import { FestivalImage } from './FestivalImage';

interface WorldGeoMapProps {
  festivals: GeoFestival[];
  envFilter: '전체' | EnvironmentCategory;
  onChangeEnvFilter: (env: '전체' | EnvironmentCategory) => void;
  onSelectFestival: (festival: GeoFestival, initialTab?: 'analysis' | 'climate') => void;
}

function projectToMap(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x: Math.max(4, Math.min(96, x)), y: Math.max(8, Math.min(88, y)) };
}

export const WorldGeoMap: React.FC<WorldGeoMapProps> = ({
  festivals,
  envFilter,
  onChangeEnvFilter,
  onSelectFestival,
}) => {
  const [selectedId, setSelectedId] = useState<string>(festivals[0]?.id ?? '');

  const visibleFestivals =
    envFilter === '전체'
      ? festivals
      : festivals.filter((f) => f.environment === envFilter);

  const selected =
    visibleFestivals.find((f) => f.id === selectedId) ??
    visibleFestivals[0] ??
    festivals[0] ??
    null;

  return (
    <section
      aria-labelledby="world-geo-map-title"
      className="border border-stone-200 rounded-2xl bg-white overflow-hidden"
    >
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="world-geo-map-title"
            className="text-lg font-semibold text-stone-900 flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-orange-700" />
            <span>세계 축제 지리 분포도 (자연환경 · 인문환경)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            지도 위 지점을 선택하면 해당 축제의 실제 사진과 지리적 형성 원인을 탐구할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
              자연환경 요인
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-700 inline-block" />
              인문환경 요인
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            {(['전체', '자연환경', '인문환경'] as const).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => onChangeEnvFilter(env)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  envFilter === env
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 relative bg-[#F2EFE8] border-b lg:border-b-0 lg:border-r border-stone-200 min-h-[320px] sm:min-h-[390px] overflow-hidden">
          <svg
            viewBox="0 0 360 180"
            preserveAspectRatio="none"
            className="w-full h-full min-h-[320px] sm:min-h-[390px] block"
            role="img"
            aria-label="세계 축제의 자연환경 및 인문환경 분포 지도"
          >
            {/* Latitude & Longitude Grid (highlight Equator 0° and Arctic/30°/60° zones) */}
            <g stroke="#E0DACB" strokeWidth="0.4">
              <line x1="0" y1="30" x2="360" y2="30" strokeDasharray="1.5 1.5" />
              <line x1="0" y1="60" x2="360" y2="60" />
              <line x1="0" y1="90" x2="360" y2="90" stroke="#C5BFA8" strokeWidth="0.6" strokeDasharray="2.5 2" />
              <line x1="0" y1="120" x2="360" y2="120" />
              <line x1="90" y1="0" x2="90" y2="180" />
              <line x1="180" y1="0" x2="180" y2="180" />
              <line x1="270" y1="0" x2="270" y2="180" />
            </g>

            {/* Equator & 60°N labels */}
            <text x="4" y="88" fontSize="4.2" fill="#8C8574" fontFamily="monospace">
              적도 0°
            </text>
            <text x="4" y="28" fontSize="4.2" fill="#8C8574" fontFamily="monospace">
              북위 60° (고위도)
            </text>

            {/* Continents */}
            <g fill="#DFD9CB" stroke="#CCC4B2" strokeWidth="0.6" strokeLinejoin="round">
              {/* North America */}
              <path d="M 18 32 L 58 22 L 96 28 L 112 42 L 104 60 L 82 72 L 72 80 L 62 72 L 42 58 L 28 45 Z" />
              {/* Greenland */}
              <path d="M 122 14 L 148 12 L 154 24 L 134 30 Z" />
              {/* South America */}
              <path d="M 96 84 L 116 86 L 136 98 L 134 118 L 116 144 L 106 154 L 98 130 L 92 104 Z" />
              {/* Europe */}
              <path d="M 164 38 L 184 20 L 210 20 L 218 42 L 204 52 L 182 54 L 166 48 Z" />
              {/* Africa */}
              <path d="M 164 56 L 194 56 L 216 68 L 222 86 L 208 118 L 192 134 L 182 114 L 174 90 L 158 76 Z" />
              {/* Asia */}
              <path d="M 212 22 L 274 20 L 326 28 L 336 48 L 314 68 L 292 84 L 272 82 L 254 78 L 234 72 L 214 58 Z" />
              {/* Japan & SE Asia */}
              <path d="M 318 46 L 326 42 L 328 52 L 320 56 Z" />
              <path d="M 278 88 L 304 92 L 300 98 L 274 94 Z" />
              {/* Australia */}
              <path d="M 294 112 L 324 110 L 336 126 L 324 140 L 298 134 Z" />
            </g>
          </svg>

          {/* Interactive Pins */}
          <div className="absolute inset-0">
            {visibleFestivals.map((fest) => {
              const pos = projectToMap(fest.coordinates.lat, fest.coordinates.lng);
              const isSelected = selected?.id === fest.id;
              const isNatural = fest.environment === '자연환경';
              return (
                <button
                  key={fest.id}
                  type="button"
                  onClick={() => setSelectedId(fest.id)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-orange-700 cursor-pointer ${
                    isSelected ? 'z-20 scale-115' : 'z-10 hover:scale-105'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                      isNatural
                        ? isSelected
                          ? 'bg-emerald-700 border-stone-900 text-white ring-4 ring-emerald-700/25'
                          : 'bg-emerald-700 border-white text-white'
                        : isSelected
                        ? 'bg-orange-700 border-stone-900 text-white ring-4 ring-orange-700/25'
                        : 'bg-orange-700 border-white text-white'
                    }`}
                  >
                    <MapPin className="w-2.5 h-2.5" />
                  </span>
                  <span
                    className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap border shadow-xs ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white/95 text-stone-800 border-stone-200'
                    }`}
                  >
                    {fest.city}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Festival Geography Inspector */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white">
          {selected ? (
            <>
              <div className="space-y-3.5">
                <button
                  type="button"
                  onClick={() => onSelectFestival(selected, 'analysis')}
                  className="w-full text-left block rounded-xl overflow-hidden border border-stone-200 group cursor-pointer"
                >
                  <FestivalImage
                    src={selected.imageUrl}
                    alt={selected.imageAlt}
                    title={selected.title}
                    aspectClassName="aspect-[4/3]"
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </button>

                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        selected.environment === '자연환경'
                          ? 'text-emerald-700'
                          : 'text-orange-700'
                      }`}
                    >
                      {selected.environment}
                    </span>
                    <span className="text-stone-300" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-stone-600">{selected.subFactor}</span>
                    <span className="text-stone-300" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-stone-500">{selected.country}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-stone-900 mt-1">{selected.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1.5">
                    {selected.coreGeoFactor}
                  </p>
                </div>

                <dl className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <dt className="text-stone-400">위도 · 위치</dt>
                    <dd className="text-stone-800 font-medium mt-0.5 truncate">
                      {selected.latitudeLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-400">기후 특성</dt>
                    <dd className="text-stone-800 font-medium mt-0.5 truncate">
                      {selected.climateZone}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onSelectFestival(selected, 'analysis')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  형성 요인 해설
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFestival(selected, 'climate')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 hover:border-stone-400 text-xs font-medium text-stone-800 whitespace-nowrap cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-orange-700" />
                  기후 · 데이터 보기
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500 my-auto text-center">
              표시할 축제가 없습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
