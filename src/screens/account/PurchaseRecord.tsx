import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button, Center, FlatList, Text, View } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import RNIap from "react-native-iap";

import ROUTES from "@navigation/Routes";
import TabBar from "@components/TabBar";
import PurchaseItem from "@components/Purchase/PurchaseItem";
import SubscriptionItem from "@components/Purchase/SubscriptionItem";
import PromoCard from "@components/IndexSpecific/PromoCard";
import { getHomeFeed, getUserPurchase } from "@selectors/lessonSelector";
import { getProfile, getUserSubscriptions } from "@selectors/authSelector";
import { setSubscriptionPlan } from "@actions/authAction";
import { LessonItem, LessonPurchase } from "@states/LessonState";
import { t } from "@utils/i18n";
import { MEMBERSHIPS } from "@constants/membership";
import { getPurchasedSubscription } from "@data-fetch/subscription";

interface PurchaseRecordProps {
  navigation: any;
  route: any;
}

export default function PurchaseRecord({
  navigation,
  route,
}: PurchaseRecordProps) {
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const profile = useSelector(getProfile);
  const lessonPurchase = useSelector(getUserPurchase);
  const { activeSubscription, subscriptionHistories } =
    useSelector(getUserSubscriptions);
  const { home } = useSelector(getHomeFeed);

  console.log("server", subscriptionHistories);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getPurchasedSubscription(profile.id);
      dispatch(setSubscriptionPlan(data));
    };

    if (route.params?.refetch) {
      fetch();
    }
  }, [route]);

  const renderPurchaseItem = ({ item }: { item: LessonPurchase }) => (
    <PurchaseItem
      title={item.lesson?.title}
      purchaseAt={item.created_at}
      price={item.price}
      imageSource={item.lesson?.thumbnail.url}
      onPress={() => viewLesson(item.lesson)}
    />
  );

  const viewLesson = (lesson: LessonItem) => {
    if (lesson) {
      navigation.navigate(ROUTES.LESSON_TAB, {
        screen: ROUTES.VIDEO_LESSON,
        params: { id: lesson.id },
      });
    }
  };

  const viewMoreMembership = ({
    plan,
    mode,
  }: {
    plan: string;
    mode?: string;
  }) => {
    navigation.navigate(ROUTES.MEMBERSHIP_PLAN, {
      currentPlan: plan,
      mode,
    });
  };

  const restorePurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      let restoredHistories: any[] = []; // compare with server
      let restoredTitles: string[] = [];

      restoredHistories = subscriptionHistories.filter((sub) =>
        purchases.some((purchase) => purchase.productId === sub.productId)
      );

      restoredHistories.forEach((purchase) => {
        switch (purchase.productId) {
          case "MEMBER_1YR":
          case "member_1":
            restoredTitles.push("優惠會員");
            break;

          case "UPGRADE_T1_T2":
          case "member_2":
            restoredTitles.push("高級會員");
            break;

          case "UPGRADE_T1_T3":
          case "UPGRADE_T2_T3":
          case "member_3":
            restoredTitles.push("VIP會員");
            break;
        }
      });

      await dispatch(setSubscriptionPlan(restoredHistories));

      Alert.alert(
        t("RESTORE_SUCCESS"),
        `${t("RESTORE_SUCCESS_MSG")}: ` + restoredTitles.join(", ")
      );
    } catch (err) {
      console.warn(err);
      Alert.alert(t("RESTORE_ERROR"));
    }
  };

  // Find server record by store-provided productId
  const renderSubscription = () => {
    const T1Sub = subscriptionHistories.find((s) => s.tier === "T1");
    const currentSub = subscriptionHistories.find(
      (s) => s.tier === activeSubscription
    );

    if (currentSub && currentSub.tier) {
      return (
        <>
          <SubscriptionItem
            // @ts-ignore
            title={MEMBERSHIPS[currentSub.tier].name}
            startDate={T1Sub?.created_at}
            upgradeDate={currentSub.created_at}
            onPress={() =>
              viewMoreMembership({
                plan: currentSub.tier,
                mode: "renew",
              })
            }
          />
          {currentSub.tier !== "T3" && (
            <Button
              // @ts-ignore
              variant="primary"
              mx={5}
              mt={8}
              onPress={() => viewMoreMembership({ plan: currentSub.tier })}
            >
              {t("Upgrade Plan")}
            </Button>
          )}
        </>
      );
    }
    return (
      <>
        {!!home && (
          <View px={5}>
            <PromoCard
              imageSource={home.subscription_cta.image}
              title={home.subscription_cta.title}
              subtitle={home.subscription_cta.subtitle}
              backgroundColor={home.subscription_cta.backgroundColor}
              textColor={home.subscription_cta.textColor}
              onPress={() => navigation.navigate(ROUTES.MEMBERSHIP_PLAN)}
            />
          </View>
        )}

        <Button
          // @ts-ignore
          variant="outline"
          mx={5}
          mt={4}
          onPress={() => restorePurchases()}
        >
          {t("Restore Subscription")}
        </Button>
        <Center mt="45%">
          <Text>{t("EMPTY_SUBSCRIBE")}</Text>
        </Center>
      </>
    );
  };

  return (
    <View flex={1} _light={{ bg: "white" }} _dark={{ bg: "coolGray.900" }}>
      <TabBar
        labels={["Membership", "Course"]}
        selectedIndex={tabIndex}
        onChangeTab={(index) => setTabIndex(index)}
      />

      {tabIndex === 0 ? (
        renderSubscription()
      ) : (
        <FlatList
          data={lessonPurchase}
          keyExtractor={(item) => item.id}
          renderItem={renderPurchaseItem}
        />
      )}
    </View>
  );
}
