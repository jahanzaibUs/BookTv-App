import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState } from "@states/RootState";
import { Dispatch } from "@store/states/ReduxAction";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<Dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
