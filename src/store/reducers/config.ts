import { ReduxAction } from "../states/ReduxAction";
import { ConfigState } from "../states/ConfigState";
import { UPDATE_APP_CONFIG } from "@actions/configAction";

const initialState: ConfigState = {
  WHATSAPP: "",
  FB: "",
  IG: "",
  YT: "",
  HOMEPAGE: "",
  share_msg: "",
  news_banner: null,
};

const configReducer = (
  state = initialState,
  action: ReduxAction
): ConfigState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_APP_CONFIG: {
      const {
        website_url,
        whatsapp_url,
        facebook_url,
        instagram_url,
        youtube_url,
        ...rest
      } = payload;

      return {
        ...state,
        ...rest,
        HOMEPAGE: website_url,
        WHATSAPP: whatsapp_url,
        FB: facebook_url,
        IG: instagram_url,
        YT: youtube_url,
      };
    }

    default:
      return state;
  }
};

export default configReducer;
