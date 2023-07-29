import React from "react";
import { FlatList } from "react-native";

import { LessonComment } from "@store/states/LessonState";
import CommentItem from "./CommentItem";
import useToken from "@hooks/useToken";

interface CommentTreeProps {
  data: LessonComment[];
  level?: number;
  onReplyComment: (comment: LessonComment) => void;
  onReportComment: (comment: LessonComment) => void;
}

export default function CommentTree({
  data,
  level = 0,
  onReplyComment,
  onReportComment,
}: CommentTreeProps) {
  const token = useToken();

  const renderItem = ({ item }: { item: LessonComment }) => (
    <CommentItem
      username={item.user.username}
      avatar={item.user.avatar}
      content={item.content}
      status={item.status}
      createAt={item.created_at}
      deleteAt={item.deleted_at}
      renderReplies={() => (
        <CommentTree
          data={item.replies}
          level={level + 1}
          onReplyComment={onReplyComment}
          onReportComment={onReportComment}
        />
      )}
      level={level}
      onReply={() => onReplyComment(item)}
      onReport={() => onReportComment(item)}
      authenticated={!!token}
    />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `${item.id}`}
      renderItem={renderItem}
    />
  );
}
