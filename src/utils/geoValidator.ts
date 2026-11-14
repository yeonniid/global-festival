import {
  ClimatePresetId,
  GroupFestivalPlan,
  ValidityFeedbackItem,
  ValidityResult,
} from '../types/festival';

export interface ClimatePresetMeta {
  id: ClimatePresetId;
  label: string;
  description: string;
  recommendedMonths: number[];
  defaultImageUrl: string;
}

export const CLIMATE_PRESETS: ClimatePresetMeta[] = [
  {
    id: 'tropical-monsoon',
    label: '열대 몬순·사바나 기후 (연중 고온, 건기·우기)',
    description: '더위가 절정에 달하는 3~5월 물놀이·과일 수확, 우기 끝 10~11월 야간 등불 축제에 적합',
    recommendedMonths: [3, 4, 5, 10, 11],
    defaultImageUrl: '/src/assets/images/geo_thailand_songkran_1794616691559.jpg',
  },
  {
    id: 'cold-snowy',
    label: '냉대 다설·한랭 기후 (겨울 영하·풍부한 눈/얼음)',
    description: '12~2월의 혹한과 폭설을 활용한 눈 조각·빙설 건축·겨울 스포츠 축제에 적합',
    recommendedMonths: [12, 1, 2],
    defaultImageUrl: '/src/assets/images/world_sapporo_snow_1794616329913.jpg',
  },
  {
    id: 'high-lat-midnight',
    label: '고위도 지역 (북위 60° 이상, 여름 백야)',
    description: '낮이 가장 긴 6월 하지 무렵 야외 백야·태양·초원 축제에 적합',
    recommendedMonths: [6, 7],
    defaultImageUrl: '/src/assets/images/geo_sweden_midsommar_1794616690350.jpg',
  },
  {
    id: 'mediterranean',
    label: '지중해성 기후 (여름 고온건조, 겨울 온난)',
    description: '오렌지·레몬(2~3월)이나 토마토·포도(8~9월) 등 지중해 특산물 축제에 적합',
    recommendedMonths: [2, 3, 7, 8, 9],
    defaultImageUrl: '/src/assets/images/geo_menton_lemon_1794616691155.jpg',
  },
  {
    id: 'temperate-grain',
    label: '서안해양·온대 내륙 기후 (보리·밀·홉·도시문화)',
    description: '수확기(9~10월) 특산물 양조·미식 축제나 쾌적한 여름(7~8월) 공연예술 축제에 적합',
    recommendedMonths: [4, 5, 7, 8, 9, 10],
    defaultImageUrl: '/src/assets/images/world_oktoberfest_munich_1794616333255.jpg',
  },
  {
    id: 'arid-desert',
    label: '건조·스텝 초원 기후 (맑은 하늘·유목 생활)',
    description: '일교차가 크고 맑은 사막·초원 지역에서 말타기·열기구·별빛 유목 축제에 적합',
    recommendedMonths: [5, 6, 7, 9, 10, 12],
    defaultImageUrl: '/src/assets/images/geo_mongolia_naadam_1794616693479.jpg',
  },
  {
    id: 'highland-andes',
    label: '고산 기후 (해발 2,500m 이상, 연중 서늘)',
    description: '건기(5~9월) 맑은 고산 태양 아래 고대 문명·전통 직물·태양 숭배 축제에 적합',
    recommendedMonths: [5, 6, 7, 8, 9],
    defaultImageUrl: '/src/assets/images/geo_peru_intiraymi_1794616694872.jpg',
  },
  {
    id: 'maritime-city',
    label: '온대 항구·역사 도시 환경',
    description: '운하·고성·성당 등 역사적 도시 경관과 종교·공연예술이 어우러진 축제에 적합',
    recommendedMonths: [2, 4, 5, 8, 10],
    defaultImageUrl: '/src/assets/images/geo_venice_carnival_1794616692811.jpg',
  },
];

