import {
  LOGIN_SUCCESS,
  SET_USER,
  VERIFY_SUCCESS,
  SET_SUBSCRIPTION,
} from "../actions/authAction";
import { ReduxAction } from "../states/ReduxAction";
import { AuthState } from "../states/AuthState";

const initProfile = {
  id: 0,
  username: "",
  email: "",
  phone: "",
  password: "",
  provider: "",
  avatar: "",
  code: "", // self
  referralCode: "", // from friend
};

const initialState: AuthState = {
  error: null,
  authenticated: false,
  verified: false,
  accessToken: "",
  subscription: [],
  activeSubscription: "",
  profile: initProfile,
};

const authReducer = (state = initialState, action: ReduxAction): AuthState => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        error: null,
        authenticated: true,
        accessToken: payload.accessToken,
      };
    }

    case SET_SUBSCRIPTION: {
      if (payload && payload.tier) {
        return {
          ...state,
          subscription: [...state.subscription, payload],
          activeSubscription: payload.tier,
        };
      }

      if (payload.length) {
        const newSubscription = payload.map((sub: any) => {
          const { subscription, ...subData } = sub;
          return {
            ...subData,
            tier: subscription?.tier,
          };
        });
        const lastIndex = payload.length - 1;
        const active = payload[lastIndex].subscription?.tier;

        return {
          ...state,
          subscription: newSubscription,
          activeSubscription: active,
        };
      }
    }

    case SET_USER: {
      const { id, username, email, provider, avatar, confirmed, code, phone } =
        payload.user;
      return {
        ...state,
        verified: confirmed,
        profile: {
          id,
          username,
          email,
          phone,
          provider,
          avatar: avatar ? avatar.url : "",
          code,
        },
      };
    }

    case VERIFY_SUCCESS: {
      return {
        ...state,
        verified: true,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
