import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, HStack, Text, VStack, FlatList, Divider } from "native-base";
import Modal from "react-native-modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useSelector } from "react-redux";

import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import { getCategories } from "@store/selectors/lessonSelector";
import FilterListItem from "./FilterListItem";

interface FilterModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onConfirm?: (conditions: any) => void;
  hideCategory?: boolean;
}

const SORT_ORDER = [
  {
    name: "ASC_ORDER",
    state: "asc",
  },
  {
    name: "DESC_ORDER",
    state: "desc",
  },
];

const SORT = [
  {
    name: "Publish date",
    state: "date",
  },
  {
    name: "Popularity",
    state: "fav",
  },
  {
    name: "Price",
    state: "price",
  },
];

const DEFAULT: {
  category: number[];
  audio: boolean;
  video: boolean;
} = {
  category: [],
  audio: true,
  video: true,
};

const LAYOUT = ["Default", "Category", "Sort By"];
const MAX_CAT = 5;
const MAX_PRICE = 500;
const MIN_PRICE = 50;
const STEP = 50;

export default function FilterModal({
  isVisible,
  onBackdropPress,
  onConfirm,
  hideCategory,
}: FilterModalProps) {
  const lessonCategories = useSelector(getCategories);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [filter, setFilter] = useState(DEFAULT);
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [sort, setSortRule] = useState(SORT[0]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [errorVisible, setErrorVisible] = useState(false);
  const showDefault = layoutIndex === 0;

  const onSubmit = () => {
    onBackdropPress();
    if (onConfirm) {
      onConfirm({
        ...filter,
        priceRange,
        sort,
      });
    }
  };

  const onClear = () => {
    if (showDefault) {
      setFilter(DEFAULT);
      setPriceRange([MIN_PRICE, MAX_PRICE]);
    } else if (layoutIndex === 1) {
      setFilter({ ...filter, category: [] });
    } else {
      setSortRule(SORT[0]);
    }
  };

  const updateCategory = (id: number) => {
    const added = filter.category.find((c) => c === id);
    let newList = filter.category;

    if (added) {
      newList = newList.filter((c) => c !== id);
    } else {
      if (newList.length >= MAX_CAT) {
        setErrorVisible(true);

        setTimeout(() => {
          setErrorVisible(false);
        }, 6000);
        return;
      }
      newList = [...newList, id];
    }

    setFilter({
      ...filter,
      category: newList,
    });
  };

  const getPriceLabel = () => {
    const min = priceRange[0];
    const max = priceRange[1];
    if (min === MIN_PRICE && max === MAX_PRICE) {
      return t("Any");
    } else {
      if (min === MIN_PRICE) {
        return t("BELOW_PRICE", { price: max });
      }
      if (max === MAX_PRICE) {
        if (min === MAX_PRICE) {
          return t("ABOVE_PRICE", { price: max });
        }
        return t("ABOVE_PRICE", { price: min });
      }
      if (max === min) {
        return `$${min}`;
      }
      return `$${min} - $${max}`;
    }
  };

  const renderCategory = () => (
    <FlatList
      data={lessonCategories}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <FilterListItem
          label={item.name}
          value={filter.category.includes(item.id)}
          onPress={() => updateCategory(item.id)}
        />
      )}
      style={{ height: Layout.scaleHeight(60) }}
      showsVerticalScrollIndicator={false}
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.800" }}
    />
  );

  const renderSort = () => (
    <>
      <FlatList
        data={SORT}
        keyExtractor={(item) => `${item.state}`}
        renderItem={({ item }) => (
          <FilterListItem
            label={t(item.name)}
            value={sort.state === item.state}
            onPress={() => setSortRule(item)}
          />
        )}
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
      />
      <Divider my="4" />
      <FlatList
        data={SORT_ORDER}
        keyExtractor={(item) => `${item.state}`}
        renderItem={({ item }) => (
          <FilterListItem
            label={t(item.name)}
            value={sortOrder === item.state}
            onPress={() => setSortOrder(item.state)}
          />
        )}
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
      />
    </>
  );

  const renderDefault = () => (
    <>
      {!hideCategory && (
        <FilterListItem
          label={t("Category")}
          value={filter.category}
          onPress={() => setLayoutIndex(1)}
        />
      )}

      <FilterListItem
        label={t("Audio")}
        value={filter.audio}
        onPress={() => setFilter({ ...filter, audio: !filter.audio })}
      />
      <FilterListItem
        label={t("Video")}
        value={filter.video}
        onPress={() => setFilter({ ...filter, video: !filter.video })}
      />
      <FilterListItem
        label={t("Price")}
        value={getPriceLabel()}
        hideMore
        renderItem={() => (
          <MultiSlider
            values={[priceRange[0], priceRange[1]]}
            onValuesChange={(values) => setPriceRange(values)}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            allowOverlap
            snapped
            sliderLength={Layout.scaleWidth(80)}
            containerStyle={{
              alignSelf: "center",
            }}
            selectedStyle={{
              backgroundColor: "#FC8721",
            }}
            trackStyle={{
              height: 6,
            }}
            markerOffsetY={2}
            markerStyle={{
              // For Android
              backgroundColor: "#fff",
              elevation: 5,
              height: 22,
              width: 22,
            }}
          />
        )}
      />
      <FilterListItem
        label={t("Sort By")}
        value={t(sort.name)}
        onPress={() => setLayoutIndex(2)}
      />
    </>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.1}
      animationIn="slideInDown"
      animationOut="slideOutUp"
    >
      <VStack
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
        position="absolute"
        top="70px"
        alignSelf="center"
        borderRadius={28}
        width={Layout.deviceWidth}
        minHeight={400}
        shadow={1}
        py={8}
        px={6}
      >
        <HStack justifyContent="space-between">
          <TouchableOpacity onPress={() => setLayoutIndex(0)}>
            <Text color="gray.400" fontSize="sm">
              {showDefault ? t("Filter Result") : t("Back")}
            </Text>
          </TouchableOpacity>

          {!showDefault && (
            <Text fontWeight="600" fontSize="sm">
              {t(LAYOUT[layoutIndex])}
            </Text>
          )}

          <TouchableOpacity onPress={() => onClear()}>
            <Text color="primary.500" fontSize="sm">
              {t("Clear")}
            </Text>
          </TouchableOpacity>
        </HStack>

        <VStack mt={4} mb={8}>
          {errorVisible && (
            <Text color="amber.600" fontSize="sm">
              {t("MAX_OPTIONS", { count: MAX_CAT })}
            </Text>
          )}
          {showDefault && renderDefault()}
          {layoutIndex === 1 && renderCategory()}
          {layoutIndex === 2 && renderSort()}
        </VStack>

        <Button
          // @ts-ignore
          variant="secondary"
          shadow={0}
          onPress={onSubmit}
          width={0.4}
          alignSelf="center"
        >
          {t("Confirm")}
        </Button>
      </VStack>
    </Modal>
  );
}
