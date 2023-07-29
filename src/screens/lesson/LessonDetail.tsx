import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  ActivityIndicator,
  ScrollView as Scroll,
  Modal,
  SafeAreaView,
  Alert,
  BackHandler,
  StatusBar,
} from "react-native";
import {
  View,
  ScrollView,
  HStack,
  VStack,
  Heading,
  Text,
  KeyboardAvoidingView,
  useToast,
  Actionsheet,
  useDisclose,
  Icon,
  Button,
  useColorMode,
} from "native-base";
import { AVPlaybackStatus, PitchCorrectionQuality, Video } from "expo-av";
import { useIAP } from "react-native-iap";
import { Feather } from "@expo/vector-icons";

import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import { onShare } from "@utils/share";
import ROUTES from "@navigation/Routes";
import IconButton from "@components/IconButton";
import ActionButton from "@components/LessonSpecific/ActionButton";
import NoteSection from "@components/LessonSpecific/NoteSection";
import CommentSection, {
  CommentForm,
  ReportForm,
} from "@components/LessonSpecific/CommentSection";
import ChapterRow from "@components/Video/ChapterRow";
import ChapterProgressBar from "@components/Video/ChapterProgressBar";
import VideoPlayer from "@components/Video/VideoPlayer";
import BookPreview from "@components/LessonSpecific/BookPreview";
import AlertModal from "@components/Modal/AlertModal";
import OrderReview from "@components/Modal/OrderReviewModal";
import ImageViewer from "@components/Image/ImageViewer";
import MiniPlayer from "@components/Video/MiniPlayer";
import OrderConfirmation from "@screens/order/OrderConfirmation";
import { useAuthSheet } from "@hooks/useAuthSheet";
import useToken from "@hooks/useToken";
import { processNewPurchase } from "@hooks/IAPManager";
import { useAppSelector, useAppDispatch } from "@hooks/redux";
import { updateLessonProgress, updateLikeUser } from "@data-fetch/lesson";
import { postReport, postUserComment } from "@data-fetch/comment";
import { getProfile, getUserSubscriptions } from "@selectors/authSelector";
import { ProfileState } from "@store/states/AuthState";
import { getBookmarks, getCurrentLesson } from "@selectors/lessonSelector";
import { getPlayerState } from "@selectors/playerSelector";
import {
  addBookmark,
  fetchLessonDetail,
  removeBookmark,
  setLessonPurchase,
} from "@actions/lessonAction";
import { updatePlayer } from "@actions/playerAction";
import { PLAYBACK_SPEED } from "@reducers/player";
import {
  LessonItem,
  LessonChapter,
  LessonComment,
  MediaTrialOption,
} from "@store/states/LessonState";
import { logEvent, EXP } from "@utils/expLogger";
import { getFileUrl } from "@utils/file";
import { ANDROID_PRODUCTS, IOS_PRODUCTS } from "@constants/purchase";

const LESSON_SKUS = Platform.select({
  ios: IOS_PRODUCTS,
  android: ANDROID_PRODUCTS,
}) as string[];

interface LessonDetailProps {
  navigation?: any;
  route?: any;
  isTabBarButton?: boolean;
}

