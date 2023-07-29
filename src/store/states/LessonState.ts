import { ProfileState } from "./AuthState";
import { EventItem } from "./EventState";
import { NewsItem } from "./NewsState";

export type SearchOption = {
  keyword?: string;
  audio: boolean;
  video: boolean;
  category: string[];
  priceRange: number[];
  sort: string;
};

export type LessonCollection = {
  id: number;
  name: string;
  slug?: string;
};

export type IAPItem = {
  id: number;
  name: string;
  price: number;
  tier: string;
  productIdIOS: string;
  productIdAndroid: string;
};

export interface LessonItem {
  id: string;
  title: string;
  desc: string;
  overview: string;
  lesson_collection: LessonCollection;
  category: LessonCollection;
  creator: string;
  thumbnail: { url: string };
  duration_total?: number;
  price: number;
  bookmark_id: string | null;
  is_feature: boolean;
  is_new: boolean;
  photos: LessonPhoto | null;
  books: LessonDocument[] | null;
  documents: LessonDocument[] | null;
  preview_media: LessonMedia | null;
  banner: UploadFile | null;
  media: LessonMedia[];
  comments: LessonComment[];
  like_users: ProfileState[];
  product: IAPItem | null;
  purchased: boolean;
  author?: string;
  author_desc?: string;
}

export type UploadFile = {
  id: string;
  url: string;
  name: string;
  mime: string;
  ext: string;
};

export type LessonDocument = {
  id: number;
  type?: string;
  title: any;
  file: UploadFile;
};

export type LessonPhoto = {
  id: number;
  files: UploadFile[];
};

export type MediaTrialOption = "none" | "full" | "percent_30";
export type LessonMedia = {
  id: number;
  title: string;
  order: number;
  type: string;
  file: UploadFile;
  url: string;
  duration: number; // millisecond
  timestamp: number; // millisecond
  trial: null | MediaTrialOption;
};

export interface LessonChapter {
  id: number;
  order: number;
  title: string;
  thumbnail?: { url: string };
  url: string;
  duration: number;
  timestamp: number;
  trial: null | MediaTrialOption;
}

export interface LessonCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  is_feature?: boolean;
}

export interface LessonComment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    avatar: any;
  };
  replies: LessonComment[];
  reply_to: string | null;
  status: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface BookmarkItem {
  id: string;
  user: string; // id
  lesson: LessonItem;
  created_at: string;
}

export interface LessonPurchase {
  id: string;
  price: number;
  productId: string;
  orderId: string;
  platform: string;
  lesson: LessonItem;
  created_at: string;
}

export interface BaseList<T> {
  id: string;
  title: string;
  order: number | null;
  data: T;
}

export type LessonList = BaseList<LessonItem[]>;

export type PromoCard = {
  id: string;
  title: string;
  subtitle: string;
  image: { url: string };
  backgroundColor: string | null;
  textColor: string | null;
};

export interface LessonState {
  loading: boolean;
  categories: LessonCategory[];
  free: null | {
    books: BaseList<LessonItem[]>;
    videos: BaseList<LessonItem[]>;
    articles: BaseList<NewsItem[]>;
    notes: BaseList<NewsItem[]>;
  };
  home: null | {
    id: string;
    sections: LessonList[];
    promotions: EventItem[] | NewsItem[];
    subscription_cta: PromoCard;
    free_content: PromoCard;
  };
  bookclub: null | {
    id: string;
    sections: LessonList[];
    promotions: EventItem[] | NewsItem[];
  };
  premiumclub: null | {
    id: string;
    categories: LessonCategory[];
    section: LessonList;
  };
  lessons: LessonItem[];
  courseCount: number;
  bookmarks: BookmarkItem[];
  currentData: LessonItem;
  purchaseHistories: LessonPurchase[];
}
