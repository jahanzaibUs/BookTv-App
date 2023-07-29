import React, { useEffect, useState } from "react";
import { PixelRatio, RefreshControl, TouchableOpacity } from "react-native";
import {
  ScrollView,
  Box,
  Heading,
  HStack,
  Text,
  Icon,
  View,
  Button,
  useColorModeValue,
} from "native-base";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import ContentWall from "@components/ContentWall";
import InviteModal from "@components/Mission/InviteModal";
import GiftInviteModal from "@components/Mission/GiftInviteModal";
import QuestInfoModal, {
  QuestInfoType,
} from "@components/Mission/QuestInfoModal";
import UserInfoBox from "@components/User/UserInfoBox";
import { t } from "@utils/i18n";
import { useAppSelector, useAppDispatch } from "@hooks/redux";
import { getProfile, getUserSubscriptions } from "@selectors/authSelector";
import {
  getQuestState,
  getUserMissions,
  getUserRewards,
} from "@selectors/questSelector";
import { fetchRewardByLevel, fetchUserQuest } from "@actions/questAction";
import useToken from "@hooks/useToken";
import { MEMBERSHIPS } from "@constants/membership";
import ROUTES from "@navigation/Routes";

interface Props {
  navigation: any;
}

export default function MissionScreen({ navigation }: Props) {
  const smallTextColor = useColorModeValue("gray.600", "coolGray.200");
  const dispatch = useAppDispatch();
  const token = useToken();
  const profile = useAppSelector(getProfile);
  const { level, totalExp, nextLvExp, currentStreak, giftLog, giftReward } =
    useAppSelector(getQuestState);
  const userMissions = useAppSelector(getUserMissions);
  const userRewards = useAppSelector(getUserRewards);
  const { activeSubscription } = useAppSelector(getUserSubscriptions);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [giftInviteVisible, setGiftInviteVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoType, setInfoType] = useState<{ type: QuestInfoType; id: number }>(
    { type: "level", id: 1 }
  );

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    await dispatch(fetchUserQuest());
    dispatch(fetchRewardByLevel());
  };

  const toggleInfo = (info: {
    type: QuestInfoType;
    level?: number;
    missionId?: number;
  }) => {
    let id = 0;
    if (info.level) {
      id = info.level;
    }
    if (info.missionId) {
      id = info.missionId;
    }
    setInfoType({ type: info.type, id });
    setInfoVisible(!infoVisible);
  };

  const goToRedeem = () => {
    navigation.navigate(ROUTES.REDEEM_GIFT);
  };

  const getMemberClass = () => {
    if (activeSubscription) {
      // @ts-ignore
      return t(MEMBERSHIPS[activeSubscription].name);
    } else if (giftLog.find((g) => moment().isBefore(moment(g.expired_at)))) {
      return "基礎會員";
    }
    return "免費會員";
  };

  const MemberStatus = () => (
    <Box px={4}>
      <Box>
        <HStack justifyContent={"space-between"}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => toggleInfo({ type: "level" })}
          >
            <HStack
              borderWidth={2}
              borderColor="gray.200"
              borderRadius={14}
              px={3}
              py={2}
              mr={1}
            >
              <Icon
                as={<MaterialCommunityIcons name="star-face" />}
                color="primary.300"
              />
              <Box ml={2}>
                <HStack>
                  <Text fontSize="sm" color={smallTextColor}>
                    {t("Level")}
                  </Text>
                  <Icon
                    as={<MaterialCommunityIcons name="comment-question" />}
                    color="gray.300"
                    size="xs"
                    ml={1}
                  />
                </HStack>
                <Text
                  color="primary.600"
                  fontWeight={700}
                  fontSize="2xl"
                  lineHeight={8}
                >
                  LV{level}
                </Text>
              </Box>
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => toggleInfo({ type: "plan" })}
          >
            <HStack
              borderWidth={2}
              borderColor="gray.200"
              borderRadius={14}
              px={3}
              py={2}
              ml={1}
            >
              <Icon
                as={<MaterialCommunityIcons name="face-man-profile" />}
                color="primary.300"
              />
              <Box ml={2}>
                <HStack>
                  <Text fontSize="sm" color={smallTextColor}>
                    {t("Member Level")}
                  </Text>
                  <Icon
                    as={<MaterialCommunityIcons name="comment-question" />}
                    color="gray.300"
                    size="xs"
                    ml={1}
                  />
                </HStack>
                <Text
                  color="primary.600"
                  fontWeight={700}
                  fontSize="lg"
                  lineHeight={8}
                >
                  {getMemberClass()}
                </Text>
              </Box>
            </HStack>
          </TouchableOpacity>
        </HStack>

        <TouchableOpacity onPress={() => toggleInfo({ type: "exp" })}>
          <HStack
            mt={2}
            px={3}
            pt={4}
            pb={2}
            borderWidth={2}
            borderColor="gray.200"
            borderRadius={14}
          >
            <Icon
              as={<MaterialCommunityIcons name="playlist-star" />}
              color="primary.300"
            />
            <HStack>
              <Text fontSize="sm" color={smallTextColor}>
                {t("EXP")}
              </Text>
              <Icon
                as={<MaterialCommunityIcons name="comment-question" />}
                color="gray.300"
                size="xs"
                ml={1}
              />
            </HStack>

            <View flex={1} ml={4} mr={2}>
              <Box backgroundColor="gray.200" borderRadius={20} height={4}>
                <Box
                  backgroundColor="primary.400"
                  borderRadius={20}
                  height="100%"
                  width={`${(totalExp / nextLvExp) * 100}%`}
                />
              </Box>

              <Text fontWeight="600" fontSize="lg" color="primary.600" mt={2}>
                {totalExp}/{nextLvExp} Exp
              </Text>
              <Text fontSize="sm" color={smallTextColor}>
                距離下一級: {nextLvExp - totalExp} Exp
              </Text>
            </View>
          </HStack>
        </TouchableOpacity>
      </Box>
    </Box>
  );

  const GiftWallet = () => {
    const hasReceivedGift = giftLog.length !== 0;

    return (
      <View px={4} mt={10}>
        <Heading fontSize="xl">{t("Gift card")}</Heading>
        {hasReceivedGift ? (
          giftLog.map((g) => (
            <HStack
              key={g.id}
              mt={2}
              px={4}
              py={6}
              borderWidth={2}
              borderColor="gray.200"
              borderRadius={14}
            >
              <Icon
                as={<MaterialCommunityIcons name="gift-outline" />}
                color="lightBlue.600"
              />

              <View flex={1} ml={4}>
                <Text fontWeight="500" fontSize="lg">
                  {g.gift.content}
                </Text>
                <Text fontSize="sm" color={smallTextColor}>
                  {t("GIFT_REMINDER")}
                </Text>
                {moment().isBefore(moment(g.expired_at)) ? (
                  <Text fontWeight="500" color="primary.500" mt={1}>
                    {`到期日: ${moment(g.expired_at).format("ll")}`}
                  </Text>
                ) : (
                  <Text fontWeight="500" color={smallTextColor} mt={1}>
                    已到期
                  </Text>
                )}
              </View>
            </HStack>
          ))
        ) : (
          <TouchableOpacity onPress={() => goToRedeem()}>
            <HStack
              mt={2}
              p={4}
              borderWidth={2}
              borderColor="gray.200"
              borderRadius={14}
            >
              <Icon
                as={<MaterialCommunityIcons name="gift-outline" />}
                color="lightBlue.600"
              />
              <View flex={1} ml={4}>
                <HStack justifyContent="space-between">
                  <Text fontWeight="500" fontSize="lg">
                    {t("REDEEM_CODE_TITLE")}
                  </Text>

                  <Text fontWeight={500} fontSize="md" color="primary.500">
                    {t("REDEEM")}
                  </Text>
                </HStack>

                <Text
                  fontSize="sm"
                  color={smallTextColor}
                  lineHeight="18px"
                  mt={1}
                >
                  {t("REDEEM_CODE_CONTENT")}
                </Text>
              </View>
            </HStack>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const RewardList = () => {
    const giftCard = userRewards.find((r) => r.name === "1");
    const canSendGift = giftCard
      ? giftCard.unlocked && !giftCard.collected
      : false;

    return (
      <View px={4} mt={10}>
        <Heading fontSize="xl">{t("LEVEL_REWARDS")}</Heading>

        {userRewards.map((r, i) => {
          const isFirst = i === 0;
          const isLast = i === userRewards.length - 1;
          return (
            <TouchableOpacity
              key={`${r.id}`}
              onPress={() =>
                toggleInfo({ type: "reward", level: Number(r.name) })
              }
            >
              <HStack
                justifyContent="flex-start"
                alignItems="flex-start"
                borderColor="gray.200"
                borderWidth={2}
                borderBottomWidth={isLast ? 2 : 0}
                borderTopRadius={isFirst ? 14 : 0}
                borderBottomRadius={isLast ? 14 : 0}
                mt={isFirst ? 2 : 0}
                p={3}
              >
                <Text fontWeight={500} fontSize="lg" color="primary.500" mr={4}>
                  LV{r.name}
                </Text>

                <HStack
                  justifyContent="flex-start"
                  width={
                    r.unlocked && PixelRatio.getFontScale() > 1 ? "58%" : "65%"
                  }
                >
                  <Text pr={2}>{r.reward.content}</Text>
                  <Icon
                    as={<MaterialCommunityIcons name="comment-question" />}
                    color="gray.300"
                    size="xs"
                    ml={-1}
                  />
                </HStack>

                {r.unlocked && (
                  <View flex={1}>
                    <Box
                      bgColor={r.collected ? "primary.500" : "gray.600"}
                      borderRadius={10}
                      px={2}
                      ml={3}
                      flex={0}
                    >
                      <Text
                        fontWeight={600}
                        fontSize="sm"
                        color="white"
                        noOfLines={1}
                        textAlign="center"
                      >
                        已獲得
                      </Text>
                    </Box>
                  </View>
                )}
              </HStack>
            </TouchableOpacity>
          );
        })}

        {giftCard?.unlocked && (
          <TouchableOpacity
            onPress={() => setGiftInviteVisible(true)}
            disabled={!canSendGift}
          >
            <HStack
              mt={4}
              p={4}
              borderWidth={2}
              borderColor="gray.200"
              borderRadius={14}
            >
              <Icon
                as={<MaterialCommunityIcons name="gift-outline" />}
                color="lightBlue.700"
              />

              <View flex={1} ml={4}>
                <Text fontWeight="500" fontSize="lg">
                  {giftCard.reward.content}
                </Text>
                <Text fontSize="md" color={smallTextColor} mt={2}>
                  {giftCard.collected ? t("REDEEMED") : t("SEND_GIFT_PROMPT")}
                </Text>
              </View>

              {canSendGift && (
                <Icon as={<Ionicons name="share-social" />} size="sm" />
              )}
            </HStack>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const MissionList = () => (
    <View px={4} mt={10}>
      <Heading fontSize="xl">{t("Mission")}</Heading>

      {userMissions.map((m, i) => {
        const isFirst = i === 0;
        const isLast = i === userMissions.length - 1;
        return (
          <TouchableOpacity
            key={m.icon}
            onPress={() => toggleInfo({ type: "mission", missionId: m.id })}
          >
            <HStack
              justifyContent="space-between"
              alignItems="center"
              borderColor="gray.200"
              borderWidth={2}
              p={4}
              borderBottomWidth={isLast ? 2 : 0}
              borderTopRadius={isFirst ? 14 : 0}
              borderBottomRadius={isLast ? 14 : 0}
              mt={isFirst ? 2 : 0}
            >
              <Icon
                // @ts-ignore
                as={<MaterialCommunityIcons name={m.icon} />}
                color={m.iconColor}
                size="lg"
              />
              <Box flex={2} ml={4}>
                <HStack>
                  <Text fontWeight={500} fontSize="lg">
                    {m.title}
                  </Text>
                  <Icon
                    as={<MaterialCommunityIcons name="comment-question" />}
                    color="gray.300"
                    size="xs"
                    ml={1}
                  />
                </HStack>
                {m.subtitle && (
                  <Text
                    fontSize="sm"
                    color={smallTextColor}
                    lineHeight="18px"
                    width="90%"
                    mt={1}
                  >
                    {m.subtitle}
                  </Text>
                )}
              </Box>

              <Box flex={1}>
                <Text fontWeight={500} fontSize="lg" textAlign="right">
                  {m.value} Exp
                </Text>
                {m.type === "streak" && (
                  <Text fontSize="sm" color={smallTextColor} textAlign="right">
                    {currentStreak.length} 日
                  </Text>
                )}
              </Box>
            </HStack>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (!profile.id) {
    return <ContentWall />;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={fetchData} />
      }
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{ pb: 20 }}
    >
      <UserInfoBox profile={profile} containerProps={{ p: 4, mb: 2 }} />
      <MemberStatus />
      <RewardList />
      <GiftWallet />
      <MissionList />

      <Button
        // @ts-ignore
        variant="primary"
        mx={4}
        mt={10}
        onPress={() => setInviteVisible(true)}
      >
        {t("Share Now")}
      </Button>

      <QuestInfoModal
        isVisible={infoVisible}
        onBackdropPress={() => setInfoVisible(false)}
        type={infoType.type}
        infoId={infoType.id}
      />
      <InviteModal
        isVisible={inviteVisible}
        onBackdropPress={() => setInviteVisible(false)}
      />
      <GiftInviteModal
        isVisible={giftInviteVisible}
        onBackdropPress={() => setGiftInviteVisible(false)}
        code={giftReward[0]?.code}
      />
    </ScrollView>
  );
}
