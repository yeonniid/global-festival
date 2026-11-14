import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  ContinentType,
  GroupFestivalPlan,
} from '../types/festival';
import {
  CLIMATE_PRESETS,
  matchFestivalVisual,
  validateGroupFestivalPlan,
} from '../utils/geoValidator';
import { FestivalImage } from './FestivalImage';

interface InquiryDesignStageProps {
  plan: GroupFestivalPlan;
  onChangePlan: (next: GroupFestivalPlan) => void;
  onGoToApply: () => void;
}

interface InquiryPreset {
  label: string;
  isErrorPractice?: boolean;
  values: Partial<GroupFestivalPlan>;
}

const INQUIRY_PRESETS: InquiryPreset[] = [
  {
    label: '사막 오아시스 별빛·열기구 축제',
    values: {
      continent: '아프리카·오세아니아',
      country: '튀니지',
      city: '두즈 (사하라 관문)',
      climateId: 'arid-desert',
      naturalFactor: '기후·계절',
      humanFactor: '전통문화',
      month: 12,
      festivalName: '사하라 별빛 바람 열기구 축제',
      specialtyFeature:
        '구름이 적고 공기가 맑은 사막 기후와 오아시스 대상(캐러밴) 유목 문화가 만나는 겨울 축제',
      experienceContent:
        '새벽 사막 열기구 탑승, 베르베르 천막 별자리 관측, 낙타 트레킹 체험',
      validityReasonNote:
        '건조 기후의 맑은 밤하늘과 사막 교역로의 유목 전통이 결합되어 겨울철 온화한 시기에 열리므로 지리적으로 타당합니다.',
      hashtags: '#사하라사막 #건조기후 #유목문화 #세계축제지리',
    },
  },
  {
    label: '지중해 올리브·레몬 수확 축제',
    values: {
      continent: '유럽',
      country: '그리스',
      city: '칼라마타',
      climateId: 'mediterranean',
      naturalFactor: '지역 특산물',
      humanFactor: '전통문화',
      month: 9,
      festivalName: '칼라마타 황금 레몬·올리브 수확제',
      specialtyFeature:
        '여름 고온 건조한 지중해성 기후에서 잘 자라는 올리브·감귤류 특산물을 활용한 수확 감사 축제',
      experienceContent:
        '돌 절구 올리브유 압착 체험, 지중해 감귤 퍼레이드, 마을 광장 전통 포크 댄스',
      validityReasonNote:
        '강한 여름 일조량을 버티는 수목작물(올리브·레몬) 특산물과 지중해 마을 공동체 식문화가 연결되어 있어 타당합니다.',
      hashtags: '#지중해성기후 #지역특산물 #올리브수확제 #세계축제지리',
    },
  },
  {
    label: '고위도 백야 야외 민속·음악제',
    values: {
      continent: '유럽',
      country: '노르웨이',
      city: '트롬쇠',
      climateId: 'high-lat-midnight',
      naturalFactor: '위치(고위도)',
      humanFactor: '공연·예술',
      month: 6,
      festivalName: '트롬쇠 한밤의 태양 합창 페스티벌',
      specialtyFeature:
        '북위 69도 고위도 지역에서 6월 하지 무렵 밤에도 해가 지지 않는 백야 현상을 활용한 야외 음악제',
      experienceContent:
        '자정 피오르 야외 합창 감상, 들꽃 화관 엮기, 북극권 백야 트레킹',
      validityReasonNote:
        '긴 겨울이 지난 뒤 찾아오는 고위도 백야라는 자연 조건과 지역 음악 예술 공동체가 맞물려 6월 개최가 타당합니다.',
      hashtags: '#고위도백야 #북유럽하지 #트롬쇠 #세계축제지리',
    },
  },
  {
    label: '오류 점검 연습: 열대 기후 눈조각 축제',
    isErrorPractice: true,
    values: {
      continent: '아시아',
      country: '인도네시아',
      city: '자카르타',
      climateId: 'tropical-monsoon',
      naturalFactor: '기후·계절',
      humanFactor: '공연·예술',
      month: 4,
      festivalName: '열대 바다 초대형 눈조각 축제',
      specialtyFeature: '연중 30℃가 넘는 열대 기후 해변에서 자연 눈으로 거대 성곽을 쌓는 축제',
      experienceContent: '야외 눈사람 만들기, 얼음 썰매 타기, 방한복 입고 눈싸움하기',
      validityReasonNote: '그냥 재밌을 것 같아서 기획함',
      hashtags: '#열대눈축제',
    },
  },
];

