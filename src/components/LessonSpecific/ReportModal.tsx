import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  Box,
  Button,
  Heading,
  Text,
  Checkbox,
  HStack,
  FlatList,
} from "native-base";

import Layout from "@styles/Layout";
import IconButton from "@components/IconButton";
import { t } from "@utils/i18n";
import { getReportType } from "@data-fetch/comment";

interface ModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onSubmit: (reasonId: number | null) => void;
}

interface CheckboxItemProps {
  label: string;
  value: boolean;
  onPress?: () => void;
}

function CheckboxItem({ label, value, onPress }: CheckboxItemProps) {
  return (
    <HStack alignItems="center" mb={5}>
      <Checkbox
        value={label}
        isChecked={value}
        accessibilityLabel="checkbox"
        onChange={onPress}
      />
      <Text ml={2}>{label}</Text>
    </HStack>
  );
}

export default function ReportModal({
  isVisible,
  onBackdropPress,
  onSubmit,
}: ModalProps) {
  const [reasonId, setReasonId] = useState<number | null>(null);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getReportType();
      setTypes(data);
    };
    fetch();
  }, []);

  const updateReportReason = (id: number) => {
    if (reasonId === id) {
      setReasonId(null);
    } else {
      setReasonId(id);
    }
  };

  const onModalHide = () => {
    setReasonId(null);
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.4}
      onBackdropPress={onBackdropPress}
      onModalHide={onModalHide}
    >
      <Box
        backgroundColor="white"
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        borderRadius={28}
        width={Layout.scaleWidth(85)}
        minHeight={Layout.scaleHeight(50)}
        py={6}
        px={5}
      >
        <Box position="absolute" right={5} top={5}>
          <IconButton
            name="close"
            family="MaterialCommunityIcons"
            onPress={onBackdropPress}
          />
        </Box>

        <Heading fontSize="2xl" mb={6}>
          {t("Report Comment")}
        </Heading>

        <FlatList
          data={types}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <CheckboxItem
              label={item.name}
              value={reasonId === item.id}
              onPress={() => updateReportReason(item.id)}
            />
          )}
        />

        <Button
          variant="ghost"
          alignSelf="flex-end"
          onPress={() => onSubmit(reasonId)}
          disabled={reasonId === null}
        >
          {t("Report")}
        </Button>
      </Box>
    </Modal>
  );
}