/**
 * Automatically selects the most realistic documentary photograph matching the group's
 * selected natural/human geography parameters.
 */
export function matchFestivalVisual(plan: Partial<GroupFestivalPlan>): {
  imageUrl: string;
  caption: string;
} {
  if (plan.customUploadedImage) {
    return {
      imageUrl: plan.customUploadedImage,
      caption: '모둠이 직접 등록한 현장 이미지',
    };
  }

  const text =
    `${plan.festivalName ?? ''} ${plan.specialtyFeature ?? ''} ${plan.experienceContent ?? ''} ${plan.country ?? ''}`.toLowerCase();

  // Keyword-guided semantic visual matching across our 16 realistic photographs
  if (text.includes('토마토')) {
    return {
      imageUrl: '/src/assets/images/world_tomatina_spain_1794616332860.jpg',
      caption: '지중해성 기후 농산물 토마토 거리 축제 이미지 자동 매칭',
    };
  }
  if (text.includes('레몬') || text.includes('오렌지') || text.includes('감귤')) {
    return {
      imageUrl: '/src/assets/images/geo_menton_lemon_1794616691155.jpg',
      caption: '지중해성 감귤·레몬 특산물 조형물 이미지 자동 매칭',
    };
  }
  if (text.includes('얼음') || text.includes('빙설') || text.includes('빙하')) {
    return {
      imageUrl: '/src/assets/images/geo_harbin_ice_1794616692404.jpg',
      caption: '한랭 기후 얼음 건축물 빙설제 이미지 자동 매칭',
    };
  }
  if (text.includes('눈') || text.includes('설상') || text.includes('스키')) {
    return {
      imageUrl: '/src/assets/images/world_sapporo_snow_1794616329913.jpg',
      caption: '다설 지역 설상 눈축제 이미지 자동 매칭',
    };
  }
  if (text.includes('열기구') || text.includes('사막') || text.includes('바람') || text.includes('일출')) {
    return {
      imageUrl: '/src/assets/images/world_albuquerque_balloons_1794616333552.jpg',
      caption: '건조 분지·사막 일출 하늘 축제 이미지 자동 매칭',
    };
  }
  if (text.includes('등불') || text.includes('풍등') || text.includes('야경') || text.includes('촛불') || text.includes('디왈리')) {
    if (plan.humanFactor === '종교') {
      return {
        imageUrl: '/src/assets/images/geo_india_diwali_1794616693358.jpg',
        caption: '종교적 등불·빛의 축제 현장 이미지 자동 매칭',
      };
    }
    return {
      imageUrl: '/src/assets/images/hero_world_festival_lanterns_1794616331421.jpg',
      caption: '수변 야간 등불·풍등 축제 이미지 자동 매칭',
    };
  }
  if (text.includes('가면') || text.includes('운하') || text.includes('사순절')) {
    return {
      imageUrl: '/src/assets/images/geo_venice_carnival_1794616692811.jpg',
      caption: '역사 도시 가면 카니발 이미지 자동 매칭',
    };
  }
  if (text.includes('삼바') || text.includes('카니발') || text.includes('퍼레이드')) {
    return {
      imageUrl: '/src/assets/images/world_rio_carnival_1794616331148.jpg',
      caption: '열대 카니발 퍼레이드 현장 이미지 자동 매칭',
    };
  }
  if (text.includes('말') || text.includes('유목') || text.includes('초원') || text.includes('낙타')) {
    return {
      imageUrl: '/src/assets/images/geo_mongolia_naadam_1794616693479.jpg',
      caption: '초원 유목 전통문화 현장 이미지 자동 매칭',
    };
  }
  if (text.includes('태양') || text.includes('고산') || text.includes('안데스') || text.includes('석조')) {
    return {
      imageUrl: '/src/assets/images/geo_peru_intiraymi_1794616694872.jpg',
      caption: '고산 문명·태양 의식 현장 이미지 자동 매칭',
    };
  }
  if (text.includes('연극') || text.includes('오페라') || text.includes('음악') || text.includes('오케스트라')) {
    return {
      imageUrl: '/src/assets/images/geo_edinburgh_festival_1794616694957.jpg',
      caption: '역사 성곽 공연예술 페스티벌 이미지 자동 매칭',
    };
  }
  if (text.includes('물') || text.includes('강수') || text.includes('우기')) {
    return {
      imageUrl: '/src/assets/images/geo_thailand_songkran_1794616691559.jpg',
      caption: '열대 계절 물축제 현장 이미지 자동 매칭',
    };
  }
  if (text.includes('백야') || text.includes('하지') || text.includes('꽃')) {
    return {
      imageUrl: '/src/assets/images/geo_sweden_midsommar_1794616690350.jpg',
      caption: '고위도 백야·들꽃 축제 현장 이미지 자동 매칭',
    };
  }
  if (text.includes('보리') || text.includes('밀') || text.includes('맥주') || text.includes('수확')) {
    return {
      imageUrl: '/src/assets/images/world_oktoberfest_munich_1794616333255.jpg',
      caption: '곡물 특산물 수확 축제 현장 이미지 자동 매칭',
    };
  }

  // Fallback by ClimatePreset + HumanFactor
  if (plan.humanFactor === '공연·예술') {
    return {
      imageUrl: '/src/assets/images/geo_edinburgh_festival_1794616694957.jpg',
      caption: '공연·예술 인문환경 기반 이미지 자동 매칭',
    };
  }
  if (plan.humanFactor === '종교' && plan.continent === '남미') {
    return {
      imageUrl: '/src/assets/images/world_rio_carnival_1794616331148.jpg',
      caption: '남미 종교·카니발 문화 이미지 자동 매칭',
    };
  }

  const preset = CLIMATE_PRESETS.find((c) => c.id === plan.climateId) ?? CLIMATE_PRESETS[0];
  return {
    imageUrl: preset.defaultImageUrl,
    caption: `${preset.label.split(' (')[0]} 환경 맞춤 이미지 자동 매칭`,
  };
}

