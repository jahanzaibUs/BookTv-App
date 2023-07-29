import API, { getError } from "@store/api";

export const postUserComment = async (form: {
  content: string;
  user: { id: number };
  reply_to: number | null;
  lesson_id: string;
}) => {
  try {
    const { data }: any = await API.post(`/lesson-comments`, {
      content: form.content,
      user: form.user.id,
      reply_to: form.reply_to,
      lesson: form.lesson_id,
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};

export const getReportType = async () => {
  try {
    const { data }: any = await API.get(`/report-types`);
    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};

export const postReport = async (form: {
  userId: number;
  commentId: number;
  reasonId: number;
  submitted_by: number;
}) => {
  try {
    const { data }: any = await API.post(`/report-logs`, {
      flag_user: form.userId,
      flag_comment: form.commentId,
      type: form.reasonId,
      submitted_by: form.submitted_by,
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = getError(error);
    return {
      success: false,
      message,
    };
  }
};
