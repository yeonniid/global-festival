import React, { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { GEO_FESTIVALS } from './data/festivals';
import {
  CultureRespectNote,
  GeoFestival,
  GroupFestivalPlan,
  PeerRubricEvaluation,
} from './types/festival';
import { FestivalGeoModal } from './components/FestivalGeoModal';
import { IntroCompareStage } from './components/IntroCompareStage';
import { InquiryDesignStage } from './components/InquiryDesignStage';
import { ApplySnsStage } from './components/ApplySnsStage';
import { ReviewGalleryStage } from './components/ReviewGalleryStage';
import { ReferenceAtlasStage } from './components/ReferenceAtlasStage';

type LessonStage = 'intro' | 'inquiry' | 'apply' | 'review' | 'atlas';

const LESSON_STORAGE_KEY = 'world_festival_lesson_v3';

const DEFAULT_DRAFT_PLAN: GroupFestivalPlan = {
  id: 'group-draft-1',
  groupName: '1모둠 지리탐험대',
  festivalName: '사하라 별빛 바람 열기구 축제',
  continent: '아프리카·오세아니아',
  country: '튀니지',
  city: '두즈 (사하라 관문)',
  climateId: 'arid-desert',
  naturalFactor: '기후·계절',
  humanFactor: '전통문화',
  month: 12,
  specialtyFeature:
    '구름이 적고 공기가 맑은 건조 사막 기후와 오아시스 대상(캐러밴) 유목 문화가 만나는 겨울 축제',
  experienceContent:
    '새벽 사막 열기구 탑승, 베르베르 천막 별자리 관측, 낙타 트레킹 체험',
  validityReasonNote:
    '건조 기후의 맑은 밤하늘과 사막 교역로의 유목 전통이 결합되어 일교차가 덜 가혹한 12월 개최가 지리적으로 타당합니다.',
  successBackground:
    '지방 정부·지역 관광 협동조합·유목민 후손 주민이 협력하여 사막 생태 보전 수칙을 지키며 축제를 운영합니다.',
  regionalEconomicImpact:
    '겨울 비수기 사막 오아시스 마을의 숙박·전통 공예품 소비를 늘려 지역 경제를 살리고 유목 문화 계승에 기여합니다.',
  hashtags: '#사하라사막 #건조기후 #유목문화 #세계축제지리',
  imageUrl: '/src/assets/images/world_albuquerque_balloons_1794616333552.jpg',
  revisionCount: 0,
  createdAt: new Date().toLocaleDateString('ko-KR'),
};

const SEED_GALLERY_CARDS: GroupFestivalPlan[] = [
  {
    id: 'seed-group-2',
    groupName: '2모둠 북유럽탐구',
    festivalName: '트롬쇠 한밤의 태양 합창 페스티벌',
    continent: '유럽',
    country: '노르웨이',
    city: '트롬쇠',
    climateId: 'high-lat-midnight',
    naturalFactor: '위치(고위도)',
    humanFactor: '공연·예술',
    month: 6,
    specialtyFeature:
      '북위 69° 고위도 지역에서 6월 하지 무렵 밤에도 해가 지지 않는 백야 현상을 활용한 야외 음악제',
    experienceContent:
      '자정 피오르 야외 합창 감상, 들꽃 화관 엮기, 북극권 백야 트레킹',
    validityReasonNote:
      '고위도 위치 특성상 긴 겨울이 지나고 찾아오는 6월 백야라는 자연조건과 지역 합창 예술 문화가 결합되어 타당합니다.',
    successBackground:
      '시 정부와 지역 예술 단체가 협력해 친환경 야외 무대를 조성하고 주민과 여행자가 함께 참여합니다.',
    regionalEconomicImpact:
      '여름 단기 관광 수요를 창출하고 북극권 소도시의 문화 예술 이미지를 세계에 알립니다.',
    hashtags: '#고위도백야 #노르웨이 #공연예술축제 #세계축제지리',
    imageUrl: '/src/assets/images/geo_sweden_midsommar_1794616690350.jpg',
    revisionCount: 2,
    createdAt: '수업 예시',
  },
  {
    id: 'seed-group-3',
    groupName: '3모둠 안데스반',
    festivalName: '쿠스코 태양과 알파카 직물 축제',
    continent: '남미',
    country: '페루',
    city: '쿠스코',
    climateId: 'highland-andes',
    naturalFactor: '기후·계절',
    humanFactor: '전통문화',
    month: 6,
    specialtyFeature:
      '해발 3,400m 안데스 고산 기후의 맑은 건기(6월)와 잉카 태양 숭배·알파카 직물 전통이 어우러진 축제',
    experienceContent:
      '전통 태양 의식 행렬 참관, 천연 염색 알파카 직조 체험, 고산 감자 요리 시식',
    validityReasonNote:
      '서늘한 고산 기후에서 보온을 위해 발달한 알파카 목축·직물 문화와 6월 동지 태양제가 연결되어 지리적 타당성이 높습니다.',
    successBackground:
      '원주민 공동체의 전통 장인 기술과 페루 지방 정부의 문화유산 보호 정책이 결합해 지속되고 있습니다.',
    regionalEconomicImpact:
      '전통 수공예 직물 판매와 고산 지역 농산물 소비를 늘려 지역 주민 소득과 문화적 자긍심을 높입니다.',
    hashtags: '#안데스고산기후 #페루쿠스코 #전통문화 #세계축제지리',
    imageUrl: '/src/assets/images/geo_peru_intiraymi_1794616694872.jpg',
    revisionCount: 1,
    createdAt: '수업 예시',
  },
];

const SEED_EVALUATIONS: PeerRubricEvaluation[] = [
  {
    id: 'seed-eval-1',
    targetPlanId: 'seed-group-2',
    evaluatorGroup: '4모둠',
    geoConnectionScore: 3,
    requiredElementsScore: 3,
    culturalRespectComment:
      '북위 69° 고위도의 백야 시기와 6월 개최를 정확히 연결했고, 카드 필수 4요소가 한눈에 보입니다.',
    createdAt: '수업 예시',
  },
  {
    id: 'seed-eval-2',
    targetPlanId: 'seed-group-3',
    evaluatorGroup: '2모둠',
    geoConnectionScore: 3,
    requiredElementsScore: 3,
    culturalRespectComment:
      '고산 기후에서 알파카 목축과 직물이 발달한 인문적 맥락을 잘 짚어 주었습니다.',
    createdAt: '수업 예시',
  },
];

const SEED_RESPECT_NOTES: CultureRespectNote[] = [
  {
    id: 'seed-note-1',
    authorGroup: '2모둠',
    message:
      '사방에 물을 뿌리거나 토마토를 던지는 모습이 처음엔 낯설었지만, 기후와 농산물을 활용한 지혜라는 걸 알고 존중하게 되었습니다.',
    createdAt: '수업 예시',
  },
  {
    id: 'seed-note-2',
    authorGroup: '3모둠',
    message:
      '추운 지방의 눈·얼음 축제와 고산 지방의 태양제처럼 환경에 적응하며 살아온 사람들의 자긍심을 배웠습니다.',
    createdAt: '수업 예시',
  },
  {
    id: 'seed-note-3',
    authorGroup: '4모둠',
    message:
      '다른 나라의 축제를 겉모습만으로 판단하지 않고 자연·인문환경적 배경을 함께 살펴보는 태도를 기르고 싶습니다.',
    createdAt: '수업 예시',
  },
];

interface PersistedLessonState {
  introReflection: string;
  draftPlan: GroupFestivalPlan;
  submittedCards: GroupFestivalPlan[];
  evaluations: PeerRubricEvaluation[];
  respectNotes: CultureRespectNote[];
}

function loadInitialState(): PersistedLessonState {
  try {
    const raw = localStorage.getItem(LESSON_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedLessonState>;
      return {
        introReflection: parsed.introReflection ?? '',
        draftPlan: parsed.draftPlan ?? DEFAULT_DRAFT_PLAN,
        submittedCards:
          Array.isArray(parsed.submittedCards) && parsed.submittedCards.length > 0
            ? parsed.submittedCards
            : SEED_GALLERY_CARDS,
        evaluations:
          Array.isArray(parsed.evaluations) && parsed.evaluations.length > 0
            ? parsed.evaluations
            : SEED_EVALUATIONS,
        respectNotes:
          Array.isArray(parsed.respectNotes) && parsed.respectNotes.length > 0
            ? parsed.respectNotes
            : SEED_RESPECT_NOTES,
      };
    }
  } catch {
    // ignore storage read error
  }
  return {
    introReflection: '',
    draftPlan: DEFAULT_DRAFT_PLAN,
    submittedCards: SEED_GALLERY_CARDS,
    evaluations: SEED_EVALUATIONS,
    respectNotes: SEED_RESPECT_NOTES,
  };
}

export default function App() {
  const [activeStage, setActiveStage] = useState<LessonStage>('intro');

  const initial = useState<PersistedLessonState>(loadInitialState)[0];
  const [introReflection, setIntroReflection] = useState(initial.introReflection);
  const [draftPlan, setDraftPlan] = useState<GroupFestivalPlan>(initial.draftPlan);
  const [submittedCards, setSubmittedCards] = useState<GroupFestivalPlan[]>(
    initial.submittedCards
  );
  const [evaluations, setEvaluations] = useState<PeerRubricEvaluation[]>(
    initial.evaluations
  );
  const [respectNotes, setRespectNotes] = useState<CultureRespectNote[]>(
    initial.respectNotes
  );

  const [modalState, setModalState] = useState<{
    festival: GeoFestival;
    tab: 'analysis' | 'climate';
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const payload: PersistedLessonState = {
        introReflection,
        draftPlan,
        submittedCards,
        evaluations,
        respectNotes,
      };
      localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage write error
    }
  }, [introReflection, draftPlan, submittedCards, evaluations, respectNotes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleSubmitToGallery = (finalPlan: GroupFestivalPlan) => {
    const submittedId =
      finalPlan.id === 'group-draft-1' ? `group-${Date.now()}` : finalPlan.id;
    const cardToStore: GroupFestivalPlan = {
      ...finalPlan,
      id: submittedId,
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };
    setDraftPlan(cardToStore);
    setSubmittedCards((prev) => {
      const exists = prev.some((c) => c.id === cardToStore.id);
      if (exists) {
        return prev.map((c) => (c.id === cardToStore.id ? cardToStore : c));
      }
      return [cardToStore, ...prev];
    });
    setActiveStage('review');
    showToast(`'${cardToStore.festivalName}' SNS 카드가 갤러리에 제출되었습니다.`);
  };

  const navItems: { id: LessonStage; label: string; mobileLabel: string }[] = [
    { id: 'intro', label: '1. 도입 · 비교', mobileLabel: '1.도입' },
    { id: 'inquiry', label: '2. 탐구 · 설계', mobileLabel: '2.탐구' },
    { id: 'apply', label: '3. 적용 · SNS카드', mobileLabel: '3.SNS카드' },
    { id: 'review', label: '4. 정리 · 동료평가', mobileLabel: '4.동료평가' },
    { id: 'atlas', label: '세계 사례 도감', mobileLabel: '사례도감' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1917]">
      {/* Top Bar Contract: Strictly 3 Zones */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-xs border-b border-stone-200 no-print">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark */}
          <button
            type="button"
            onClick={() => setActiveStage('intro')}
            className="text-lg font-bold tracking-tight text-stone-900 font-editorial whitespace-nowrap shrink-0 cursor-pointer"
          >
            세계축제지리
          </button>

          {/* Zone 2: Single-line Navigation Links */}
          <nav
            aria-label="수업 단계 메뉴"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600"
          >
            {navItems.map((item) => {
              const active = activeStage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveStage(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-orange-700 text-stone-900 font-semibold'
                      : 'border-transparent hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              활동지 인쇄
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Compact Nav */}
        <nav
          aria-label="모바일 수업 단계 메뉴"
          className="lg:hidden border-t border-stone-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto"
        >
          {navItems.map((item) => {
            const active = activeStage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveStage(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                  active ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                {item.mobileLabel}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {activeStage === 'intro' && (
          <IntroCompareStage
            festivals={GEO_FESTIVALS}
            introReflection={introReflection}
            onChangeReflection={setIntroReflection}
            onSelectFestival={(festival, tab = 'analysis') =>
              setModalState({ festival, tab })
            }
            onGoToInquiry={() => setActiveStage('inquiry')}
          />
        )}

        {activeStage === 'inquiry' && (
          <InquiryDesignStage
            plan={draftPlan}
            onChangePlan={setDraftPlan}
            onGoToApply={() => setActiveStage('apply')}
          />
        )}

        {activeStage === 'apply' && (
          <ApplySnsStage
            plan={draftPlan}
            onChangePlan={setDraftPlan}
            onSubmitToGallery={handleSubmitToGallery}
            onShowToast={showToast}
          />
        )}

        {activeStage === 'review' && (
          <ReviewGalleryStage
            submittedCards={submittedCards}
            evaluations={evaluations}
            respectNotes={respectNotes}
            onAddEvaluation={(ev) => setEvaluations((prev) => [ev, ...prev])}
            onAddRespectNote={(note) => setRespectNotes((prev) => [note, ...prev])}
            onShowToast={showToast}
          />
        )}

        {activeStage === 'atlas' && (
          <ReferenceAtlasStage
            festivals={GEO_FESTIVALS}
            onSelectFestival={(festival, tab = 'analysis') =>
              setModalState({ festival, tab })
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white mt-12 no-print">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <span>세계축제지리 · 자연환경과 인문환경으로 배우는 세계의 다양한 축제</span>
          <div className="flex flex-wrap items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveStage(item.id)}
                className="hover:text-stone-900 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {modalState && (
        <FestivalGeoModal
          festival={modalState.festival}
          initialTab={modalState.tab}
          onClose={() => setModalState(null)}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-medium shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
