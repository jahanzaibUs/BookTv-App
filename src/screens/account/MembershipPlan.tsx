import React, { useEffect } from "react";
import { Alert, Linking, Platform } from "react-native";
import { Button, ScrollView, useToast } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { useIAP } from "react-native-iap";

import SubscriptionFeature from "@components/Purchase/SubscriptionFeature";
import { t } from "@utils/i18n";
import { getProfile, getUserSubscriptions } from "@selectors/authSelector";
import { getSubscriptionPlans } from "@data-fetch/subscription";
import { processNewPurchase } from "@hooks/IAPManager";
import { setSubscriptionPlan } from "@actions/authAction";
import ROUTES from "@navigation/Routes";

const SUB_SKUS = Platform.select({
  ios: ["MEMBER_1YR", "UPGRADE_T1_T2", "UPGRADE_T1_T3", "UPGRADE_T2_T3"],
  android: ["member_1"],
}) as string[];

const CONSUMABLE_SKUS = Platform.select({
  ios: [],
  android: ["member_t2", "member_t3"],
}) as string[];

interface Props {
  navigation: any;
  route: any;
}

export default function MembershipPlan({ navigation, route }: Props) {
  const toast = useToast();
  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const { activeSubscription } = useSelector(getUserSubscriptions);
  const [plans, setPlans] = React.useState<any>(null);
  const [processing, setProcessing] = React.useState(false);
  const {
    connected,
    products,
    getProducts,
    getSubscriptions,
    requestSubscription,
    requestPurchase,
  } = useIAP();

  useEffect(() => {
    if (connected) {
      getProducts(CONSUMABLE_SKUS);
      getSubscriptions(SUB_SKUS);
    }
  }, [getProducts, getSubscriptions]);

  useEffect(() => {
    getAllSubscriptionPlans();
  }, [route.params]);

  const getAllSubscriptionPlans = async () => {
    const { data } = await getSubscriptionPlans();
    console.log("Server", data);

    let visiblePlans = {};
    const currentPlan = data.find(
      (d: { tier: string }) => d.tier === activeSubscription
    );

    if (route.params && route.params.mode === "renew") {
      visiblePlans = [currentPlan];
      setPlans(visiblePlans);
    } else {
      const plans = data;

      if (activeSubscription && activeSubscription !== "T3") {
        visiblePlans = plans.filter(
          (p: { price: number }) => p.price > currentPlan.price
        );
        setPlans(visiblePlans);
      } else {
        setPlans(plans);
      }
    }
  };

  const subscribe = async (id: string) => {
    console.log("subscribing", id);
    setProcessing(true);
    try {
      const subpurchase = await requestSubscription(id);
      if (subpurchase) {
        const { data, success } = await processNewPurchase(subpurchase);

        if (success && data) {
          const planState = {
            ...data,
            tier: data.subscription.tier,
          };
          dispatch(setSubscriptionPlan(planState));
          navigation.goBack();
        }
      }
    } catch (err) {
      console.log(err);
      toast.show({
        description: t("SUBSCRIBE_ERROR"),
        isClosable: false,
        duration: 2000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const buy = async (id: string) => {
    console.log("buying", id);
    setProcessing(true);
    try {
      const purchase = await requestPurchase(id);
      const { data, success } = await processNewPurchase(purchase);

      if (success && data) {
        const planState = {
          ...data,
          tier: data.subscription.tier,
        };
        // unlock premium features
        console.log("setSubscriptionPlan", planState);
        dispatch(setSubscriptionPlan(planState));
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
      toast.show({
        description: t("PURCHASE_ERROR"),
        isClosable: false,
        duration: 2000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const onSelectPlan = (plan: {
    id: string;
    tier: string;
    productIdIOS: string;
    productIdAndroid: string;
  }) => {
    if (!profile.id) {
      navigation.navigate(ROUTES.SIGNUP);
      return;
    }

    // require basic plan
    if (plan.tier !== "T1" && !activeSubscription) {
      Alert.alert(t("SUBSCRIBE_BASIC_TITLE"), t("SUBSCRIBE_BASIC_SUBTITLE"), [
        {
          text: t("Later"),
          style: "cancel",
        },
        { text: t("Continue"), onPress: () => onSelectPlan(plans[0]) },
      ]);
      return;
    }

    const iosUpgradeId = () => {
      if (plan.tier === "T3") {
        if (activeSubscription === "T2") {
          return "UPGRADE_T2_T3";
        } else {
          return "UPGRADE_T1_T3";
        }
      } else if (plan.tier === "T2") {
        return "UPGRADE_T1_T2";
      }
      return "MEMBER_1YR";
    };
    const id = Platform.OS === "ios" ? iosUpgradeId() : plan.productIdAndroid;

    if (plan.tier === "T1") {
      subscribe(id);
    } else {
      // buy(id);
      navigation.navigate(ROUTES.WEB_PAYMENT, { tier: plan.tier });
    }
  };

  const viewSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    } else {
      Linking.openURL(
        `https://play.google.com/store/account/subscriptions?package=com.booktvhk`
      );
    }
  };

  return (
    <ScrollView flex={1} _contentContainerStyle={{ pt: 5, pb: 10 }}>
      {!!products &&
        !!plans &&
        plans.map((m: any) => (
          <SubscriptionFeature
            key={m.id}
            data={m}
            onPress={() => onSelectPlan(m)}
            isCurrent={m.id === activeSubscription}
            disabledPurchase={activeSubscription === "T3"}
            loading={processing}
          />
        ))}

      {/* {(route.params?.mode === "renew" || !!activeSubscription) && (
        <Button
          // @ts-ignore
          variant="outline"
          mx={5}
          mt={4}
          onPress={() => viewSettings()}
        >
          {t("Manage Subscription")}
        </Button>
      )} */}
    </ScrollView>
  );
}
