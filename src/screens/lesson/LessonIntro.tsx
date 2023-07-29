import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  View,
  ScrollView,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  useColorMode,
} from "native-base";
import { AVPlaybackStatus, Video } from "expo-av";
import { useIAP } from "react-native-iap";

import { t } from "@utils/i18n";
import { onShare } from "@utils/share";
import ROUTES from "@navigation/Routes";
import { LessonItem, LessonChapter } from "@store/states/LessonState";
import IconButton from "@components/IconButton";
import ActionButton from "@components/LessonSpecific/ActionButton";
import ChapterRow from "@components/Video/ChapterRow";
import AlertModal from "@components/Modal/AlertModal";
import OrderConfirmation from "@screens/order/OrderConfirmation";
import { useAuthSheet } from "@hooks/useAuthSheet";
import { fetchLessonDetail } from "@data-fetch/lesson";
import useToken from "@hooks/useToken";
import { useAppSelector, useAppDispatch } from "@hooks/redux";
import OrderReview from "@components/Modal/OrderReviewModal";
import { getFileUrl } from "@utils/file";
import { getBookmarks } from "@selectors/lessonSelector";
import TabBar from "@components/TabBar";
import HeroImage from "@components/IndexSpecific/HeroImage";
import Layout from "@styles/Layout";
import { updatePlayer } from "@store/actions/playerAction";
import VideoPlayer from "@components/Video/VideoPlayer";
import { processNewPurchase } from "@hooks/IAPManager";
import { setLessonPurchase } from "@store/actions/lessonAction";
import { getUserSubscriptions } from "@store/selectors/authSelector";
import { logEvent, EXP } from "@utils/expLogger";
import { ANDROID_PRODUCTS, IOS_PRODUCTS } from "@constants/purchase";

const LESSON_SKUS = Platform.select({
  ios: IOS_PRODUCTS,
  android: ANDROID_PRODUCTS,
}) as string[];

const TABS = ["LessonOverview", "TableOfContent"];

interface LessonDetailProps {
  navigation: any;
  route: any;
}

