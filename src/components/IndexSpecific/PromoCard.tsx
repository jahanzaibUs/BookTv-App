import React from "react";
import { TouchableOpacity } from "react-native";
import { Heading, HStack, Image, Text, VStack } from "native-base";

interface PromoCardProps {
  title: string;
  subtitle?: string;
  imageSource: any;
  backgroundColor?: string | null;
  textColor?: string | null;
  onPress?: () => void;
}

const PromoCard = (props: PromoCardProps) => {
  const { imageSource, title, subtitle, backgroundColor, textColor, onPress } =
    props;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <HStack
        bgColor={backgroundColor || "primary.500"}
        borderRadius={10}
        minHeight={15}
        justifyContent="flex-start"
        alignItems="center"
        p={4}
        my={2}
      >
        {imageSource && (
          <Image
            key={title}
            source={{uri: imageSource?.url }}
            alt="banner"
            height="100%"
            width="20%"
            minHeight="35px"
            resizeMode="contain"
            mx={5}
          />
        )}
        <VStack width={"60%"} px={!imageSource ? 3 : 0}>
          <Heading size="md" color={textColor || "white"}>
            {title}
          </Heading>
          {!!subtitle && (
            <Text color={textColor || "white"} fontWeight={500} mt={2}>
              {subtitle}
            </Text>
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default PromoCard;
