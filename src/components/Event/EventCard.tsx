import React from "react";
import { TouchableOpacity } from "react-native";
import { Box, Heading, Image, Center, Text, HStack } from "native-base";
import moment from "moment";

import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import { getFileUrl } from "@utils/file";

interface EventCardProps {
  selected: boolean | null;
  imageSource: { url: string; width: number; height: number };
  name: string;
  price: number | null;
  startTime: string;
  onPress?: () => void;
  VIPOnly: boolean;
}

const EventCard = (props: EventCardProps) => {
  const { selected, imageSource, onPress, name, price, startTime, VIPOnly } =
    props;
  const width = Layout.scaleWidth(90);
  const minHeight = Layout.scaleWidth(60);
  const ratioHeight = (width / imageSource.width) * imageSource.height;

  return (
    <TouchableOpacity onPress={onPress}>
      <Box mb={6} borderRadius={12} shadow={1}>
        <Box>
          <Image
            borderTopRadius={12}
            width={width}
            height={ratioHeight > minHeight ? ratioHeight : minHeight}
            source={{ uri: getFileUrl(imageSource?.url) }}
            alt={name}
          />

          <HStack position="absolute" right={4} bottom={4}>
            {!price && (
              <Center
                backgroundColor="white"
                borderRadius={16}
                px={4}
                py={0.5}
                shadow={5}
              >
                <Text fontWeight={800} fontSize="sm" color="#000">
                  {t("Free")}
                </Text>
              </Center>
            )}

            {!!selected && (
              <Center
                backgroundColor="primary.600"
                borderRadius={16}
                px={4}
                py={0.5}
                ml={3}
                shadow={5}
              >
                <Text fontWeight={800} fontSize="sm" color="white">
                  {t("Going")}
                </Text>
              </Center>
            )}
          </HStack>
        </Box>

        <Box
          borderBottomRadius={12}
          _light={{ bg: "white" }}
          _dark={{ bg: "coolGray.700" }}
          height={20}
          p={4}
          pt={2}
        >
          <Heading fontSize="lg" noOfLines={1}>
            {name}
          </Heading>
          <Text fontSize="sm">
            {`${moment(startTime).format("ddd")}, ${moment(startTime).format(
              "LLL"
            )}`}
          </Text>

          {VIPOnly && (
            <Center
              bgColor="gray.700"
              borderRadius={16}
              px={3}
              position="absolute"
              right={4}
              bottom={2}
            >
              <Text fontSize="sm" color="white" fontWeight={600}>
                {t("VIP_ONLY")}
              </Text>
            </Center>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default EventCard;