export default function LessonDetail({
  navigation,
  route,
  isTabBarButton,
}: LessonDetailProps) {
  const { colorMode } = useColorMode();
  const { connected, getProducts, requestPurchase, products } = useIAP();
  const currentLesson = useAppSelector(getCurrentLesson);
  const player = useAppSelector(getPlayerState);
  const { activeSubscription, isVIP } = useAppSelector(getUserSubscriptions);
  const videoRef = useRef<Video | null>(null);
  const [chapters, setChapters] = useState<LessonChapter[]>([]);
  const [lesson, setLesson] = useState<LessonItem>(currentLesson);
  const [processing, setProcessing] = React.useState(false);
  const [isUnlocked, setIsUnlocked] = React.useState(false);

  const token = useToken();
  const authenticated = !!token;
  const authSheet = useAuthSheet();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclose();
  const profile = useAppSelector(getProfile);
  const dispatch = useAppDispatch();
  const bookmarkLessons = useAppSelector(getBookmarks);

  const isVideo = route && route.name === ROUTES.VIDEO_LESSON;
  const scrollRef = useRef<Scroll | null>(null);

  const [maxPositionMillis, setMaxPositionMillis] = useState<number | null>(
    null
  );
  const [chapterVisible, setChapterVisible] = useState(false);
  const [trialAlertVisible, setTrialAlertVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [liked, setLike] = useState(false);
  const [tempComments, setTempComments] = useState<LessonComment[]>([]);
  const [imageView, setImageView] = React.useState({
    visible: false,
    index: 0,
  });

  const onGoBack = () => {
    navigation.navigate(ROUTES.HOME_TAB);

    if (!route?.params?.isTrial) {
      updateVideoPlayer("isVisible", true);
    } else {
      videoRef?.current?.stopAsync();
      dispatch(updatePlayer());
      saveLastProgress();
    }
  };

  const saveLastProgress = () => {
    if (
      profile.id &&
      player.chapterId &&
      player.isVisible === false &&
      player.isPlaying === false
    ) {
      console.log("UPDATE TIME");
      updateLessonProgress({
        lessonId: lesson.id,
        mediaId: player.chapterId,
        timestamp: player.positionMillis,
      });
    }
  };

  // Show MiniPlayer on Android back button
  useEffect(() => {
    const backAction = () => {
      onGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: lesson.title,
      });
    }
  }, [lesson]);

  useEffect(() => {
    if (connected) {
      getProducts(LESSON_SKUS);
    }
  }, [getProducts]);

  useEffect(() => {
    if (chapters.length !== 0) {
      updateVideoPlayer("url", chapters[0]?.url);
      videoRef?.current?.playAsync();
    }
  }, [chapters]);

  useEffect(() => {
    updateVideoPlayer("isVisible", false);

    const enableAllContent = (collectionId: number) => {
      const enableBookShop = collectionId === 1 && activeSubscription !== "";
      const enableBookClub =
        collectionId === 2 &&
        (activeSubscription === "T2" || activeSubscription === "T3");
      const enableAllCourse = collectionId === 3 && isVIP;

      setIsUnlocked(enableBookShop || enableBookClub || enableAllCourse);
    };

    const fetch = async () => {
      const { success, data } = await dispatch(
        fetchLessonDetail(route.params.id)
      );
      if (success && data) {
        const { comments, ...rest } = data;
        const likeSelf = rest.like_user
          ? rest.like_users.find((user: ProfileState) => user.id === profile.id)
          : null;
        const bookmark = bookmarkLessons.find((bm) => bm.id === rest.id);

        setLesson({ ...rest, bookmark_id: bookmark?.bookmark_id });
        enableAllContent(data.lesson_collection.id);
        setLike(!!likeSelf);
        setTempComments(comments);

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
                  url: link,
                  duration: m.duration,
                  timestamp: m.timestamp,
                  trial: m.trial,
                };
              })
              .sort((a: LessonChapter, b: LessonChapter) => a.order - b.order)
          );
          await dispatch(
            updatePlayer({
              chapterId: 0,
              chapterIndex: 0,
              url: chapters[0]?.url,
            })
          );
        } else if (isVideo) {
          toast.show({
            description: t("VIDEO_ERROR"),
            isClosable: false,
            duration: 2000,
          });
        }
      }
    };

    if (route && route.params) {
      fetch();

      // show subscription promot if trial
      if (route.params?.isTrial) {
        setTimeout(() => {
          setTrialAlertVisible(true);
        }, 1500);
      }
    }
  }, [route]);

  useEffect(() => {
    onTogglePlay();
  }, [player.isVisible, player.isPlaying]);

  const onTogglePlay = async () => {
    if (videoRef && videoRef.current) {
      if (player.isPlaying) {
        await videoRef.current.playAsync();
      } else {
        await videoRef.current.pauseAsync();
      }
    }
  };
  const updateVideoPlayer = async (state: string, value: any) => {
    await dispatch(updatePlayer({ [state]: value }));
  };

  const toggleChapter = () => {
    setChapterVisible(!chapterVisible);
  };

  const onSelectChapter = async ({
    chapterId,
    chapterIndex,
    timestamp,
  }: any) => {
    await dispatch(
      updatePlayer({
        chapterId,
        chapterIndex,
        url: chapters[chapterIndex]?.url,
      })
    );
    toggleChapter();

    if (videoRef && videoRef.current) {
      await videoRef.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      });

      setTimeout(() => {
        videoRef?.current?.playAsync();
      }, 500);
    }
  };

  const onScrollToBottom = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  const onViewBook = () => {
    if (lesson.books && lesson.books.length !== 0) {
      const book = lesson.books[0];
      onViewPdf(book.file.url);
    }
  };

  const onViewPdf = (url: string) => {
    navigation.navigate(ROUTES.PDF_READER, { url });
  };

  const onPressChapter = async (
    chapterId: number,
    chapterIndex: number,
    timestamp: number,
    trial: MediaTrialOption | null
  ) => {
    const unlocked =
      isUnlocked ||
      lesson.purchased ||
      trial === "full" ||
      trial?.includes("percent");

    if (unlocked) {
      onSelectChapter({ chapterId, chapterIndex, timestamp });

      // Save video position
      if (profile.id) {
        updateLessonProgress({
          lessonId: lesson.id,
          mediaId: chapterId,
          timestamp,
        });
      }
    } else {
      setTrialAlertVisible(true);
    }
  };

  const setTrialTime = async (status: AVPlaybackStatus) => {
    if (isUnlocked || lesson.purchased || !status.isLoaded) {
      return;
    }
    const trialType = chapters[player.chapterIndex]?.trial;
    if (trialType && status.durationMillis) {
      const isPartialTrial = trialType.includes("percent");
      const percent = isPartialTrial ? Number(trialType.split("_")[1]) : 100;
      const maxMillis = (status.durationMillis * percent) / 100;

      console.log({
        trialType,
        maxMillis,
        total: status.durationMillis,
      });
      setMaxPositionMillis(maxMillis);
    }
  };

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }
    if (status.didJustFinish) {
      onVideoEnd();
    }

    // TODO -  disable seek
    if (
      maxPositionMillis !== null &&
      status.positionMillis >= maxPositionMillis
    ) {
      await videoRef?.current?.stopAsync();
      setTrialAlertVisible(true);
      dispatch(updatePlayer({ isPlaying: false }));
      return;
    }

    if (player.url !== "") {
      dispatch(
        updatePlayer({
          isPlaying: player.isVisible ? player.isPlaying : status.isPlaying,
          durationMillis: status.durationMillis,
          positionMillis: status.positionMillis,
        })
      );
    }
  };

  const onVideoEnd = async () => {
    if (isUnlocked && player.chapterIndex !== chapters.length - 1) {
      const nextIndex = player.chapterIndex + 1;
      await dispatch(
        updatePlayer({
          chapterIndex: nextIndex,
          url: chapters[nextIndex]?.url,
          positionMillis: 0,
        })
      );

      await videoRef?.current?.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      });
      setTimeout(() => {
        videoRef?.current?.playAsync();
      }, 900);
    }
  };

  const showAuthSheet = () => {
    authSheet.show();
  };

  const showOrderReview = () => {
    if (!authenticated) {
      showAuthSheet();
      return;
    }
    if (route.params?.isTrial) {
      setTrialAlertVisible(true);
      return;
    }

    setReviewModalVisible(true);
  };

  const onUpgrade = async () => {
    await videoRef.current?.pauseAsync();
    dispatch(updatePlayer({ isPlaying: false }));

    setTrialAlertVisible(false);
    setReviewModalVisible(false);
    navigation.navigate(ROUTES.SIGNUP);
  };

  const onPurchase = () => {
    setTrialAlertVisible(false);
    setReviewModalVisible(false);
    buyIAP();
  };

  const buyIAP = async () => {
    setProcessing(true);
    try {
      console.log("buying", lesson.product);

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

  const onLike = async () => {
    if (!authenticated) {
      showAuthSheet();
      return;
    }

    const currentUserIds: number[] = lesson.like_users.map(
      (u: ProfileState) => u.id
    );
    const newUsersIds = !liked
      ? [...currentUserIds, profile.id]
      : currentUserIds.filter((id) => id !== profile.id);
    const { success, data } = await updateLikeUser(lesson.id, newUsersIds);

    if (success) {
      setLike(!liked);
      setLesson(data);
    }
  };

  const onBookmark = async () => {
    if (!authenticated) {
      showAuthSheet();
      return;
    }

    const { success, data } = !!lesson.bookmark_id
      ? await dispatch(removeBookmark(lesson.bookmark_id))
      : await dispatch(addBookmark(profile.id, lesson.id));

    if (success) {
      setLesson({
        ...lesson,
        bookmark_id: !!lesson.bookmark_id ? null : data.id,
      });
    }
  };

  // Format for comment tree
  const nestReply = (items: any[], id = null): LessonComment[] => {
    return items
      .filter((item) => item["reply_to"] === id)
      .map((item) => ({ ...item, replies: nestReply(items, item.id) }));
  };

  const onPostComment = async ({ content, replyToId }: CommentForm) => {
    const { success, data } = await postUserComment({
      content,
      user: {
        id: profile.id,
      },
      reply_to: replyToId,
      lesson_id: lesson.id,
    });

    toast.show({
      description: success ? t("Submitted") : t("REFRESH_ERROR"),
      status: success ? "success" : "error",
      isClosable: false,
      placement: "top",
      duration: 2000,
    });

    if (data) {
      setTempComments([
        ...tempComments,
        {
          id: data.id,
          content: data.content,
          status: data.status,
          reply_to: data.reply_to,
          replies: [],
          user: {
            id: data.user.id,
            username: data.user.username,
            avatar: data.user.avatar,
          },
          created_at: data.created_at,
          deleted_at: null,
        },
      ]);
    }
  };

  const onSubmitReport = async (form: ReportForm) => {
    const { success, data } = await postReport({
      ...form,
      submitted_by: profile.id,
    });
    console.log(data);

    toast.show({
      description: success ? t("Submitted") : t("REFRESH_ERROR"),
      status: success ? "success" : "error",
      isClosable: false,
      placement: "top",
      duration: 2000,
    });
  };

  const renderLesson = () => (
    <KeyboardAvoidingView
      flex={1}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 50}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: Layout.space }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View px={5} py={8}>
          <HStack justifyContent="space-between" mb={4}>
            <VStack width="85%">
              <Heading fontSize="2xl">{lesson.title}</Heading>
              {isVideo && (
                <Text
                  _light={{ color: "gray.600" }}
                  _dark={{ color: "coolGray.200" }}
                  mt={2}
                >
                  {t("LessonOrder", { order: player.chapterIndex + 1 })}
                </Text>
              )}
            </VStack>

            {isVideo && (
              <VStack>
                <IconButton
                  name="list"
                  family="Feather"
                  size="md"
                  onPress={toggleChapter}
                />
                <Text fontSize="xs">{t("Chapter")}</Text>
              </VStack>
            )}
          </HStack>

          <Text
            mt={-2}
            fontWeight={500}
            _light={{ color: "gray.600" }}
            _dark={{ color: "coolGray.200" }}
          >
            {lesson.desc}
          </Text>

          {!!lesson.author && <Text mt={6}>{lesson.author}</Text>}

          <HStack justifyContent="space-around" alignItems="center" my={6}>
            <ActionButton
              label={t("Like")}
              icon="heart"
              editable
              selected={liked}
              tintColor="red.400"
              onPress={onLike}
            />
            <ActionButton
              label={t("Bookmark")}
              icon="bookmark"
              editable
              selected={!!lesson.bookmark_id}
              onPress={onBookmark}
            />
            <ActionButton
              label={t("Share")}
              icon="share-variant"
              editable={false}
              onPress={() =>
                onShare({ message: lesson.title, lessonId: lesson.id }, () =>
                  logEvent(EXP.SHARE, lesson.id)
                )
              }
            />
            {!lesson.purchased && !isUnlocked && (
              <ActionButton
                label={t("Purchase")}
                icon="credit-card-outline"
                editable={false}
                onPress={showOrderReview}
              />
            )}
          </HStack>
        </View>

        <NoteSection
          editable={authenticated}
          showAuthSheet={() => showAuthSheet()}
          onViewImage={(imgIndex) =>
            setImageView({ visible: true, index: imgIndex })
          }
          onViewFile={onViewPdf}
          onFilterNote={() => {}}
          data={{
            ebook: lesson.books,
            photo: lesson.photos,
            doc: lesson.documents,
          }}
        />
        <CommentSection
          editable={authenticated && !route.params.isTrial}
          showAuthSheet={() => showAuthSheet()}
          onPostComment={onPostComment}
          onPressReply={onScrollToBottom}
          data={nestReply(tempComments)} //
          onReport={(form) => onSubmitReport(form)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderChapter = () => (
    <View flex={1}>
      <HStack justifyContent="space-between" px={5} pt={5}>
        <Heading fontSize="md">{lesson.title}</Heading>
        <IconButton
          name="x"
          family="Feather"
          size="md"
          onPress={toggleChapter}
        />
      </HStack>

      <ChapterProgressBar
        total={chapters.length}
        playCount={chapters.filter((ch) => ch.timestamp > 0).length}
      />

      <ScrollView>
        {chapters.map((c: LessonChapter, index: number) => {
          return (
            <ChapterRow
              key={c.id}
              order={c.order}
              title={c.title}
              thumbnail={c.thumbnail}
              playing={index === player.chapterIndex}
              timestamp={c.timestamp}
              duration={c.duration}
              purchased={lesson.purchased || isUnlocked}
              trial={c.trial}
              isLast={index === chapters.length - 1}
              onPress={() => onPressChapter(c.id, index, c.timestamp, c.trial)}
            />
          );
        })}
      </ScrollView>
    </View>
  );

  const renderHeader = () => {
    let extraTop;

    if (Platform.OS === "android" && StatusBar.currentHeight) {
      const hasNotch = StatusBar.currentHeight > 48;
      extraTop = hasNotch ? 0 : "40px";
    }

    return (
      <HStack
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.900" }}
        justifyContent="space-between"
        px={5}
        py={1}
        mt={extraTop}
      >
        <IconButton
          family="Feather"
          name="chevron-down"
          size="md"
          onPress={() => onGoBack()}
        />
        <HStack>
          <IconButton
            family="Feather"
            name={player.mode === "video" ? "volume-2" : "video"}
            onPress={() =>
              updateVideoPlayer(
                "mode",
                player.mode === "video" ? "audio" : "video"
              )
            }
          />
          <IconButton
            family="Feather"
            name="play-circle"
            onPress={() => onOpen()}
            ml={4}
          />
        </HStack>
      </HStack>
    );
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

  if (isTabBarButton) {
    return <MiniPlayer />;
  }

  if (Object.keys(lesson).length === 0) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorMode === "dark" ? "#111827" : "white",
      }}
    >
      {renderHeader()}

      {isVideo ? (
        <VideoPlayer
          ref={videoRef}
          rate={PLAYBACK_SPEED.find((p) => p.id === player.rateId)?.value}
          onPlaybackStatusUpdate={(status) => onPlaybackStatusUpdate(status)}
          onVideoLoad={(status) => setTrialTime(status)}
          playerStatus={player}
        />
      ) : (
        <BookPreview imageSource={lesson.thumbnail} onPress={onViewBook} />
      )}

      {chapterVisible ? renderChapter() : renderLesson()}

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

      <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        <Actionsheet.Content>
          <Text fontSize="md" color="gray.500" textAlign="left">
            播放速度
          </Text>
          {PLAYBACK_SPEED.map((p) => (
            <Actionsheet.Item
              key={p.id}
              startIcon={
                <Icon
                  as={<Feather name="check" />}
                  color={
                    p.id === player.rateId ? "trueGray.400" : "transparent"
                  }
                  size="6"
                />
              }
              onPress={() => {
                videoRef?.current?.setStatusAsync({
                  rate: p.value,
                  shouldCorrectPitch: true,
                  pitchCorrectionQuality: PitchCorrectionQuality.High,
                });
                updateVideoPlayer("rateId", p.id);
                onClose();
              }}
            >
              {`${p.label}x`}
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>

      <ImageViewer
        data={lesson.photos?.files}
        visible={imageView.visible}
        imageIndex={imageView.index}
        onRequestClose={() => setImageView({ visible: false, index: 0 })}
      />
    </SafeAreaView>
  );
}
