export interface ProfileState {
  id: number;
  username: string;
  email: string;
  phone: string;
  password?: string;
  referralCode?: string;
  provider?: string;
  avatar: string;
  code: string;
}

export interface Subscription {
  id: string;
  tier: string;
  productId: string;
  orderId: string;
  platform: string;
  created_at: string;
}

export interface AuthState {
  error: null | string;
  authenticated: boolean;
  verified: boolean;
  accessToken: string;
  subscription: [] | Subscription[];
  activeSubscription: string;
  profile: ProfileState;
}
