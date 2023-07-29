import React, { useEffect, useState, useRef } from "react";
import {
  RefreshControl,
  FlatList as FL,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  View,
  ScrollView,
  HStack,
  Heading,
  useToast,
  FlatList,
} from "native-base";
import { useSelector } from "react-redux";
import moment from "moment";
import * as Notifications from "expo-notifications";
import crashlytics from "@react-native-firebase/crashlytics";

import ROUTES from "@navigation/Routes";
import Spinner from "@components/Spinner";
import HeroCarousel from "@components/Carousel/HeroCarousel";
import FilterScrollTab from "@components/LessonSpecific/FilterScrollTab";
import CategoryButton from "@components/IndexSpecific/CategoryButton";
import BookCard from "@components/LessonCard/BookCard";
import QuestInfoModal from "@components/Mission/QuestInfoModal";
import MissionPrompt from "@components/Mission/MissionPrompt";
import HomeSearchRow from "@components/Search/HomeSearchRow";
import { t } from "@utils/i18n";
import { getHomeFeed } from "@selectors/lessonSelector";
import { getProfile, getUserSubscriptions } from "@selectors/authSelector";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {
  fetchLesson,
  fetchBookmark,
  fetchLessonPurchase,
} from "@actions/lessonAction";
import { getUserData } from "@store/actions/authAction";
import { fetchDailyExp } from "@store/actions/questAction";
import { updateUserSetting } from "@store/actions/notificationAction";
import { getItem, setItem } from "@utils/storage";
import Layout from "@styles/Layout";
import PromoCard from "@components/IndexSpecific/PromoCard";
import BookListItem from "@components/LessonCard/BookListItem";
import ContentWall from "@components/ContentWall";
import EmptyView from "@components/Container/EmptyView";
import { LessonItem, LessonList } from "@store/states/LessonState";
import { ExpGains } from "@store/states/QuestState";
import { EXP, logEvent } from "@utils/expLogger";
import { getNotificationCount } from "@selectors/notificationSelector";
import useNotifications, { registerPushToken } from "@hooks/useNotifications";

const TABS = [
  {
    id: 1,
    name: "Home",
    state: "home",
  },
  {
    id: 2,
    name: "BookShop",
    state: "premiumclub",
  },
  {
    id: 3,
    name: "BookClub",
    state: "bookclub",
  },
  {
    id: 4,
    name: "Course",
    state: "lessons",
  },
];

interface HomeProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeProps) {
  const dispatch = useAppDispatch();
  const courseScrollRef = useRef<FL>();
  const { expoPushToken } = useNotifications();
  const toast = useToast();
  const notificationCount = useSelector(getNotificationCount);
  const homeFeed = useSelector(getHomeFeed);
  const { home, premiumclub, bookclub, lessons, courseCount } = homeFeed;
  const [catId, setCatId] = useState(TABS[0].id);
  const [pageNo, setPageNo] = useState(0);
  const [isLoadingMore, setLoadingMore] = useState(true);
  const [promptVisible, setPromptVisible] = useState(false);
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [dailyExpData, setDailyExpData] = useState<ExpGains>({
    date: "",
    total: 0,
    logs: [],
    levelup: null,
  });
  const loading = useAppSelector((state) => state.lesson.loading);
  const verified = useAppSelector((state) => state.auth.verified);
  const profile = useAppSelector(getProfile);
  const { activeSubscription, isVIP } = useAppSelector(getUserSubscriptions);
  const isGuest = !profile.id;

