import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Heart,
  ImagePlus,
  MapPin,
  MessageCircle,
  RefreshCw,
  Share2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { GroupFestivalPlan } from '../types/festival';
import { matchFestivalVisual } from '../utils/geoValidator';
import { renderSnsCardToPngDataUrl } from '../utils/snsCardRenderer';

interface ApplySnsStageProps {
  plan: GroupFestivalPlan;
  onChangePlan: (next: GroupFestivalPlan) => void;
  onSubmitToGallery: (plan: GroupFestivalPlan) => void;
  onShowToast: (msg: string) => void;
}

export const ApplySnsStage: React.FC<ApplySnsStageProps> = ({
  plan,
  onChangePlan,
  onSubmitToGallery,
  onShowToast,
}) => {
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const visualMatch = matchFestivalVisual(plan);

  const missingRequired = [
    !plan.festivalName.trim() && '축제 이름',
    (!plan.country.trim() || !plan.city.trim()) && '개최 장소',
    !plan.specialtyFeature.trim() && '특색',
    !plan.experienceContent.trim() && '체험 내용',
  ].filter(Boolean) as string[];

  const generateCardImage = async (target: GroupFestivalPlan = plan) => {
    setIsRendering(true);
    try {
      const matched = matchFestivalVisual(target);
      const synced: GroupFestivalPlan = {
        ...target,
        imageUrl: matched.imageUrl,
      };
      const dataUrl = await renderSnsCardToPngDataUrl(synced);
      setGeneratedCardUrl(dataUrl);
    } catch {
      onShowToast('카드 이미지 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    let active = true;
    setIsRendering(true);
    renderSnsCardToPngDataUrl({
      ...plan,
      imageUrl: visualMatch.imageUrl,
    })
      .then((url) => {
        if (active) setGeneratedCardUrl(url);
      })
      .catch(() => {
        // fallback preview still renders cleanly
      })
      .finally(() => {
        if (active) setIsRendering(false);
      });
    return () => {
      active = false;
    };
  }, [
    plan.festivalName,
    plan.country,
    plan.city,
    plan.month,
    plan.specialtyFeature,
    plan.experienceContent,
    plan.successBackground,
    plan.regionalEconomicImpact,
    plan.hashtags,
    plan.groupName,
    plan.customUploadedImage,
    visualMatch.imageUrl,
  ]);

  const handleDownloadPng = async () => {
    setIsRendering(true);
    try {
      const dataUrl =
        generatedCardUrl ??
        (await renderSnsCardToPngDataUrl({
          ...plan,
          imageUrl: visualMatch.imageUrl,
        }));
      const a = document.createElement('a');
      a.href = dataUrl;
      const safeName = (plan.festivalName || '세계축제_SNS카드').replace(/\s+/g, '_');
      a.download = `${safeName}.png`;
      a.click();
      onShowToast('SNS 홍보 카드 이미지(.png)가 저장되었습니다.');
    } finally {
      setIsRendering(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangePlan({
          ...plan,
          customUploadedImage: reader.result,
        });
        onShowToast('모둠이 올린 사진으로 SNS 카드 이미지를 다시 생성했습니다.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (missingRequired.length > 0) {
      onShowToast(`필수 요소(${missingRequired.join(', ')})를 모두 입력해 주세요.`);
      return;
    }
    const finalPlan: GroupFestivalPlan = {
      ...plan,
      imageUrl: visualMatch.imageUrl,
    };
    onSubmitToGallery(finalPlan);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-stone-200 pb-6">
        <p className="text-xs font-medium text-orange-700">
          3단계 · 적용 (교과서 활동 2 정리 & 활동 3 SNS 홍보 카드 자동 생성)
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mt-1">
          축제의 성공 배경·지역 영향을 정리하고 SNS 카드로 완성하기
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-[68ch] leading-relaxed">
          모둠이 기획한 축제의 <strong>성공 배경과 지역 경제·문화적 영향(활동 2)</strong>을
          정리하면, <strong>축제 이름·개최 장소·특색·체험 내용</strong>이 모두 담긴{' '}
          <strong>SNS 홍보 카드 이미지</strong>가 자동으로 생성됩니다.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Activity 2 & Activity 3 Text Refinement */}
        <section className="lg:col-span-6 space-y-6">
          {/* Textbook Activity 2 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  교과서 활동 2 · 성공 배경과 지역 경제 영향 정리
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  우리 모둠의 축제가 지속 가능하고 지역에 기여하려면 어떤 요소가 필요할까요?
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChangePlan({
                    ...plan,
                    successBackground:
                      plan.successBackground ||
                      '지방 정부, 지역 기업, 주민이 협력하여 축제를 준비하고, 지역의 자연환경과 안전·환경 보전을 함께 고려했습니다.',
                    regionalEconomicImpact:
                      plan.regionalEconomicImpact ||
                      '지역의 농특산물·숙박·외식 등 생산 및 소비 활동을 활성화해 지역 경제가 성장하고, 주민 화합과 지역 브랜드 이미지가 개선됩니다.',
                  })
                }
                className="text-xs font-medium text-orange-700 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                교과서 예시 채우기
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                (1) 축제의 성공 배경 (지방 정부·주민 협력 및 환경 고려)
              </label>
              <textarea
                rows={3}
                value={plan.successBackground}
                onChange={(e) =>
                  onChangePlan({ ...plan, successBackground: e.target.value })
                }
                placeholder="예: 지방 정부·기업·주민이 협력하여 축제를 기획하고, 지역 생태·환경 보전과 방문객 안전을 고려해 지속 가능하게 운영합니다."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                (2) 축제가 지역 경제 및 공동체에 끼친 긍정적 영향
              </label>
              <textarea
                rows={3}
                value={plan.regionalEconomicImpact}
                onChange={(e) =>
                  onChangePlan({ ...plan, regionalEconomicImpact: e.target.value })
                }
                placeholder="예: 지역 특산물 소비와 숙박·관광 매출 증가로 지역 경제가 활성화되고, 주민들의 문화적 자긍심과 공동체 화합이 높아집니다."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {/* Textbook Activity 3 Checklist & Customization */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-stone-900 pb-3 border-b border-stone-100">
              교과서 활동 3 · SNS 홍보 카드 필수 4요소 점검
            </h2>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { label: '1. 축제 이름', ok: Boolean(plan.festivalName.trim()) },
                {
                  label: '2. 개최 장소',
                  ok: Boolean(plan.country.trim() && plan.city.trim()),
                },
                { label: '3. 축제의 특색', ok: Boolean(plan.specialtyFeature.trim()) },
                { label: '4. 체험 내용', ok: Boolean(plan.experienceContent.trim()) },
              ].map((req) => (
                <div
                  key={req.label}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    req.ok
                      ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                      : 'border-amber-200 bg-amber-50/60 text-amber-900'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      req.ok ? 'text-emerald-700' : 'text-amber-600'
                    }`}
                  />
                  <span className="font-medium">{req.label}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                SNS 해시태그
              </label>
              <input
                type="text"
                value={plan.hashtags}
                onChange={(e) => onChangePlan({ ...plan, hashtags: e.target.value })}
                placeholder="#세계축제지리 #자연환경 #인문환경"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] text-sm text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-200 bg-[#FAF9F6] hover:border-stone-400 text-xs font-medium text-stone-800 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>직접 찾은 사진 올리기</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {plan.customUploadedImage && (
                <button
                  type="button"
                  onClick={() =>
                    onChangePlan({ ...plan, customUploadedImage: undefined })
                  }
                  className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  자동 매칭 사진으로 되돌리기
                </button>
              )}

              <button
                type="button"
                onClick={() => generateCardImage(plan)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:border-stone-500 text-xs font-medium text-stone-800 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRendering ? 'animate-spin' : ''}`} />
                <span>SNS 카드 이미지 재생성</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right: Auto-Generated SNS Card Preview + Download + Submit */}
        <section className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Simulated SNS Post Header */}
            <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  지리
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {plan.groupName || '우리 모둠'}
                  </p>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-700" />
                    <span>
                      {plan.country} {plan.city} · {plan.month}월
                    </span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-orange-700">
                {plan.naturalFactor} × {plan.humanFactor}
              </span>
            </div>

            {/* Rendered High-Res PNG Card Image or Live Mirror */}
            <div className="relative bg-stone-100">
              {generatedCardUrl ? (
                <img
                  src={generatedCardUrl}
                  alt={`${plan.festivalName} 자동 생성 SNS 홍보 카드`}
                  className="w-full h-auto block"
                />
              ) : (
                <div className="aspect-[4/5] flex flex-col items-center justify-center text-stone-500 gap-2 p-8">
                  <ImagePlus className="w-8 h-8" />
                  <p className="text-xs">SNS 카드 이미지를 생성하고 있습니다…</p>
                </div>
              )}

              {isRendering && (
                <div className="absolute inset-0 bg-white/65 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-700 animate-pulse" />
                  <p className="text-xs font-semibold text-stone-900">
                    고해상도 SNS 카드 이미지(.png) 자동 생성 중…
                  </p>
                </div>
              )}
            </div>

            {/* SNS Interaction Footer */}
            <div className="px-5 py-3.5 border-t border-stone-100 flex items-center justify-between text-stone-600">
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>지리 탐구 좋아요</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>동료 평가 대기</span>
                </span>
              </div>
              <Share2 className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-300 bg-white hover:border-stone-500 text-stone-900 text-sm font-medium transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-700" />
              <span>SNS 카드 이미지(.png) 저장</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <span>4단계: 카드 갤러리에 제출하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
