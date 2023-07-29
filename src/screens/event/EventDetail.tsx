import React, { useEffect, useState } from "react";
import { Alert, Platform, StatusBar } from "react-native";
import {
  View,
  ScrollView,
  HStack,
  Heading,
  Text,
  Divider,
  Button,
  useToast,
  Center,
  Icon,
  Image,
} from "native-base";
import moment from "moment";
import { useStripe } from "@stripe/stripe-react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import { Feather } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import { onShare } from "@utils/share";
import Spinner from "@components/Spinner";
import HeroImage from "@components/IndexSpecific/HeroImage";
import IconButton from "@components/IconButton";
import AlertModal from "@components/Modal/AlertModal";
import Layout from "@styles/Layout";
import { useAuthSheet } from "@hooks/useAuthSheet";
import { useStripePayment } from "@hooks/useStripePayment";
import useToken from "@hooks/useToken";
import OrderReview from "@components/Modal/OrderReviewModal";
import Markdown from "@components/Markdown";
import {
  fetchEventDetail,
  fetchPaymentSheetParams,
  postEventRegister,
  cancelEventRegister,
} from "@data-fetch/event";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { addLocalNotification } from "@store/actions/notificationAction";
import { updateJoinStatus } from "@store/actions/eventAction";
import { getProfile, getUserSubscriptions } from "@selectors/authSelector";
import { EventItem } from "@store/states/EventState";
import { getUserData } from "@store/actions/authAction";
import { getItem } from "@utils/storage";
import ROUTES from "@navigation/Routes";
import { logEvent, EXP } from "@utils/expLogger";

interface EventDetailProps {
  navigation: any;
  route: any;
}

