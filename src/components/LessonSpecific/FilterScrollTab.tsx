import React from "react";
import { ScrollView } from "native-base";
import FilterButton from "@components/LessonSpecific/FilterButton";

interface FilterScrollTabProps {
  data: any[];
  onPressItem: (item: any) => void;
  selectedId?: number;
  fontSize?: any;
}

export default function FilterScrollTab({
  data,
  onPressItem,
  selectedId,
  fontSize,
}: FilterScrollTabProps) {
  const numOfVisible = 5;
  const scrollable = data.length > numOfVisible;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pb={2}
      pt={2}
      maxHeight="45px"
      scrollEnabled={scrollable}
    >
      {data.map((c: any, index: number) => (
        <FilterButton
          key={c.name}
          label={c.name}
          isFirst={index === 0}
          selected={c.id === selectedId}
          onPress={() => onPressItem(c)}
          numOfItems={scrollable ? numOfVisible : data.length}
          fontSize={fontSize}
        />
      ))}
    </ScrollView>
  );
}