  useEffect(() => {
    getTabData();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (profile.email && !verified) {
      navigation.navigate(ROUTES.VERIFY_EMAIL, { email: profile.email });
      return;
    }

    const recordCrashMetadata = async () => {
      crashlytics().log("New user session");

      await Promise.all([
        crashlytics().setUserId(`${profile.id}`),
        crashlytics().setAttributes({
          username: profile.username,
          activeSubscription,
        }),
      ]);
    };

    const recordLogin = async () => {
      let eligible = true;
      const loginKey = "lastLogin";
      const lastLogin = await getItem(loginKey);

      if (lastLogin) {
        eligible = moment().isAfter(moment(lastLogin), "day");
      }

      if (eligible) {
        const success = await logEvent(EXP.LOGIN);
        if (success) {
          await setItem(loginKey, moment().toISOString());
        }
      }
    };

    // daily exp prmopt
    const fetchUserDailyExp = async () => {
      const expDateKey = "dailyExp";
      const lastFetch = await getItem(expDateKey);
      const anotherDate =
        lastFetch && moment().isAfter(moment(lastFetch), "day");

      if (!lastFetch || anotherDate) {
        const { data }: any = await fetchDailyExp();
        if (data && data.total > 0) {
          setDailyExpData(data);
          setPromptVisible(true);
          await setItem(expDateKey, moment().toISOString());
        }
      }
    };

    if (profile.id) {
      updatePermissions();
      recordLogin();
      recordCrashMetadata();
      setTimeout(() => {
        fetchUserDailyExp();
      }, 4500);
    }
  }, [profile.id]);

  useEffect(() => {
    if (catId !== 1 && !!homeFeed) {
      const isTab2Empty =
        !isGuest && catId === 2 && !homeFeed.premiumclub?.section.data.length;
      const isTab3Empty =
        !isGuest && catId === 3 && !homeFeed.bookclub?.sections.length;
      const isTab4Empty = catId === 4 && !homeFeed.lessons.length;

      if (isTab2Empty || isTab3Empty || isTab4Empty) {
        getTabData();
      }
    }
  }, [catId]);

