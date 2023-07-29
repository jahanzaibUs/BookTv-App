import { Box, Image, Text } from "native-base";

import { t } from "@utils/i18n";

export default function BrandFooter() {
  return (
    <>
      <Box justifyContent="space-between" alignItems="center" mt={10}>
        <Image
          source={require("@assets/images/icon.png")}
          alt="booktv_logo"
          size="lg"
          borderRadius="20px"
        />
        <Text fontSize="sm" mt={1}>
          {t("APP_NAME")}
        </Text>
      </Box>
      <Box justifyContent="space-between" alignItems="center" mt={10} mb={20}>
        <Image
          source={require("@assets/images/wisdom-seed-logo-min.jpg")}
          alt="wisdeom seed"
          size="lg"
          borderRadius="20px"
        />
        <Text fontSize="sm" mt={1}>
          Powered by Wisdom Seed Limited
        </Text>
      </Box>
    </>
  );
}
