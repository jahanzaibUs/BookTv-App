import { createSelector } from "reselect";

import { RootState } from "../states/RootState";

const getEventState = (state: RootState) => state.event;

export const getEvents = createSelector(getEventState, (eventState) =>
  eventState.data.map((evt) => {
    const joinedRecord = eventState.registers.find(
      (r) => r.event.id === evt.id
    );
    return {
      ...evt,
      going:
        !!joinedRecord &&
        (joinedRecord.status === "registered" ||
          joinedRecord.status === "paid"),
    };
  })
);

export const getBookEvents = createSelector(getEvents, (events) =>
  events.filter((e) => e.type === "book")
);

export const getShareEvents = createSelector(getEvents, (events) =>
  events.filter((e) => e.type === "share")
);

export const getJoinedEvents = createSelector(getEvents, (events) =>
  events.filter((e) => e.going)
);
