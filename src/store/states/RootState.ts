import { AuthState } from "./AuthState";
import { ConfigState } from "./ConfigState";
import { LessonState } from "./LessonState";
import { EventState } from "./EventState";
import { NotificationState } from "./NotificationState";
import { UIState } from "./UIState";
import { QuestState } from "./QuestState";
import { PlayerState } from "./PlayerState";

export interface RootState {
  auth: AuthState;
  config: ConfigState;
  lesson: LessonState;
  event: EventState;
  notification: NotificationState;
  ui: UIState;
  quest: QuestState;
  player: PlayerState;
}