  const updatePermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === "granted") {
      if (expoPushToken) {
        registerPushToken(expoPushToken, Platform.OS);
      }
      await dispatch(
        updateUserSetting({
          enabled: true,
          news: true,
          event: true,
          sub: true,
          message: true,
        })
      );
    }
  };

  const getTabData = async () => {
    const result = await dispatch(fetchLesson(catId));

    if (!result.success) {
      toast.show({
        description: t("REFRESH_ERROR"),
        isClosable: false,
        placement: "top",
        duration: 2000,
      });
    }
  };

  const loadMoreData = async () => {
    if (lessons.length < 5 || lessons.length >= courseCount) {
      setLoadingMore(false);
      return;
    }

    let newPage = pageNo + 1;
    const result = await dispatch(fetchLesson(catId, newPage));

    if (!result.success) {
      setLoadingMore(false);
      toast.show({
        description: t("REFRESH_ERROR"),
        isClosable: false,
        placement: "top",
        duration: 2000,
      });
      return;
    }

    if (result.data.length !== 0) {
      setPageNo(newPage);
      const limit = 10;
      const visibleIndex = newPage <= 1 ? limit - 1 : limit * newPage - 3;

      setTimeout(() => {
        if (courseScrollRef && courseScrollRef.current) {
          courseScrollRef.current.scrollToIndex({
            animated: false,
            index: visibleIndex,
          });
        }
      }, 50);
    }
  };

  const fetchUserData = async () => {
    const userId = profile.id || (await getItem("userId"));

    if (userId) {
      await Promise.all([
        dispatch(getUserData(userId)),
        dispatch(fetchBookmark(userId)),
        dispatch(fetchLessonPurchase(userId)),
      ]);
    }
  };

  const showLevelupAlert = () => {
    if (dailyExpData && dailyExpData.levelup !== null) {
      setTimeout(() => {
        setLevelUpVisible(true);
      }, 1000);
    }
  };

  const onViewCat = (id: any, title?: string) => {
    if (title) {
      navigation.navigate(ROUTES.BROWSE_ALL, { id, title });
    } else if (id !== catId) {
      setCatId(id);
    }
  };

  const onViewLesson = (item: any) => {
    const { id, lesson_collection } = item;

    const enableBookShop = lesson_collection === 1 && activeSubscription !== "";
    const enableBookClub =
      lesson_collection === 2 &&
      (activeSubscription === "T2" || activeSubscription === "T3");
    const enableAllCourse = lesson_collection === 3 && isVIP;

    if (enableBookShop || enableBookClub || enableAllCourse) {
      navigation.navigate(ROUTES.LESSON_TAB, {
        screen: ROUTES.VIDEO_LESSON,
        params: { id },
      });
    } else {
      navigation.navigate(ROUTES.LESSON_INTRO, { id });
    }
  };

  const onViewPromo = (item: any) => {
    const params = {
      id: item.id,
      data: item,
    };
    if (item.start_time) {
      navigation.navigate(ROUTES.EVENT_TAB, {
        screen: ROUTES.EVENT_DETAIL,
        params,
        initial: false,
      });
    } else if (item.category) {
      onViewLesson(item);
    } else {
      navigation.navigate(ROUTES.NEWS_DETAIL, params);
    }
  };

  const CategoryGrid = ({
    data,
    onPress,
  }: {
    data: any[];
    onPress: (category: any) => void;
  }) => {
    return (
      <View
        px={5}
        mb={2}
        pt={5}
        style={{
          width: Layout.deviceWidth,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {data.map((c) => (
          <CategoryButton
            key={c.name}
            label={c.name}
            icon={c.icon}
            onPress={() => onPress(c)}
          />
        ))}
      </View>
    );
  };

  const ScrollWrapper = ({ children }: { children: React.ReactElement }) => (
    <ScrollView
      scrollEnabled={!loading}
      _contentContainerStyle={{
        flexGrow: 1,
        pb: 20,
      }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => getTabData()} />
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );

  const renderBookListItem = ({
    item,
    index,
  }: {
    item: LessonItem;
    index: number;
  }) => (
    <BookListItem
      title={item.title}
      desc={item.desc}
      collection={item.lesson_collection}
      author={item.author}
      imageSource={item.thumbnail}
      price={item.product?.price}
      onPress={() => onViewLesson(item)}
      isFirst={index === 0}
      hidePrice={catId === 2 || activeSubscription === "T3"}
    />
  );

  const renderBookCardItem = ({
    item,
    index,
  }: {
    item: LessonItem;
    index: number;
  }) => (
    <BookCard
      key={item.id}
      title={item.title}
      desc={item.desc}
      collection={item.lesson_collection}
      category={item.category}
      duration={item.duration_total}
      imageSource={item.thumbnail}
      onPress={() => onViewLesson(item)}
      isFirst={index === 0}
    />
  );

  const TitleSection = ({
    item,
    index,
  }: {
    item: LessonList;
    index: number;
  }) => (
    <>
      <HStack
        mt={index === 0 ? 10 : 0}
        mb={3}
        mx={5}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="lg">{item.title}</Heading>
      </HStack>
      <FlatList
        data={item.data}
        keyExtractor={(item) => `${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderBookCardItem}
        mb={2}
      />
    </>
  );

  const onViewMore = (route: string) => {
    const params =
      home && !activeSubscription
        ? {
            subscription_cta: home.subscription_cta,
          }
        : null;
    navigation.navigate(route, params);
  };

  const DefaultSection = () => {
    return (
      <ScrollWrapper>
        {home ? (
          <>
            <View mx={5}>
              {!activeSubscription && home.free_content && (
                <PromoCard
                  imageSource={home.free_content.image}
                  title={home.free_content.title}
                  backgroundColor={home.free_content.backgroundColor}
                  textColor={home.free_content.textColor}
                  onPress={() => onViewMore(ROUTES.FREE_INDEX)}
                />
              )}
              {!activeSubscription && home.subscription_cta && (
                <PromoCard
                  imageSource={home.subscription_cta.image}
                  title={home.subscription_cta.title}
                  subtitle={home.subscription_cta.subtitle}
                  backgroundColor={home.subscription_cta.backgroundColor}
                  textColor={home.subscription_cta.textColor}
                  onPress={() => onViewMore(ROUTES.MEMBERSHIP_INTRO)}
                />
              )}
            </View>

            {home.promotions && (
              <HeroCarousel onPress={onViewPromo} entries={home.promotions} />
            )}
            {home.sections.map((section, index) => (
              <TitleSection key={section.id} item={section} index={index} />
            ))}
          </>
        ) : (
          <EmptyView />
        )}
      </ScrollWrapper>
    );
  };

  const BookClub = () => {
    if (isGuest) {
      return <ContentWall title={"UPGRADE_ONLY"} buttonLabel="Upgrade" />;
    }

    if (bookclub) {
      return (
        <ScrollWrapper>
          <>
            {bookclub.promotions && (
              <HeroCarousel
                onPress={onViewPromo}
                entries={bookclub.promotions}
              />
            )}
            {bookclub.sections.map((section, index) => (
              <TitleSection key={section.id} item={section} index={index} />
            ))}
          </>
        </ScrollWrapper>
      );
    }
    return <EmptyView />;
  };

  const BookShop = () => {
    if (isGuest) {
      return <ContentWall />;
    }

    if (premiumclub && premiumclub.section) {
      return (
        <FlatList
          data={premiumclub.section.data}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => getTabData()} />
          }
          renderItem={renderBookListItem}
          ListHeaderComponent={() => (
            <CategoryGrid
              data={premiumclub.categories}
              onPress={(cat) => onViewCat(cat.id, cat.name)}
            />
          )}
          ListHeaderComponentStyle={{ marginBottom: 20 }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />
      );
    }
    return <EmptyView />;
  };

  const CourseList = () => {
    return (
      <FlatList
        ref={courseScrollRef}
        data={lessons}
        keyExtractor={(item) => `${item.id}`}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => getTabData()} />
        }
        initialNumToRender={5}
        initialScrollIndex={0}
        onEndReachedThreshold={0.1}
        onEndReached={loadMoreData}
        onScrollToIndexFailed={(err) =>
          console.error("onScrollToIndexFailed", err)
        }
        getItemLayout={(data, index) => ({
          length: Layout.scaleHeight(16),
          offset: Layout.scaleHeight(16) * index,
          index,
        })}
        renderItem={renderBookListItem}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListFooterComponent={
          isLoadingMore && lessons.length !== 0 ? (
            <ActivityIndicator size={32} color="orange" />
          ) : null
        }
        ListEmptyComponent={<EmptyView title="EMPTY_CONTENT" pt="50%" />}
      />
    );
  };

  return (
    <View flex={1} _light={{ bg: "white" }} _dark={{ bg: "coolGray.900" }}>
      <HomeSearchRow
        onPressSearch={() => navigation.navigate(ROUTES.SEARCH)}
        onPressLeft={() => navigation.navigate(ROUTES.NOTIFICATION)}
        onPressRight={() => setPromptVisible(true)}
        hideExp={isGuest}
        unreadCount={notificationCount}
      />
      <FilterScrollTab
        data={TABS}
        onPressItem={(item) => onViewCat(item.id)}
        selectedId={catId}
      />
      {catId !== 4 && <Spinner animating={loading} />}

      {catId === 1 && <DefaultSection />}
      {catId === 2 && <BookShop />}
      {catId === 3 && <BookClub />}
      {catId === 4 && <CourseList />}

      <MissionPrompt
        isVisible={promptVisible}
        onBackdropPress={() => setPromptVisible(false)}
        onModalHide={showLevelupAlert}
        totalExp={dailyExpData.total}
        expLog={dailyExpData.logs}
      />
      <QuestInfoModal
        isVisible={levelUpVisible}
        onBackdropPress={() => setLevelUpVisible(false)}
        type="reward"
        infoId={dailyExpData.levelup?.id || 0} // next level
        isLevelup
      />
    </View>
  );
}
