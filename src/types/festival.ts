export type EnvironmentCategory = '자연환경' | '인문환경';

export type GeoSubFactor =
  | '위치(고위도)'
  | '기후·계절'
  | '지역 특산물'
  | '종교'
  | '전통문화'
  | '공연·예술';

export type ContinentType = '아시아' | '유럽' | '북미' | '남미' | '아프리카·오세아니아';

export type ClimatePresetId =
  | 'high-lat-midnight'
  | 'tropical-monsoon'
  | 'cold-snowy'
  | 'mediterranean'
  | 'temperate-grain'
  | 'arid-desert'
  | 'highland-andes'
  | 'maritime-city';

export interface MonthlyClimatePoint {
  month: number;
  tempC: number;
  rainMm: number;
}

export interface PhotoGeoClue {
  title: string;
  detail: string;
}

export interface GeoFestival {
  id: string;
  title: string;
  subtitle: string;
  environment: EnvironmentCategory;
  subFactor: GeoSubFactor;
  continent: ContinentType;
  country: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  latitudeLabel: string;
  climateZone: string;
  seasonTiming: string;
  festivalMonth: number;
  daylightHoursAtFestival: string;
  imageUrl: string;
  imageAlt: string;
  photoCaption: string;
  photoClues: PhotoGeoClue[];
  coreGeoFactor: string;
  formationChain: {
    step1Condition: string;
    step2HumanResponse: string;
    step3FestivalForm: string;
  };
  successBackground: string;
  regionalImpacts: string[];
  keyActivities: string[];
  monthlyClimate: MonthlyClimatePoint[];
}

export interface GeoQuizQuestion {
  id: string;
  festivalId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GroupFestivalPlan {
  id: string;
  groupName: string;
  festivalName: string;
  continent: ContinentType;
  country: string;
  city: string;
  climateId: ClimatePresetId;
  naturalFactor: '위치(고위도)' | '기후·계절' | '지역 특산물';
  humanFactor: '종교' | '전통문화' | '공연·예술';
  month: number;
  specialtyFeature: string;
  experienceContent: string;
  validityReasonNote: string;
  successBackground: string;
  regionalEconomicImpact: string;
  hashtags: string;
  imageUrl: string;
  customUploadedImage?: string;
  revisionCount: number;
  createdAt: string;
}

export interface ValidityFeedbackItem {
  category: '자연환경 연계' | '인문환경 연계' | '시기·기후 정합성' | '카드 필수요소';
  status: 'pass' | 'warn';
  message: string;
}

export interface ValidityResult {
  isValid: boolean;
  score: number;
  summary: string;
  items: ValidityFeedbackItem[];
}

export interface PeerRubricEvaluation {
  id: string;
  targetPlanId: string;
  evaluatorGroup: string;
  geoConnectionScore: 3 | 2 | 1; // 상(3) 중(2) 하(1)
  requiredElementsScore: 3 | 2 | 1;
  culturalRespectComment: string;
  createdAt: string;
}

export interface CultureRespectNote {
  id: string;
  authorGroup: string;
  message: string;
  createdAt: string;
}
