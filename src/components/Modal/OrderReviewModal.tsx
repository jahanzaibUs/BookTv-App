import React from "react";
import Modal from "react-native-modal";
import { Box, Button, Image, Text, HStack, Icon } from "native-base";

import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFileUrl } from "@utils/file";
import { IAPItem, LessonCollection } from "@states/LessonState";

interface BottomSheetProps {
  item: {
    title: string;
    price: number;
    thumbnail?: { url: string };
    lesson_collection?: LessonCollection;
    product?: IAPItem | null;
  };
  type: string;
  isVisible: boolean;
  onBackdropPress: () => void;
  onPressConfirm: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function OrderReview({
  item,
  isVisible,
  type,
  onBackdropPress,
  onPressConfirm,
  loading,
  disabled,
}: BottomSheetProps) {
  const { title, thumbnail, price, lesson_collection, product } = item;

  const getButtonLabel = () => {
    let label = "Confirm Order";

    if (type === "event") {
      if (!price) {
        label = "FreeRegister";
      } else {
        label = "Pay";
      }
    }
    return t(label);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.1}
    >
      <HStack
        justifyContent="space-between"
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.700" }}
        alignSelf="center"
        position="absolute"
        bottom={-20}
        borderTopRadius={28}
        width={Layout.scaleWidth(100)}
        minHeight={180}
        px={3}
        py={8}
      >
        <HStack flex={1}>
          {thumbnail && thumbnail.url !== "" && (
            <Image
              source={{ uri: getFileUrl(thumbnail.url) }}
              alt={"book cover"}
              size="md"
              resizeMode="contain"
            />
          )}
          <Box ml={1}>
            <Text fontSize="md" fontWeight={500} noOfLines={2}>
              {title}
            </Text>

            <Text
              fontSize="sm"
              _light={{ color: "gray.500" }}
              _dark={{ color: "coolGray.300" }}
            >
              {type === "event" ? t("Event") : t("All Chapters")}
            </Text>
            {lesson_collection && (
              <Text fontSize="md" color="primary.500" fontWeight={600} mt={1}>
                {product ? `$${product.price}` : `$${price}`}
              </Text>
            )}
            {type === "event" && (
              <Text fontSize="md" color="primary.500" fontWeight={600} mt={1}>
                {price ? `$${price}` : t("Free")}
              </Text>
            )}
          </Box>
        </HStack>

        <Box>
          <Button
            // @ts-ignore
            variant="secondary"
            shadow={0}
            onPress={onPressConfirm}
            isLoading={loading}
            disabled={disabled}
            endIcon={
              <Icon
                as={<MaterialCommunityIcons name="chevron-right" />}
                size="sm"
                color="yellow.400"
              />
            }
          >
            {getButtonLabel()}
          </Button>
        </Box>
      </HStack>
    </Modal>
  );
}
