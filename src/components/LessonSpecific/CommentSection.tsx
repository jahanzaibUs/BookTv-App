import React, { useState } from "react";
import {
  Button,
  Heading,
  View,
  Input,
  Text,
  HStack,
  VStack,
  Actionsheet,
  useDisclose,
  Icon,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import { LessonComment } from "@store/states/LessonState";
import IconButton from "@components/IconButton";
import CommentTree from "./CommentTree";
import ReportModal from "./ReportModal";

export type CommentForm = {
  content: string;
  replyToId: number | null;
};

export type ReportForm = {
  userId: number;
  commentId: number;
  reasonId: number;
};

interface CommentSectionProps {
  onPressReply: () => void;
  onPostComment: (comment: CommentForm) => void;
  onReport: (form: ReportForm) => void;
  showAuthSheet: () => void;
  editable: boolean;
  data: LessonComment[];
}

export default function CommentSection({
  onPressReply,
  onPostComment,
  onReport,
  editable,
  showAuthSheet,
  data,
}: CommentSectionProps) {
  const initialText = "";
  const [commentVal, setCommentVal] = useState(initialText);
  const [replyTarget, setReplyTarget] = useState<LessonComment | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportForm, setReportForm] = useState({
    userId: 0,
    commentId: 0,
    reasonId: 0,
  });
  const [isReportVisible, setReportVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();

  const onReportComment = (comment: LessonComment) => {
    onOpen();
    setReportForm({
      commentId: comment.id,
      userId: comment.user.id,
      reasonId: 0,
    });
  };

  const openReasonModal = () => {
    onClose();
    setReportVisible(true);
  };

  const onSubmitReport = (reasonId: number | null) => {
    setReportVisible(false);
    if (reasonId) {
      let form = {
        ...reportForm,
        reasonId,
      };
      setReportForm(form);
      onReport(form);
    }
  };

  const onReplyComment = (comment: LessonComment) => {
    setReplyTarget(comment);
    onPressReply();
  };

  const onSubmitComment = () => {
    if (!editable) {
      showAuthSheet();
    } else {
      if (commentVal.trim() !== "") {
        // Reset input
        setLoading(true);
        setReplyTarget(null);
        setCommentVal(initialText);

        setTimeout(() => {
          onPostComment({
            content: commentVal,
            replyToId: replyTarget ? replyTarget.id : null,
          });
          setLoading(false);
        }, 900);
      }
    }
  };

  return (
    <View py={10}>
      <Heading size="lg" px={5}>
        {t("Comment")}
      </Heading>

      {!data || data.length === 0 ? (
        <Text px={5} mt={3}>
          {t("COMMENT_PLACEHOLDER")}
        </Text>
      ) : (
        <CommentTree
          data={data}
          onReplyComment={onReplyComment}
          onReportComment={onReportComment}
        />
      )}

      <View my={10} mx={4}>
        <Heading size="md" mb={4}>
          {t("New comment")}
        </Heading>

        {replyTarget && (
          <HStack
            backgroundColor="gray.100"
            p={2}
            borderLeftColor="primary.300"
            borderLeftWidth={5}
            justifyContent="space-between"
          >
            <VStack width={0.8}>
              <Text fontSize="sm" color="amber.600" fontWeight={600}>
                {replyTarget.user.username}
              </Text>
              <Text noOfLines={1} fontSize="sm" color="gray.700">
                {replyTarget.content}
              </Text>
            </VStack>

            <IconButton
              name="x"
              family="Feather"
              onPress={() => setReplyTarget(null)}
            />
          </HStack>
        )}

        <Input
          placeholder={t("Your comment")}
          variant="underlined"
          mb={4}
          value={commentVal}
          onChangeText={(val) => setCommentVal(val)}
          returnKeyLabel="done"
          returnKeyType="done"
          editable={!loading && editable}
        />
        <Button
          isLoading={loading}
          // @ts-ignore
          variant="secondary"
          shadow={0}
          onPress={() => onSubmitComment()}
          disabled={loading || commentVal.trim() === ""}
        >
          {t("Submit")}
        </Button>
      </View>

      <ReportModal
        isVisible={isReportVisible}
        onBackdropPress={() => setReportVisible(false)}
        onSubmit={(id) => onSubmitReport(id)}
      />

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            startIcon={
              <Icon
                as={<MaterialCommunityIcons name="flag-outline" />}
                color="red.500"
                size="sm"
              />
            }
            onPress={() => openReasonModal()}
          >
            {t("Report")}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}
