import { createSelector } from "reselect";
import { RootState } from "../states/RootState";

export const getQuestState = (state: RootState) => state.quest;

export const getUserRewards = createSelector(getQuestState, (questState) => {
  return questState.rewards
    .filter((rw) => rw.reward !== null)
    .map((r) => {
      const log = questState.rewardLog.find((log) => log.reward.id === r.reward.id);

      return {
        ...r,
        unlocked: !!log || false,
        collected: log?.collected || null,
      };
    });
});

export const getUserMissions = createSelector(getQuestState, (questState) => {
  return questState.missions.map((m) => ({
    ...m,
    value: questState.missionSum.find((log) => log.id === m.id)?.exp || 0,
  }));
});
