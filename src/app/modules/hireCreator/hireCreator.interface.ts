import { Types } from 'mongoose';

export type TBrandInfo = {
  name: string;
  email: string;
  phone: string;
  websiteUrl: string;
  productName: string;
  brandPronounceName: string;
  isScript: string;
  isVideoCaption: string;
};
export type TBrandSocial = {
  tiktokHandle: string;
  tiktokLink: string;
  instragramHandle: string;
  instragramLink: string;
  othersSocialLink: string;
};
export type TVideoInfo = {
  productName: string;
  productLink: string;
  productType: string;
  videoType: string;
  videoLink: string;
  videoLanguage: string;
  specificWordsOrFeatures: string;
  specificWordsNotToUse: string;
  projectGoal: string;
};

export type TCharacteristicInfo = {
  gender: string;
  ageRange: string;
  creatorLocation: string;
  anySpecialRequest: string;
  targetAudience: string;
  targetAudienceAgeGroup: string;
  productSolveForThem: string;
  topPerformingAdsLast30Days: string;
};

export type TAddOns = {
  isExtraHook: string;
  isExtraCta: string;
  isRowFootagePerConcept: string;
  isOffSiteFilming: string;
  isUgc5Photos: string;
  isExpressDelivery: string;
  isFilmingEssentials: string;
  isAdditionalPerson: string;
};

export type TBrand = {
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  brandInfo: TBrandInfo;
  brandSocial: TBrandSocial;
  videoInfo: TVideoInfo;
  characteristicInfo: TCharacteristicInfo;
  addOns: TAddOns;
  status: string;
  scriptStatus: string;
  paymentStatus: string;
  videoCount: number;
  revisionCount: number;
  isForward: boolean;
  // creatorId?: Types.ObjectId;
  // creatorUserId?: Types.ObjectId;
  // creatorPaymentStatus: string;
  // creatorPrice: number;
  brandPrice: number;
  // uploadedFiles: {
  //   key: string;
  //   url: string;
  // }[];
  isScript: string;
};