export default function LessonIntro({ navigation, route }: LessonDetailProps) {
  const token = useToken();
  const authenticated = !!token;
  const toast = useToast();
  const authSheet = useAuthSheet();
  const dispatch = useAppDispatch();
  const { activeSubscription, isVIP } = useAppSelector(getUserSubscriptions);
  const bookmarkLessons = useAppSelector(getBookmarks);
  const videoRef = useRef<Video | null>(null);
  const { connected, getProducts, requestPurchase } = useIAP();

  const [tabIndex, setTabIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [trialAlertVisible, setTrialAlertVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [videoStatus, setVideoStatus] = useState<any>({
    isPlaying: true,
  });
  const [chapters, setChapters] = useState<LessonChapter[]>([]);
  const [hasTrial, sethasTrial] = useState(true);
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [lesson, setLesson] = useState<LessonItem>({
    id: "",
    title: "",
    desc: "",
    overview: "",
    lesson_collection: { id: 0, name: "" },
    creator: "",
    thumbnail: { url: "" },
    category: { id: 0, name: "" },
    duration_total: 0,
    bookmark_id: null,
    is_feature: false,
    is_new: false,
    price: 0,
    banner: null,
    books: [],
    documents: [],
    photos: null,
    preview_media: null,
    media: [],
    comments: [],
    like_users: [],
    product: null,
    purchased: false,
    author: "",
    author_desc: "",
  });

  useEffect(() => {
    if (connected) {
      getProducts(LESSON_SKUS);
    }
  }, [getProducts]);

  useEffect(() => {
    dispatch(updatePlayer());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          family="MaterialCommunityIcons"
          name="share-variant"
          onPress={() =>
            onShare({ message: lesson.title, lessonId: lesson.id }, () =>
              logEvent(EXP.SHARE, lesson.id)
            )
          }
        />
      ),
    });
  }, [lesson]);

  useEffect(() => {
    const enableAllContent = (collectionId: number) => {
      const enableBookShop = collectionId === 1 && activeSubscription !== "";
      const enableBookClub =
        collectionId === 2 &&
        (activeSubscription === "T2" || activeSubscription === "T3");
      const enableAllCourse = collectionId === 3 && isVIP;

      setIsUnlocked(enableBookShop || enableBookClub || enableAllCourse);
    };

    const fetch = async () => {
      const { success, data } = await fetchLessonDetail(route.params.id);
      if (success && data) {
        const { comments, ...rest } = data;
        const bookmark = bookmarkLessons.find((bm) => bm.id === rest.id);
        setLesson({ ...rest, bookmark_id: bookmark?.bookmark_id });
        enableAllContent(data.lesson_collection.id);

        if (data.media.length !== 0) {
          setChapters(
            // Find upload provider
            data.media
              .map((m: any) => {
                const link = getFileUrl(m.file ? m.file.url : m.url);
                return {
                  id: m.id,
                  order: m.order,
                  title: m.title,
                  type: m.type,
                  trial: m.trial,
                  url: link,
                  duration: m.duration,
                };
              })
              .sort((a: LessonChapter, b: LessonChapter) => a.order - b.order)
          );
          sethasTrial(
            data.media.some((m: any) => m.trial && m.trial !== "none")
          );
        }
      }
    };

    fetch();
  }, [route.params]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }
    setVideoStatus(status);
  };

  const showAuthSheet = () => {
    authSheet.show();
  };

  const onViewLesson = async (options?: { isTrial: boolean }) => {
    let isTrial = false;
    if (options) {
      isTrial = options.isTrial;
    }
    await videoRef.current?.pauseAsync();
    navigation.navigate(ROUTES.LESSON_TAB, {
      screen: ROUTES.VIDEO_LESSON,
      params: { id: lesson.id, isTrial },
    });
  };

  const showOrderReview = () => {
    if (!authenticated) {
      showAuthSheet();
      return;
    }
    console.log(lesson.lesson_collection);
    const enableBookClub =
      lesson.lesson_collection.id === 2 &&
      (activeSubscription === "T2" || activeSubscription === "T3");

    if (!enableBookClub) {
      setTrialAlertVisible(true);
      return;
    }

    setReviewModalVisible(true);
  };

  const getTrialTitle = () => {
    if (lesson.lesson_collection.id === 1) {
      return t("PAID_ONLY");
    }
    if (lesson.lesson_collection.id === 2) {
      return t("UPGRADE_ONLY");
    }
    return t("RESTRICT_CONTENT_TITLE");
  };

  const getTrialMessage = () => {
    if (lesson.lesson_collection.id === 1) {
      return t("SIGNUP_TITLE");
    }
    if (lesson.lesson_collection.id === 2) {
      return t("UPGRADE_ONLY");
    }
    return t("RESTRICT_CONTENT_CONTENT");
  };

  const renderPurchaseButton = () => {
    if (lesson.lesson_collection.id === 1) {
      return (
        <Button
          // @ts-ignore
          variant="primary"
          onPress={() => onUpgrade()}
          px={20}
          mt={6}
        >
          {t("Signup")}
        </Button>
      );
    }
    if (lesson.lesson_collection.id === 2) {
      return (
        <Button
          // @ts-ignore
          variant="primary"
          onPress={() => onUpgrade()}
          px={20}
          mt={6}
        >
          {t("Upgrade")}
        </Button>
      );
    }
    return (
      <View mt={4}>
        <ActionButton
          label={t("Purchase")}
          icon="credit-card-outline"
          editable={false}
          onPress={onPurchase}
          loading={processing}
        />
      </View>
    );
  };

  const buyIAP = async () => {
    try {
      console.log("buying", lesson.product);
      setProcessing(true);
      if (!lesson.product) {
        Alert.alert(t("EMPTY_IAP"));
        return;
      }

      const productId =
        Platform.OS === "ios"
          ? lesson.product.productIdIOS
          : lesson.product.productIdAndroid;
      const purchase = await requestPurchase(productId);

      const { success, data } = await processNewPurchase(purchase, {
        lessonId: lesson.id,
        price: lesson.product.price,
      });

      if (success && data) {
        dispatch(setLessonPurchase(data));
        setLesson({ ...lesson, purchased: true });
        setOrderModalVisible(true);
      } else {
        toast.show({
          description: t("TRANSACT_ERROR"),
          isClosable: false,
          duration: 2000,
        });
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

  const onUpgrade = async () => {
    await videoRef.current?.pauseAsync();
    setTrialAlertVisible(false);
    setReviewModalVisible(false);
    navigation.navigate(ROUTES.SIGNUP);
  };

  const onPurchase = async () => {
    await videoRef.current?.pauseAsync();
    setTrialAlertVisible(false);
    setReviewModalVisible(false);
    buyIAP();
  };

  const LessonTabContent = () => (
    <View px={5}>
      <Text>{lesson.overview}</Text>
    </View>
  );

  const IntroSection = () => (
    <View py={6}>
      {lesson.title !== "" ? (
        <View
          px={5}
          pb={8}
          _light={{ borderBottomColor: "gray.100" }}
          _dark={{ borderBottomColor: "gray.500" }}
          borderBottomWidth={5}
        >
          <HStack justifyContent="space-between" mb={4}>
            <VStack width="85%">
              <Heading fontSize="2xl">{lesson.title}</Heading>
            </VStack>
          </HStack>

          <Text
            mt={-2}
            _light={{ color: "gray.600" }}
            _dark={{ color: "coolGray.200" }}
          >
            {lesson.desc}
            {lesson.duration_total && ` | ${lesson.duration_total}分鐘`}
          </Text>

          {!!lesson.author && (
            <Text
              mt={6}
              fontWeight={600}
              _light={{ color: "gray.600" }}
              _dark={{ color: "coolGray.200" }}
            >
              {lesson.author}
            </Text>
          )}
          {!!lesson.author_desc && (
            <Text
              mt={1}
              _light={{ color: "gray.600" }}
              _dark={{ color: "coolGray.200" }}
            >
              {lesson.author_desc}
            </Text>
          )}
        </View>
      ) : (
        <ActivityIndicator />
      )}

      <TabBar
        labels={TABS}
        selectedIndex={tabIndex}
        onChangeTab={(index) => {
          setTabIndex(index);
        }}
      />
    </View>
  );

  const ChapterTabContent = () => (
    <ScrollView>
      {chapters.map((c: LessonChapter, index: number) => {
        return (
          <ChapterRow
            key={c.id}
            order={c.order}
            title={c.title}
            thumbnail={c.thumbnail}
            trial={c.trial}
            duration={c.duration}
            purchased={lesson.purchased || isUnlocked}
            isLast={index === chapters.length - 1}
          />
        );
      })}
    </ScrollView>
  );

  const BottomPriceButtons = () => {
    if (!lesson.title) {
      return null;
    }

    if (lesson.purchased || isUnlocked) {
      return (
        <View px={5} py={4}>
          <Button
            // @ts-ignore
            variant="primary"
            shadow={0}
            onPress={() => onViewLesson()}
          >
            進入課程
          </Button>
        </View>
      );
    }
    return (
      <HStack px={5} py={4} justifyContent="space-between">
        {hasTrial && (
          <Button
            // @ts-ignore
            variant="secondary"
            shadow={0}
            flex={3}
            mr={5}
            onPress={() => onViewLesson({ isTrial: true })}
          >
            試堂
          </Button>
        )}
        <Button
          // @ts-ignore
          variant="primary"
          flex={6}
          shadow={0}
          onPress={showOrderReview}
          loading={processing}
        >
          {lesson.product ? `購買 $${lesson.product.price}` : `購買`}
        </Button>
      </HStack>
    );
  };

  if (Object.keys(lesson).length === 0) {
    return <ActivityIndicator size="large" />;
  }
  const { colorMode } = useColorMode();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorMode === "dark" ? "#111827" : "white",
      }}
    >
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          minHeight: lesson.preview_media ? Layout.deviceHeight : "85%",
        }}
      >
        {lesson.preview_media && (
          <VideoPlayer
            ref={videoRef}
            onPlaybackStatusUpdate={(status) => onPlaybackStatusUpdate(status)}
            posterSource={{ uri: lesson.thumbnail?.url }}
            autoPlay
            playerStatus={{
              ...videoStatus,
              mode: "video",
              url: lesson.preview_media.url,
            }}
          />
        )}
        {!lesson.preview_media && lesson.banner && (
          <HeroImage imageSource={lesson.banner.url} resizeMode="cover" />
        )}
        <IntroSection />
        {tabIndex === 1 ? <ChapterTabContent /> : <LessonTabContent />}

        <AlertModal
          isVisible={trialAlertVisible}
          onBackdropPress={() => setTrialAlertVisible(!trialAlertVisible)}
          title={getTrialTitle()}
          message={getTrialMessage()}
          renderExtra={() => renderPurchaseButton()}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={orderModalVisible}
          onRequestClose={() => {
            setOrderModalVisible(!orderModalVisible);
          }}
        >
          <OrderConfirmation
            navigation={navigation}
            onDismiss={() => setOrderModalVisible(!orderModalVisible)}
            itemId={lesson.id}
          />
        </Modal>

        <OrderReview
          item={lesson}
          type="lesson"
          isVisible={reviewModalVisible}
          onBackdropPress={() => {
            setReviewModalVisible(!reviewModalVisible);
          }}
          onPressConfirm={onPurchase}
          loading={processing}
        />
      </ScrollView>

      <BottomPriceButtons />
    </SafeAreaView>
  );
}
