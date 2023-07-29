import { ProfileState } from "./AuthState";
import { IAPItem } from "./LessonState";

export interface PriceBySubscription {
  [T1: string]: number;
  T2: number;
  T3: number;
}

export interface EventItem {
  id: string;
  banner: any;
  name: string;
  desc: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number; // general price
  link: string | null;
  type: string;
  users: ProfileState[];
  going: boolean | null;
  restrict_subscriptions: IAPItem[];
  price_subscriptions: PriceBySubscription | null;
}

export interface RegisterItem {
  id: string;
  event: EventItem;
  has_attend: boolean;
  remark: string;
  stripe_payment_id: string;
  amount: number;
  status: string;
  paid_at: string;
  cancelled_at: string;
  created_at: string;
}

export interface EventState {
  loading: boolean;
  error: boolean;
  data: EventItem[];
  registers: RegisterItem[];
}
