
import mongoose, { Schema } from 'mongoose';

const BrandInfoSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  productName: { type: String, required: true },
  brandPronounceName: { type: String, required: true },
  isScript: { type: String, required: false, default: 'no' },
  isVideoCaption: { type: String, required: true },
});

const BrandSocialSchema = new Schema({
  tiktokHandle: { type: String, required: true },
  tiktokLink: { type: String, required: true },
  instragramHandle: { type: String, required: true },
  instragramLink: { type: String, required: true },
  othersSocialLink: { type: String, required: true },
});

const VideoInfoSchema = new Schema({
  productName: { type: String, required: true },
  productLink: { type: String, required: true },
  productType: { type: String, required: true },
  videoType: { type: String, required: true },
  videoLink: { type: String, required: true },
  videoLanguage: { type: String, required: true },
  specificWordsOrFeatures: { type: String, required: true },
  specificWordsNotToUse: { type: String, required: true },
  projectGoal: { type: String, required: true },
});

const CharacteristicInfoSchema = new Schema({
  gender: { type: String, required: true },
  ageRange: { type: String, required: true },
  creatorLocation: { type: String, required: true },
  anySpecialRequest: { type: String, required: true },
  targetAudience: { type: String, required: true },
  targetAudienceAgeGroup: { type: String, required: true },
  productSolveForThem: { type: String, required: true },
  topPerformingAdsLast30Days: { type: String, required: true },
});

const AddOnsSchema = new Schema({
  isExtraHook: { type: String, required: true },
  isExtraCta: { type: String, required: true },
  isRowFootagePerConcept: { type: String, required: true },
  isOffSiteFilming: { type: String, required: true },
  isUgc5Photos: { type: String, required: true },
  isExpressDelivery: { type: String, required: true },
  isFilmingEssentials: { type: String, required: true },
  isAdditionalPerson: { type: String, required: true },
});

// const uploads = new Schema({
//   key: { type: String, required: true },
//   url: { type: String, required: true },
// });

const hireCreatorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    brandInfo: { type: BrandInfoSchema, required: true },
    brandSocial: { type: BrandSocialSchema, required: true },
    videoInfo: { type: VideoInfoSchema, required: true },
    characteristicInfo: { type: CharacteristicInfoSchema, required: true },
    addOns: { type: AddOnsSchema, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        'draft',
        'pending',
        'approved',
        'cancel',
        'ongoing',
        'delivered',
        'revision',
        'completed',
      ],
      default: 'draft',
    },
    revisionStatus: {
      type: String,
      required: true,
      enum: ['pending', 'script_requiest', 'cancel', 'accepted'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'Failed'],
      default: 'pending',
    },
    videoCount: { type: Number, required: true, default: 0 },
    revisionCount: { type: Number, default: 1 },
    isForward: { type: Boolean, default: false },
    // creatorId: { type: Schema.Types.ObjectId, ref: 'Creator', required: false },
    // creatorUserId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: false,
    // },
    // creatorPaymentStatus: {
    //   type: String,
    //   required: true,
    //   enum: ['pending', 'paid', 'failed'],
    //   default: 'pending',
    // },
    // creatorPrice: { type: Number, required: false },
    brandPrice: { type: Number, required: false },
    // uploadedFiles: {
    //   type: [uploads],
    //   default: [],
    //   required: false,
    // },
    isScript: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const HireCreator = mongoose.model('HireCreator', hireCreatorSchema);

export default HireCreator;

