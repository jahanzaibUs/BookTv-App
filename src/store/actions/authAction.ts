import crashlytics from "@react-native-firebase/crashlytics";

import { Dispatch } from "../states/ReduxAction";
import API, { getError } from "../api";
import { updateNotificationSetting } from "./notificationAction";
import { setItem } from "@utils/storage";

/* Action types */

export const SET_USER = "SET_USER";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";
export const LOGOUT = "LOGOUT";
export const SET_SUBSCRIPTION = "SET_SUBSCRIPTION";

/* Actions */

export const setUser = (user: any) => ({
  type: SET_USER,
  payload: { user },
});

export const loginSuccess = (accessToken: string) => ({
  type: LOGIN_SUCCESS,
  payload: { accessToken },
});

export const verifySuccess = () => ({
  type: VERIFY_SUCCESS,
});

export const logoutSuccess = () => ({
  type: LOGOUT,
});

export const setSubscriptionPlan = (
  plan: {
    productId: string;
    tier: string;
  }[]
) => ({
  type: SET_SUBSCRIPTION,
  payload: plan,
});

/* Async actions */

type AuthResponse = {
  data: { jwt: string; user: any };
};

type LoginParams = {
  email: string;
  password: string;
};

type RegisterParams = {
  username: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
};

type OAuthParams = {
  token: string;
  provider: string;
};

export const connect =
  ({ token, provider }: OAuthParams) =>
  async (dispatch: Dispatch) => {
    try {
      const authUrl =
        provider === "apple"
          ? `/auth/apple/callback`
          : `/auth/${provider}/callback`;

      const { data }: AuthResponse = await API.get(
        `${authUrl}?access_token=${token}`
      );
      console.log("connect", data);

      await setItem("jwt", data.jwt);
      await setItem("userId", data.user.id);
      dispatch(loginSuccess(data.jwt));
      dispatch(setUser(data.user));

      return {
        authenticated: true,
        error: null,
      };
    } catch (error: any) {
      crashlytics().recordError(error);
      console.error(error);
      const message = getError(error);
      return {
        authenticated: false,
        error: message,
      };
    }
  };

export const login =
  ({ email, password }: LoginParams) =>
  async (dispatch: Dispatch) => {
    try {
      const { data }: AuthResponse = await API.post("/auth/local", {
        identifier: email,
        password,
      });

      await setItem("jwt", data.jwt);
      await setItem("userId", data.user.id);

      dispatch(loginSuccess(data.jwt));
      dispatch(setUser(data.user));
      return {
        authenticated: true,
        error: null,
      };
    } catch (error: any) {
      crashlytics().recordError(error);
      const message = getError(error);
      return {
        authenticated: false,
        error: message,
      };
    }
  };

export const register =
  ({ username, email, phone, password, referralCode }: RegisterParams) =>
  async (dispatch: Dispatch) => {
    try {
      const { data }: AuthResponse = await API.post("/auth/local/register", {
        username,
        email,
        phone,
        password,
        referral_code: referralCode,
      });

      await setItem("jwt", data.jwt);
      await setItem("userId", data.user.id);

      dispatch(loginSuccess(data.jwt));
      dispatch(setUser(data.user));
      return {
        authenticated: true,
        error: null,
      };
    } catch (error: any) {
      crashlytics().recordError(error);
      const message = getError(error);
      return {
        authenticated: false,
        error: message,
      };
    }
  };

export const logout = () => async (dispatch: Dispatch) => {
  dispatch(logoutSuccess());
};
export const deleteAccount = (id: number) => async (dispatch: Dispatch) => {
  try{
    console.log(id, 'ididididididi')
    const uploadRes: any = await API.delete(`/users/${id}`);
    console.log(uploadRes, 'uploadRes')
    if (uploadRes?.status) {
      dispatch(logout())
    }
  }catch(error){
    console.log(error)
  }
};
export const getUserData = (userId: number) => async (dispatch: Dispatch) => {
  try {
    const getUser = API.get(`/users/${userId}`);
    const getPurchase = API.get(`/subscription-purchases?user=${userId}`);
    const [{ data: user }, { data: subscriptionPurchase }]: any =
      await Promise.all([getUser, getPurchase]);

    dispatch(setUser(user));
    dispatch(setSubscriptionPlan(subscriptionPurchase));
    if (user.settings) {
      dispatch(updateNotificationSetting(user.settings));
    }
    return user;
  } catch (error) {
    const message = getError(error);
    return message;
  }
};

export const updateUserData =
  (userId: number, profile: any) => async (dispatch: Dispatch) => {
    try {
      const { username, password, avatar, phone } = profile;
      const updateProfile: any = { username, phone };

      if (password) {
        updateProfile.password = password;
      }

      // First upload media
      const formData = new FormData();
      if (avatar) {
        formData.append("files", {
          // @ts-ignore
          uri: avatar,
          name: "user-avatar",
          type: "image/png",
        });

        const uploadRes: any = await API.post(`/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (uploadRes.data && uploadRes.data[0]) {
          const imageId = uploadRes.data[0].id;

          updateProfile.avatar = imageId;
        }
      }

      const { data } = await API.put(`/users/${userId}`, updateProfile);
      dispatch(setUser(data));
      return { success: true, data: data };
    } catch (error) {
      const message = getError(error);
      return { success: false, message };
    }
  };

export const confirmCode = (code: string) => async (dispatch: Dispatch) => {
  try {
    const response: any = await API.get(
      `/auth/email-confirmation?confirmation=${code}`
    );
    dispatch(verifySuccess());
    return {
      success: response.status === 200,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
