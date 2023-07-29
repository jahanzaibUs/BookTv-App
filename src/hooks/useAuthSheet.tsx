import { useCallback } from "react";

import { hideAuthWall, showAuthWall } from "@actions/uiAction";
import { useAppDispatch } from "./redux";

export const useAuthSheet = () => {
  const dispatch = useAppDispatch();

  const show = useCallback(() => {
    dispatch(showAuthWall());
  }, [dispatch]);

  const hide = useCallback(() => {
    dispatch(hideAuthWall());
  }, [dispatch]);

  return {
    show,
    hide,
  };
};
