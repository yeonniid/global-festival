import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  Globe2,
  HeartHandshake,
  MapPin,
  MessageSquarePlus,
  Star,
} from 'lucide-react';
import {
  CultureRespectNote,
  GroupFestivalPlan,
  PeerRubricEvaluation,
} from '../types/festival';
import { FestivalImage } from './FestivalImage';
import { renderSnsCardToPngDataUrl } from '../utils/snsCardRenderer';

interface ReviewGalleryStageProps {
  submittedCards: GroupFestivalPlan[];
  evaluations: PeerRubricEvaluation[];
  respectNotes: CultureRespectNote[];
  onAddEvaluation: (ev: PeerRubricEvaluation) => void;
  onAddRespectNote: (note: CultureRespectNote) => void;
  onShowToast: (msg: string) => void;
}

const SCORE_LABELS: Record<3 | 2 | 1, string> = {
  3: '상 (3점)',
  2: '중 (2점)',
  1: '하 (1점)',
};

export const ReviewGalleryStage: React.FC<ReviewGalleryStageProps> = ({
  submittedCards,
  evaluations,
  respectNotes,
  onAddEvaluation,
  onAddRespectNote,
  onShowToast,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(
    submittedCards[0]?.id ?? ''
  );

  // Rubric form state
  const [evaluatorGroup, setEvaluatorGroup] = useState('우리 모둠');
  const [geoConnectionScore, setGeoConnectionScore] = useState<3 | 2 | 1>(3);
  const [requiredElementsScore, setRequiredElementsScore] = useState<3 | 2 | 1>(3);
  const [culturalRespectComment, setCulturalRespectComment] = useState('');

  // Culture respect discussion form state
  const [noteAuthor, setNoteAuthor] = useState('우리 모둠');
  const [noteMessage, setNoteMessage] = useState('');

  const selectedCard =
    submittedCards.find((c) => c.id === selectedCardId) ?? submittedCards[0];

  const cardEvaluations = useMemo(
    () => evaluations.filter((e) => e.targetPlanId === selectedCard?.id),
    [evaluations, selectedCard?.id]
  );

  const getAverageForCard = (planId: string) => {
    const list = evaluations.filter((e) => e.targetPlanId === planId);
    if (list.length === 0) return null;
    const sum = list.reduce(
      (acc, cur) => acc + cur.geoConnectionScore + cur.requiredElementsScore,
      0
    );
    return (sum / (list.length * 2)).toFixed(1);
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;
    if (!culturalRespectComment.trim()) {
      onShowToast('모둠에 전하는 동료 피드백 의견을 작성해 주세요.');
      return;
    }
    onAddEvaluation({
      id: `eval-${Date.now()}`,
      targetPlanId: selectedCard.id,
      evaluatorGroup: evaluatorGroup.trim() || '우리 모둠',
      geoConnectionScore,
      requiredElementsScore,
      culturalRespectComment: culturalRespectComment.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
    });
    setCulturalRespectComment('');
    onShowToast(`'${selectedCard.festivalName}'에 동료 루브릭 평가가 등록되었습니다.`);
  };

  const handleDownloadGalleryCard = async (card: GroupFestivalPlan) => {
    const url = await renderSnsCardToPngDataUrl(card);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.festivalName.replace(/\s+/g, '_')}_SNS카드.png`;
    a.click();
    onShowToast('갤러리 카드 이미지를 PNG로 저장했습니다.');
  };

  const handleSubmitRespectNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;
    onAddRespectNote({
      id: `respect-${Date.now()}`,
      authorGroup: noteAuthor.trim() || '익명 학생',
      message: noteMessage.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
    });
    setNoteMessage('');
    onShowToast('문화 존중 토의 의견이 보드에 추가되었습니다.');
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="border-b border-stone-200 pb-6">
        <p className="text-xs font-medium text-orange-700">
          4단계 · 정리 (SNS 카드 갤러리 순회 동료 평가 & 문화 존중 태도 토의)
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mt-1">
          모둠별 SNS 카드 갤러리와 루브릭 동료 평가
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-[70ch] leading-relaxed">
          다른 모둠의 SNS 카드를 살펴보며 <strong>① 자연·인문환경과 연결한 타당성 설명</strong>과{' '}
          <strong>② 카드 필수 4요소 포함 여부</strong>를 루브릭 기준으로 평가하고, 서로 다른
          지역의 문화를 존중하는 태도를 함께 나누어 봅시다.
        </p>
      </section>

      {/* Gallery Grid + Active Rubric Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Submitted Cards Gallery */}
        <section aria-label="모둠별 SNS 카드 갤러리" className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {submittedCards.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            const avg = getAverageForCard(card.id);
            const reviewCount = evaluations.filter(
              (e) => e.targetPlanId === card.id
            ).length;

            return (
              <article
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`border rounded-2xl bg-white overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-700 ring-2 ring-orange-700/20'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">{card.groupName}</span>
                    <span className="font-mono-num text-stone-500">
                      {avg ? `평점 ${avg} (${reviewCount})` : '평가 대기'}
                    </span>
                  </div>

                  <div className="relative">
                    <FestivalImage
                      src={card.customUploadedImage || card.imageUrl}
                      alt={card.festivalName}
                      title={card.festivalName}
                      aspectClassName="aspect-[16/10]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                      <p className="text-[11px] text-amber-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {card.country} {card.city} · {card.month}월
                        </span>
                      </p>
                      <h2 className="text-sm font-semibold truncate mt-0.5">
                        {card.festivalName}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-orange-700 font-medium">
                      <span>{card.naturalFactor}</span>
                      <span className="text-stone-300">×</span>
                      <span>{card.humanFactor}</span>
                    </div>
                    <p className="text-stone-700 line-clamp-2 leading-relaxed">
                      <strong className="text-stone-900">특색:</strong> {card.specialtyFeature}
                    </p>
                    <p className="text-stone-600 line-clamp-2 leading-relaxed">
                      <strong className="text-stone-900">체험:</strong> {card.experienceContent}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-500">클릭해 루브릭 평가</span>
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDownloadGalleryCard(card);
                    }}
                    className="inline-flex items-center gap-1 text-stone-700 hover:text-orange-700 font-medium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Right: Selected Card Detail & Rubric Evaluation Form */}
        {selectedCard && (
          <aside className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
            <div className="pb-4 border-b border-stone-100">
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                <span>평가 대상 · {selectedCard.groupName}</span>
                <span>수정 {selectedCard.revisionCount}회 반영</span>
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mt-1">
                {selectedCard.festivalName}
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                {selectedCard.continent} · {selectedCard.country} {selectedCard.city} (
                {selectedCard.month}월)
              </p>
            </div>

            {/* Automatic 4-element check + Justification inspection */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1.5">
                <p className="font-semibold text-stone-900">타당성 판단 근거 (자연 × 인문)</p>
                <p className="text-stone-700 leading-relaxed">
                  {selectedCard.validityReasonNote || '작성된 타당성 근거가 없습니다.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1.5">
                <p className="font-semibold text-stone-900">성공 배경 및 지역 경제 영향</p>
                <p className="text-stone-700 leading-relaxed">
                  {selectedCard.regionalEconomicImpact || selectedCard.successBackground}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: '축제 이름', ok: Boolean(selectedCard.festivalName.trim()) },
                  {
                    label: '개최 장소',
                    ok: Boolean(selectedCard.country.trim() && selectedCard.city.trim()),
                  },
                  { label: '특색', ok: Boolean(selectedCard.specialtyFeature.trim()) },
                  { label: '체험 내용', ok: Boolean(selectedCard.experienceContent.trim()) },
                ].map((el) => (
                  <span
                    key={el.label}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                      el.ok ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{el.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Rubric Form */}
            <form onSubmit={handleSubmitEvaluation} className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <ClipboardCheck className="w-4 h-4 text-orange-700" />
                <span>동료 평가 루브릭 입력</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  평가하는 모둠(이름)
                </label>
                <input
                  type="text"
                  value={evaluatorGroup}
                  onChange={(e) => setEvaluatorGroup(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-[#FAF9F6] text-xs text-stone-900"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-800 mb-1.5">
                  평가 기준 1 · 타당성 판단을 자연환경·인문환경과 연결해 설명했는가?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 2, 1] as const).map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setGeoConnectionScore(score)}
                      className={`py-2 rounded-lg border text-xs font-medium cursor-pointer ${
                        geoConnectionScore === score
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-[#FAF9F6] border-stone-200 text-stone-700'
                      }`}
                    >
                      {SCORE_LABELS[score]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-800 mb-1.5">
                  평가 기준 2 · SNS 카드에 필수 요소 4가지가 모두 들어갔는가?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 2, 1] as const).map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRequiredElementsScore(score)}
                      className={`py-2 rounded-lg border text-xs font-medium cursor-pointer ${
                        requiredElementsScore === score
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-[#FAF9F6] border-stone-200 text-stone-700'
                      }`}
                    >
                      {SCORE_LABELS[score]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  칭찬 및 발전 피드백 (문화적 의미 포함)
                </label>
                <textarea
                  rows={2}
                  value={culturalRespectComment}
                  onChange={(e) => setCulturalRespectComment(e.target.value)}
                  placeholder="예: 건조 기후와 유목 문화를 자연스럽게 연결한 점이 인상적이고 카드 필수 요소가 모두 잘 드러납니다."
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-xs text-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-orange-700 hover:bg-orange-800 text-white text-xs font-medium cursor-pointer"
              >
                <Star className="w-3.5 h-3.5" />
                <span>동료 평가 등록하기</span>
              </button>
            </form>

            {/* Existing Evaluations for this Card */}
            {cardEvaluations.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-700">
                  등록된 동료 평가 ({cardEvaluations.length})
                </p>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {cardEvaluations.map((ev) => (
                    <li
                      key={ev.id}
                      className="p-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="font-semibold text-stone-900">
                          {ev.evaluatorGroup}
                        </span>
                        <span className="font-mono-num">
                          지리연계 {SCORE_LABELS[ev.geoConnectionScore]} · 요소{' '}
                          {SCORE_LABELS[ev.requiredElementsScore]}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {ev.culturalRespectComment}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Cultural Diversity & Respect Reflection Board */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-stone-100">
          <HeartHandshake className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              정리 토의 · 다른 지역의 문화를 존중하는 우리의 태도
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              낯설어 보이는 축제의 모습도 그 지역의 기후·지형(자연환경)과 종교·전통(인문환경) 속에서
              오랜 지혜가 쌓여 만들어진 고유한 문화입니다. 오늘 탐구를 통해 느낀 문화 다양성 존중
              태도를 한 줄씩 나누어 봅시다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {respectNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F6] flex flex-col justify-between gap-3"
            >
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                “{note.message}”
              </p>
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-emerald-700" />
                  {note.authorGroup}
                </span>
                <span className="font-mono-num">{note.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmitRespectNote}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <input
            type="text"
            value={noteAuthor}
            onChange={(e) => setNoteAuthor(e.target.value)}
            placeholder="모둠명"
            className="sm:w-36 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs text-stone-900"
          />
          <input
            type="text"
            value={noteMessage}
            onChange={(e) => setNoteMessage(e.target.value)}
            placeholder="다른 지역 축제의 자연·인문적 맥락을 이해하며 느낀 문화 존중의 태도를 적어 보세요..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>의견 남기기</span>
          </button>
        </form>
      </section>
    </div>
  );
};
