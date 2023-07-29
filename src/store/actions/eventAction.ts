import moment from "moment";

import { Dispatch } from "@states/ReduxAction";
import API, { getError } from "../api";

/* Action types */

export const FETCH_EVENTS_START = "FETCH_EVENTS_START";
export const FETCH_EVENTS_SUCCESS = "FETCH_EVENTS_SUCCESS";
export const FETCH_REG_EVENTS_SUCCESS = "FETCH_REG_EVENTS_SUCCESS";
export const FETCH_EVENTS_ERROR = "FETCH_EVENTS_ERROR";
export const UPDATE_JOIN_EVENT = "UPDATE_JOIN_EVENT";

/* Actions */

export const fetchEventsStart = () => ({
  type: FETCH_EVENTS_START,
});

export const fetchEventsSuccess = (data: any) => ({
  type: FETCH_EVENTS_SUCCESS,
  payload: data,
});

export const fetchRegdEventsSuccess = (data: any) => ({
  type: FETCH_REG_EVENTS_SUCCESS,
  payload: data,
});

export const updateJoinStatus = (data: any) => ({
  type: UPDATE_JOIN_EVENT,
  payload: data,
});

/* Async actions */

export const fetchEvents = (userId: number) => async (dispatch: Dispatch) => {
  dispatch(fetchEventsStart());
  try {
    const today = moment().format("YYYY-MM-DD");
    const allEvents = API.get(
      `/events?_sort=start_time:ASC&start_time_gt=${today}`
    );
    const eventPromises = [allEvents];

    if (userId) {
      const registeredEvents = API.get(
        `/event-registers?user=${userId}&_sort=id:DESC`
      );
      eventPromises.push(registeredEvents);
    }

    const [eventData, regData] = await Promise.all(eventPromises);
    dispatch(fetchEventsSuccess(eventData.data));
    if (regData) {
      dispatch(fetchRegdEventsSuccess(regData.data));
    }
    return {
      success: true,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};