export default function EventDetail({ navigation, route }: EventDetailProps) {
  const { connected } = useStripePayment();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const toast = useToast();
  const authSheet = useAuthSheet();
  const dispatch = useAppDispatch();
  const token = useToken();
  const profile = useAppSelector(getProfile);
  const { activeSubscription } = useAppSelector(getUserSubscriptions);

  const [paymentIntent, setPaymentIntent] = useState("");
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [event, setEvent] = useState<EventItem>({
    id: "",
    name: "",
    desc: "",
    start_time: "",
    end_time: "",
    location: "",
    price: 0,
    type: "",
    link: "",
    banner: "",
    users: [],
    going: false,
    price_subscriptions: null,
    restrict_subscriptions: [],
  });
  const {
    name,
    desc,
    start_time,
    end_time,
    location,
    price,
    price_subscriptions,
    banner,
    going,
  } = event;

  const entitledPrice =
    activeSubscription && price_subscriptions
      ? price_subscriptions[activeSubscription]
      : Number(event.price);

  useEffect(() => {
    if (route.params.formRes) {
      updateEvent(true);
    }
  }, [route.params.formRes]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = await getItem("userId");
        await dispatch(getUserData(userId));
      } catch (e) {
        console.log(e);
      }
    };
    const fetch = async () => {
      setLoading(true);

      let detail: any = {};
      const { data } = await fetchEventDetail(route.params.id);
      if (data) {
        detail = data;
      }
      setLoading(false);

      if (detail) {
        setEvent({
          ...event,
          id: detail.id,
          name: detail.name,
          desc: detail.desc,
          start_time: detail.start_time,
          end_time: detail.end_time,
          location: detail.location,
          price: detail.price,
          price_subscriptions: detail.price_subscriptions,
          restrict_subscriptions: detail.restrict_subscriptions,
          banner: detail.banner,
          going: detail.going,
          users: detail.users,
          link: detail.link,
        });
      }
    };

    if (token && !profile.id) {
      getUser();
    }
    fetch();
  }, [route.params.id]);

  const openPaymentSheet = async () => {
    setLoading(true);
    const { error } = await presentPaymentSheet();

    if (error) {
      crashlytics().recordError(error as any);
      console.error(`Error code: ${error.code}`, error.message);
      toast.show({
        description: t("TRANSACT_ERROR"),
        isClosable: false,
        duration: 2000,
      });
    } else {
      console.log("Success", "The payment was confirmed successfully");
      updateEvent(true);
    }
    setPaymentSheetEnabled(false);
    setLoading(false);
  };

  // const initializePaymentSheet = async () => {
  //   const { data } = await fetchPaymentSheetParams(event.id);
  //   const { paymentIntentId, paymentIntent, ephemeralKey, customer } = data;

  //   if (connected) {
  //     crashlytics().log("Stripe initPaymentSheet");
  //     const { error } = await initPaymentSheet({
  //       customerId: customer,
  //       customerEphemeralKeySecret: ephemeralKey,
  //       paymentIntentClientSecret: paymentIntent,
  //       applePay: {
  //         merchantCountryCode: "HK",
  //         paymentSummaryItems: [
  //           {
  //             paymentType: "Immediate",
  //             isPending: false,
  //             label: event.name,
  //             amount: `HK$${entitledPrice}`,
  //           },
  //         ],
  //       },
  //       customFlow: false,
  //       merchantDisplayName: "BookTV Limited",
  //       style: "alwaysLight",
  //     });

  //     if (!error) {
  //       setPaymentSheetEnabled(true);
  //       setPaymentIntent(paymentIntentId);
  //     } else {
  //       crashlytics().recordError(error as any);
  //     }
  //   }
  // };

  const sendEventConfirmation = async () => {
    await dispatch(
      addLocalNotification({
        title: `✅ 成功登記 - ${event.name}`,
        data: { id: event.id },
        type: "event",
      })
    );
  };

  const updateEvent = async (going: boolean) => {
    setLoading(true);

    const updateEventStatus = going ? postEventRegister : cancelEventRegister;

    const { success, data } = await updateEventStatus(event.id, {
      amount: entitledPrice,
      stripe_payment_id: paymentIntent,
    });

    if (success) {
      await dispatch(updateJoinStatus(data));
      toast.show({
        description: going ? t("Register Success") : t("Removed"),
        status: "success",
        placement: "top",
        isClosable: false,
        duration: 2000,
      });
      setEvent({
        ...event,
        going,
      });

      if (going) {
        sendEventConfirmation();
      }
    } else {
      toast.show({
        description: going ? t("TRANSACT_ERROR") : t("REFRESH_ERROR"),
        status: "error",
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const onQuitEvent = () => {
    updateEvent(false);
  };

  const registerEvent = () => {
    setReviewModalVisible(false);

    if (!entitledPrice) {
      updateEvent(true);
    } else if (paymentSheetEnabled) {
      setTimeout(() => {
        openPaymentSheet();
      }, 500);
    }
  };

  const handleEvent = () => {
    if (going) {
      Alert.alert(t("EVENT_REMOVE_TITLE"), t("EVENT_REMOVE_MSG"), [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        { text: t("Confirm"), onPress: () => onQuitEvent() },
      ]);
    } else {
      if (!token) {
        authSheet.show();
        return;
      }

      if (
        event.restrict_subscriptions.length !== 0 &&
        !event.restrict_subscriptions.some(
          (sub) => sub.tier === activeSubscription
        )
      ) {
        toggleAlert();
        return;
      }
      // Show payment
      // if (entitledPrice) {
      //   initializePaymentSheet();
      // } else {
      //   setPaymentSheetEnabled(true);
      // }
      // setReviewModalVisible(true);

      // Link to Google form
      navigation.navigate(ROUTES.WEB_EVENT, {
        title: event.name,
        link: event.link,
      });
    }
  };

  const toggleAlert = () => {
    setAlertVisible(!alertVisible);
  };

  const getTopSpace = () => {
    if (Platform.OS === "android") {
      return `${StatusBar.currentHeight}px`;
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
      <Spinner animating={loading} />
      <View>
        {!!banner && (
          <>
            <Image
              source={{ uri: banner.url }}
              alt="blur"
              resizeMode="cover"
              height={getTopSpace()}
              width={Layout.deviceWidth}
              blurRadius={40}
            />
            <HeroImage
              imageSource={banner.url}
              ratio={banner.width / banner.height}
            />
          </>
        )}

        <View px={8} py={4} backgroundColor="amber.100">
          <HStack justifyContent="space-between" alignItems="center">
            <Heading color="black" fontSize="2xl" width="90%">
              {name}
            </Heading>
            <IconButton
              family="Ionicons"
              name="share-social"
              onPress={() =>
                onShare({ message: name, eventId: event.id }, () =>
                  logEvent(EXP.SHARE)
                )
              }
            />
          </HStack>
          <Divider width={12} size={1} my={3} bgColor="black" />
          {event.restrict_subscriptions?.some((sub) => sub.tier === "T3") && (
            <Center
              bgColor="gray.700"
              borderRadius={16}
              px={3}
              position="absolute"
              right={4}
              bottom={4}
            >
              <Text fontSize="sm" color="white" fontWeight={600}>
                {t("VIP_ONLY")}
              </Text>
            </Center>
          )}

          <Text mb={1} color="black">
            {`${t("Date")}: ${
              start_time ? moment(start_time).format("LL") : "TBC"
            }`}
          </Text>
          {!!start_time && (
            <Text mb={1} color="black">
              {`${t("Time")}: ${moment(start_time).format("LT")} - ${moment(
                end_time
              ).format("LT")}`}
            </Text>
          )}
          {!!location && (
            <Text mb={1} color="black">
              {t("Location")}: {location}
            </Text>
          )}
          {!!activeSubscription && !!price_subscriptions && (
            <Text mb={1} color="black">
              {`${t("Price")}: ${
                price_subscriptions[activeSubscription]
                  ? `$${price_subscriptions[activeSubscription]}`
                  : t("Free")
              }`}
            </Text>
          )}
          {!activeSubscription && (
            <Text mb={1} color="black">{`${t("Price")}: ${
              price ? `$${price}` : t("Free")
            }`}</Text>
          )}
        </View>
      </View>

      <View
        p={8}
        borderRightColor="primary.300"
        borderRightWidth={30}
        height="100%"
      >
        <Heading fontSize="md" fontWeight={800} mb={2}>
          {t("About")}
        </Heading>
        <Markdown>{desc}</Markdown>
      </View>

      {!!event.link && (
        <Button
          // @ts-ignore
          variant={going ? "primary" : "secondary"}
          shadow={going ? undefined : 0}
          position="absolute"
          bottom={Layout.scaleHeight(3)}
          alignSelf="center"
          px={45}
          onPress={() => handleEvent()}
          isLoading={loading}
          mb={5}
          startIcon={
            going ? <Icon as={<Feather name="check" />} size="sm" /> : undefined
          }
        >
          {going ? t("Going") : t("Join")}
        </Button>
      )}

      <OrderReview
        item={{
          title: event.name,
          price: entitledPrice,
        }}
        type="event"
        isVisible={reviewModalVisible}
        onBackdropPress={() => {
          setReviewModalVisible(!reviewModalVisible);
        }}
        onPressConfirm={registerEvent}
        disabled={entitledPrice ? !paymentSheetEnabled : false}
      />

      <AlertModal
        isVisible={alertVisible}
        onBackdropPress={toggleAlert}
        title={t("VIP_ONLY")}
        message={t("SUBSCRIPTION_PROMO_TITLE")}
        buttons={[
          {
            label: t("Subscribe"),
            onPress: () => {
              toggleAlert();
              navigation.navigate(ROUTES.ACCOUNT_TAB, {
                initial: false,
                screen: ROUTES.MEMBERSHIP_PLAN,
              });
            },
          },
        ]}
      />
    </ScrollView>
  );
}
