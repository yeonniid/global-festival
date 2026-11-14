import React, { useState } from 'react';
import { CloudRain, Sun, Thermometer } from 'lucide-react';
import { GeoFestival } from '../types/festival';

interface ClimateChartVisualizerProps {
  festival: GeoFestival;
}

export const ClimateChartVisualizer: React.FC<ClimateChartVisualizerProps> = ({ festival }) => {
  const [hoveredMonth, setHoveredMonth] = useState<number>(festival.festivalMonth);

  const data = festival.monthlyClimate;
  const maxRain = Math.max(120, ...data.map((d) => d.rainMm));
  const minTemp = Math.min(-25, ...data.map((d) => d.tempC));
  const maxTemp = Math.max(35, ...data.map((d) => d.tempC));

  const activePoint = data.find((d) => d.month === hoveredMonth) ?? data[festival.festivalMonth - 1];

  // SVG temperature polyline coordinates
  const tempToY = (t: number) => {
    const ratio = (t - minTemp) / (maxTemp - minTemp || 1);
    return 110 - ratio * 92; // 18..110 inside 120px height
  };

  const polyPoints = data
    .map((d, idx) => {
      const x = idx * (360 / 12) + 15;
      const y = tempToY(d.tempC);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      {/* 1. Climate Diagram (기온 + 강수량) */}
      <section className="border border-stone-200 rounded-xl bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h4 className="text-base font-semibold text-stone-900">
              {festival.country} {festival.city} 월별 기후 그래프 (기온 · 강수량)
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              주황색으로 강조된{' '}
              <strong className="text-orange-700 font-medium">{festival.festivalMonth}월</strong>이
              축제가 열리는 시기입니다. 각 월을 클릭하거나 마우스를 올려 기후 조건을 확인하세요.
            </p>
          </div>

          {activePoint && (
            <div className="flex items-center gap-4 text-xs font-mono-num bg-[#FAF9F6] border border-stone-200 px-3.5 py-2 rounded-lg">
              <span className="font-semibold text-stone-900">{activePoint.month}월</span>
              <span className="inline-flex items-center gap-1 text-orange-700">
                <Thermometer className="w-3.5 h-3.5" />
                {activePoint.tempC}°C
              </span>
              <span className="inline-flex items-center gap-1 text-sky-700">
                <CloudRain className="w-3.5 h-3.5" />
                {activePoint.rainMm}mm
              </span>
            </div>
          )}
        </div>

        {/* Chart Area */}
        <div className="mt-5 relative">
          <div className="relative h-48 border-b border-stone-200">
            {/* Background SVG for Rain Bars & Temperature Polyline */}
            <svg
              viewBox="0 0 360 120"
              preserveAspectRatio="none"
              className="w-full h-full block"
              role="img"
              aria-label={`${festival.city} 월별 평균 기온 및 강수량 기후 그래프`}
            >
              {/* Zero degree reference line */}
              {minTemp < 0 && (
                <line
                  x1="0"
                  y1={tempToY(0)}
                  x2="360"
                  y2={tempToY(0)}
                  stroke="#D6D3CD"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
              )}

              {/* Precipitation Bars */}
              {data.map((d, idx) => {
                const barH = Math.max(2, (d.rainMm / maxRain) * 85);
                const x = idx * (360 / 12) + 7;
                const isFestMonth = d.month === festival.festivalMonth;
                const isActive = d.month === hoveredMonth;
                return (
                  <rect
                    key={d.month}
                    x={x}
                    y={120 - barH}
                    width="16"
                    height={barH}
                    rx="1.5"
                    fill={isFestMonth ? '#FDBA74' : isActive ? '#7DD3FC' : '#BAE6FD'}
                    opacity={isFestMonth || isActive ? 0.95 : 0.7}
                  />
                );
              })}

              {/* Temperature Polyline */}
              <polyline
                points={polyPoints}
                fill="none"
                stroke="#C2410C"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Temperature Nodes */}
              {data.map((d, idx) => {
                const x = idx * (360 / 12) + 15;
                const y = tempToY(d.tempC);
                const isFestMonth = d.month === festival.festivalMonth;
                return (
                  <circle
                    key={d.month}
                    cx={x}
                    cy={y}
                    r={isFestMonth ? 3.2 : 2}
                    fill={isFestMonth ? '#C2410C' : '#FFFFFF'}
                    stroke="#C2410C"
                    strokeWidth="1.2"
                  />
                );
              })}
            </svg>

            {/* Interactive Month Hit Columns */}
            <div className="absolute inset-0 grid grid-cols-12">
              {data.map((d) => (
                <button
                  key={d.month}
                  type="button"
                  onMouseEnter={() => setHoveredMonth(d.month)}
                  onFocus={() => setHoveredMonth(d.month)}
                  onClick={() => setHoveredMonth(d.month)}
                  aria-label={`${d.month}월 기온 ${d.tempC}도 강수량 ${d.rainMm}밀리미터`}
                  className="h-full focus:outline-none cursor-pointer hover:bg-stone-900/[0.03]"
                />
              ))}
            </div>
          </div>

          {/* Month Labels */}
          <div className="grid grid-cols-12 pt-2 text-center">
            {data.map((d) => {
              const isFestMonth = d.month === festival.festivalMonth;
              const isActive = d.month === hoveredMonth;
              return (
                <button
                  key={d.month}
                  type="button"
                  onClick={() => setHoveredMonth(d.month)}
                  className={`text-xs font-mono-num py-1 rounded cursor-pointer ${
                    isFestMonth
                      ? 'text-orange-700 font-bold'
                      : isActive
                      ? 'text-stone-900 font-semibold'
                      : 'text-stone-500'
                  }`}
                >
                  {d.month}월
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-orange-700 inline-block" />
                월 평균 기온 (°C)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-sky-200 inline-block" />
                월 강수량 (mm)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-300 inline-block" />
                축제 개최 월 ({festival.festivalMonth}월)
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-stone-600">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              개최 시 낮 길이: <strong className="text-stone-900">{festival.daylightHoursAtFestival}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Geographic Metadata Matrix */}
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-stone-200 rounded-xl bg-white p-4">
          <dt className="text-xs text-stone-500">위도 · 지리적 위치</dt>
          <dd className="text-sm font-semibold text-stone-900 mt-1">{festival.latitudeLabel}</dd>
        </div>
        <div className="border border-stone-200 rounded-xl bg-white p-4">
          <dt className="text-xs text-stone-500">기후 구분</dt>
          <dd className="text-sm font-semibold text-stone-900 mt-1">{festival.climateZone}</dd>
        </div>
        <div className="border border-stone-200 rounded-xl bg-white p-4">
          <dt className="text-xs text-stone-500">개최 시기</dt>
          <dd className="text-sm font-semibold text-stone-900 mt-1">{festival.seasonTiming}</dd>
        </div>
      </dl>
    </div>
  );
};