export const InquiryDesignStage: React.FC<InquiryDesignStageProps> = ({
  plan,
  onChangePlan,
  onGoToApply,
}) => {
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  const validity = useMemo(() => validateGroupFestivalPlan(plan), [plan]);
  const visualMatch = useMemo(() => matchFestivalVisual(plan), [plan]);

  const allConditionsFilled =
    Boolean(plan.groupName.trim()) &&
    Boolean(plan.country.trim()) &&
    Boolean(plan.city.trim()) &&
    Boolean(plan.festivalName.trim()) &&
    Boolean(plan.specialtyFeature.trim()) &&
    Boolean(plan.experienceContent.trim());

  const updateField = <K extends keyof GroupFestivalPlan>(
    field: K,
    value: GroupFestivalPlan[K]
  ) => {
    const nextPlan: GroupFestivalPlan = {
      ...plan,
      [field]: value,
    };
    const matched = matchFestivalVisual(nextPlan);
    onChangePlan({
      ...nextPlan,
      imageUrl: matched.imageUrl,
    });
  };

  const applyPreset = (preset: InquiryPreset) => {
    const merged: GroupFestivalPlan = {
      ...plan,
      ...preset.values,
    };
    const matched = matchFestivalVisual(merged);
    triggerVisualSynthesis({
      ...merged,
      imageUrl: matched.imageUrl,
    });
  };

  const triggerVisualSynthesis = (targetPlan: GroupFestivalPlan = plan) => {
    setIsGeneratingVisual(true);
    const matched = matchFestivalVisual(targetPlan);
    onChangePlan({
      ...targetPlan,
      imageUrl: matched.imageUrl,
    });
    window.setTimeout(() => {
      setIsGeneratingVisual(false);
    }, 450);
  };

  const handleRecordRevision = () => {
    const matched = matchFestivalVisual(plan);
    setIsGeneratingVisual(true);
    onChangePlan({
      ...plan,
      imageUrl: matched.imageUrl,
      revisionCount: plan.revisionCount + 1,
    });
    window.setTimeout(() => {
      setIsGeneratingVisual(false);
    }, 450);
  };

  const selectedClimate = CLIMATE_PRESETS.find((c) => c.id === plan.climateId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-stone-200 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-orange-700">
            2단계 · 탐구 (모둠 조건 설계 & 지리적 타당성 피드백)
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mt-1">
            모둠 조건을 설정하고 타당성 피드백으로 기획 수정하기
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-[68ch] leading-relaxed">
            모둠별로 대륙·국가·기후·개최 월(자연환경)과 문화 요소(인문환경)를 모두 선택하면
            지리적 타당성 점검 결과와 함께 조건에 맞는 <strong>축제 현장 이미지</strong>가 자동으로
            생성됩니다. 피드백의 보완점을 반영해 기획을 다듬어 보세요.
          </p>
        </div>
        <div className="text-xs text-stone-600 font-mono-num shrink-0">
          기획 수정 횟수: <strong className="text-stone-900">{plan.revisionCount}회</strong>
        </div>
      </section>

      {/* Preset Selector for Classroom Exploration */}
      <section className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-orange-700" />
            탐구 예시 불러오기 (직접 입력하거나 아래 조건 조합·오류 연습 사례를 불러와 수정해 보세요)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INQUIRY_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                preset.isErrorPractice
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-stone-200 bg-[#FAF9F6] text-stone-800 hover:border-stone-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Split: Condition Builder (Left 7) + Live Validity & Auto-Image Panel (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Condition Form */}
        <section className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                모둠 이름
              </label>
              <input
                type="text"
                value={plan.groupName}
                onChange={(e) => updateField('groupName', e.target.value)}
                placeholder="예: 1모둠 지리탐험대"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                대륙 선택
              </label>
              <select
                value={plan.continent}
                onChange={(e) => updateField('continent', e.target.value as ContinentType)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              >
                {(['아시아', '유럽', '북미', '남미', '아프리카·오세아니아'] as const).map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                개최 국가
              </label>
              <input
                type="text"
                value={plan.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="예: 모로코"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                개최 도시 · 지역 (필수 요소)
              </label>
              <input
                type="text"
                value={plan.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="예: 메르주가 사막"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                개최 월
              </label>
              <select
                value={plan.month}
                onChange={(e) => updateField('month', Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 font-mono-num focus:outline-none focus:border-stone-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Climate & Geography Factors */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                기후대 · 위치 환경 조건 (자연환경 배경)
              </label>
              <select
                value={plan.climateId}
                onChange={(e) =>
                  updateField('climateId', e.target.value as GroupFestivalPlan['climateId'])
                }
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              >
                {CLIMATE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              {selectedClimate && (
                <p className="text-xs text-stone-500 mt-1.5">
                  권장 시기: {selectedClimate.recommendedMonths.join('·')}월 ·{' '}
                  {selectedClimate.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1.5">
                  활용한 자연환경 요인
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['위치(고위도)', '기후·계절', '지역 특산물'] as const).map((nf) => (
                    <button
                      key={nf}
                      type="button"
                      onClick={() => updateField('naturalFactor', nf)}
                      className={`px-2 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        plan.naturalFactor === nf
                          ? 'bg-emerald-800 border-emerald-800 text-white'
                          : 'bg-[#FAF9F6] border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {nf}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-orange-800 mb-1.5">
                  결합한 인문환경 요인
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['종교', '전통문화', '공연·예술'] as const).map((hf) => (
                    <button
                      key={hf}
                      type="button"
                      onClick={() => updateField('humanFactor', hf)}
                      className={`px-2 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        plan.humanFactor === hf
                          ? 'bg-orange-700 border-orange-700 text-white'
                          : 'bg-[#FAF9F6] border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {hf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Required Card Fields + Validity Justification */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                축제 이름 (SNS 카드 필수 요소)
              </label>
              <input
                type="text"
                value={plan.festivalName}
                onChange={(e) => updateField('festivalName', e.target.value)}
                placeholder="예: 안데스 고산 태양의 직물 축제"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                축제의 특색 — 자연·인문환경 특징 (SNS 카드 필수 요소)
              </label>
              <textarea
                rows={2}
                value={plan.specialtyFeature}
                onChange={(e) => updateField('specialtyFeature', e.target.value)}
                placeholder="기후, 지형, 특산물, 종교·전통문화가 어떻게 드러나는지 적어보세요."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                주요 체험 내용 (SNS 카드 필수 요소)
              </label>
              <textarea
                rows={2}
                value={plan.experienceContent}
                onChange={(e) => updateField('experienceContent', e.target.value)}
                placeholder="방문객과 주민이 현장에서 직접 즐기는 대표 활동을 적어보세요."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                타당성 판단 근거 (자연환경 × 인문환경 연결 설명)
              </label>
              <textarea
                rows={3}
                value={plan.validityReasonNote}
                onChange={(e) => updateField('validityReasonNote', e.target.value)}
                placeholder="왜 이 지역·기후·시기에 이러한 인문 문화 기반 축제가 열릴 수 있는지 지리적으로 설명해 주세요."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </section>

        {/* Right: Auto Visual Preview + Live Geographic Validity Feedback */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Auto-Generated Visual Match Preview */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-700" />
                <span className="text-xs font-semibold text-stone-900">
                  선택 조건 기반 축제 이미지 자동 생성
                </span>
              </div>
              <button
                type="button"
                onClick={() => triggerVisualSynthesis(plan)}
                className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 hover:underline cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>다시 매칭</span>
              </button>
            </div>

            <div className="relative">
              <FestivalImage
                src={plan.customUploadedImage || visualMatch.imageUrl}
                alt={plan.festivalName || '자동 생성된 축제 장면'}
                title={plan.festivalName}
                aspectClassName="aspect-[16/10]"
                priority
              />
              {isGeneratingVisual && (
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-300" />
                  <p className="text-xs font-medium">
                    지리 조건에 맞는 축제 장면을 자동 생성하는 중…
                  </p>
                </div>
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-[11px] text-amber-200">
                  {allConditionsFilled
                    ? '조건 선택 완료 · 자동 이미지 생성됨'
                    : '조건 입력에 따라 실시간 이미지 자동 매칭'}
                </p>
                <p className="text-sm font-semibold truncate mt-0.5">
                  {plan.festivalName || '축제 이름을 입력해 주세요'}
                </p>
                <p className="text-[11px] text-stone-200 mt-0.5 truncate">
                  {visualMatch.caption}
                </p>
              </div>
            </div>
          </div>

          {/* Live Validity Feedback Panel */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-sm font-semibold text-stone-900">
                  지리적 타당성 점검 피드백
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  모순이 있다면 조건을 수정해 타당도를 높여 보세요.
                </p>
              </div>
              <span
                className={`text-lg font-bold font-mono-num ${
                  validity.isValid ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {validity.score}%
              </span>
            </div>

            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                validity.isValid
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              {validity.summary}
            </div>

            <ul className="space-y-2.5">
              {validity.items.map((item, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl border border-stone-200 bg-[#FAF9F6] flex items-start gap-2.5 text-xs"
                >
                  {item.status === 'pass' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-stone-900">{item.category}</p>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">{item.message}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleRecordRevision}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 bg-white hover:border-stone-500 text-xs font-medium text-stone-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>타당성 피드백 반영해 기획 수정 저장 ({plan.revisionCount}회 수정됨)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerVisualSynthesis(plan);
                  onGoToApply();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>3단계: 활동 2 정리 & SNS 카드 자동 생성</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