/**
 * Validates geographic coherence between climate, month, natural factor, human factor,
 * and chosen festival activities so groups receive real geography feedback and revise.
 */
export function validateGroupFestivalPlan(plan: GroupFestivalPlan): ValidityResult {
  const items: ValidityFeedbackItem[] = [];
  const combinedText = `${plan.festivalName} ${plan.specialtyFeature} ${plan.experienceContent}`.toLowerCase();

  // 1. Climate & Month + Activity Coherence (자연환경 연계)
  const coldKeywords = ['눈', '얼음', '빙설', '스키', '썰매', '빙하'];
  const waterKeywords = ['물', '수영', '보트', '해변', '수상'];
  const hasColdActivity = coldKeywords.some((k) => combinedText.includes(k));
  const hasWaterActivity = waterKeywords.some((k) => combinedText.includes(k));

  if (plan.climateId === 'tropical-monsoon' && hasColdActivity) {
    items.push({
      category: '자연환경 연계',
      status: 'warn',
      message:
        '열대 몬순 기후는 연중 기온이 높아 눈·얼음 체험이 자연적으로 유지되기 어렵습니다. 물놀이, 과일 수확, 야간 등불 체험으로 수정하거나 기후를 냉대·한랭 기후로 바꿔보세요.',
    });
  } else if (plan.climateId === 'cold-snowy' && ![12, 1, 2, 3].includes(plan.month) && hasColdActivity) {
    items.push({
      category: '시기·기후 정합성',
      status: 'warn',
      message: `선택하신 ${plan.month}월은 북반구 냉대 기후에서도 기온이 영상으로 올라 눈·얼음 축제를 열기 어렵습니다. 개최 시기를 겨울(12~2월)로 조정해 보세요.`,
    });
  } else if (plan.climateId === 'cold-snowy' && hasWaterActivity && [12, 1, 2].includes(plan.month)) {
    items.push({
      category: '시기·기후 정합성',
      status: 'warn',
      message:
        '한겨울(12~2월) 한랭 기후에서는 야외 물뿌리기 체험 시 저체온 위험이 있습니다. 설상·빙상 체험으로 바꾸거나 온천·실내 체험으로 수정해 보세요.',
    });
  } else if (plan.climateId === 'high-lat-midnight' && ![5, 6, 7].includes(plan.month)) {
    items.push({
      category: '시기·기후 정합성',
      status: 'warn',
      message: `고위도 백야 현상은 하지(6월) 전후에 가장 뚜렷합니다. ${plan.month}월은 낮이 짧아 백야를 활용하기 어려우므로 6~7월로 개최 월을 수정해 보세요.`,
    });
  } else if (
    plan.naturalFactor === '지역 특산물' &&
    plan.climateId === 'mediterranean' &&
    ['열대', '한파', '빙설'].some((k) => combinedText.includes(k))
  ) {
    items.push({
      category: '자연환경 연계',
      status: 'warn',
      message:
        '지중해성 기후에는 레몬·오렌지·올리브·포도·토마토 등 수목·원예 작물이 대표 특산물입니다. 기후에 맞는 특산물 체험으로 다듬어 보세요.',
    });
  } else {
    items.push({
      category: '자연환경 연계',
      status: 'pass',
      message: `선택한 기후(${CLIMATE_PRESETS.find((c) => c.id === plan.climateId)?.label.split(' (')[0]})와 ${plan.month}월 개최 시기, ${plan.naturalFactor} 체험이 지리적으로 잘 맞물립니다.`,
    });
  }

  // 2. Human Environment Explanation Check (인문환경 연계)
  if (plan.validityReasonNote.trim().length < 15) {
    items.push({
      category: '인문환경 연계',
      status: 'warn',
      message: `선택한 인문환경(${plan.humanFactor})과 지역 주민의 삶·역사가 축제에 어떻게 녹아들었는지 근거 설명을 15자 이상 구체적으로 작성해 주세요.`,
    });
  } else {
    items.push({
      category: '인문환경 연계',
      status: 'pass',
      message: `${plan.humanFactor} 기반의 인문적 배경과 지역사회 참여 근거가 명확히 서술되었습니다.`,
    });
  }

  // 3. SNS Card 4 Mandatory Elements Check
  const missingElements: string[] = [];
  if (!plan.festivalName.trim()) missingElements.push('축제 이름');
  if (!plan.country.trim() || !plan.city.trim()) missingElements.push('개최 장소');
  if (!plan.specialtyFeature.trim()) missingElements.push('지리적 특색');
  if (!plan.experienceContent.trim()) missingElements.push('체험 내용');

  if (missingElements.length > 0) {
    items.push({
      category: '카드 필수요소',
      status: 'warn',
      message: `SNS 카드 필수 요소 중 [${missingElements.join(', ')}] 항목이 비어 있습니다. 모두 채워 주세요.`,
    });
  } else {
    items.push({
      category: '카드 필수요소',
      status: 'pass',
      message: 'SNS 카드 필수 4요소(축제 이름, 개최 장소, 특색, 체험 내용)가 모두 포함되었습니다.',
    });
  }

  const passCount = items.filter((i) => i.status === 'pass').length;
  const score = Math.round((passCount / items.length) * 100);
  const isValid = passCount === items.length;

  return {
    isValid,
    score,
    summary: isValid
      ? '자연환경·인문환경 조건과 개최 시기, 체험 내용이 지리적으로 타당합니다. 적용 단계로 넘어가 SNS 카드를 생성해 보세요!'
      : '일부 지리적 조건이나 필수 설명을 보완하면 훨씬 탄탄한 축제 기획이 됩니다. 아래 피드백을 반영해 수정해 보세요.',
    items,
  };
}
