import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  ScrollView,
  Heading,
  View,
  Text,
  HStack,
  Center,
  Image,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { t } from "@utils/i18n";
import Layout from "@styles/Layout";
import FilterButton from "./FilterButton";
import { LessonDocument, LessonPhoto } from "@store/states/LessonState";

type SectionType = "ebook" | "photo" | "doc";

const sections: {
  label: string;
  state: SectionType;
}[] = [
  {
    label: "eBook",
    state: "ebook",
  },

  {
    label: "Photo",
    state: "photo",
  },
  {
    label: "Document",
    state: "doc",
  },
];

interface NoteSectionProps {
  onFilterNote: (type: string) => void;
  onViewImage: (index: number) => void;
  onViewFile: (url: string) => void;
  showAuthSheet: () => void;
  editable: boolean;
  data: {
    ebook: LessonDocument[] | null;
    photo: LessonPhoto | null;
    doc: LessonDocument[] | null;
  };
}

export default function NoteSection({
  showAuthSheet,
  onFilterNote,
  onViewImage,
  onViewFile,
  editable,
  data,
}: NoteSectionProps) {
  const [selectedSection, setSection] = useState<SectionType>("ebook");
  const [truncateText, setTruncate] = useState(true);
  const SIZE = Layout.scaleWidth(33);

  const sortByOrder = (arr: any[]) => {
    return arr.sort((a: any, b: any) => {
      if (a.order) {
        return a.order - b.order;
      }
      return 0;
    });
  };

  const renderImages = () => {
    if (!data.photo) {
      return <Text>{t("EMPTY_CONTENT")}</Text>;
    }
    return (
      <HStack justifyContent="space-between" flexWrap="wrap">
        {sortByOrder(data.photo.files).map((img: any, index: number) => (
          <TouchableOpacity key={img.id} onPress={() => onViewImage(index)}>
            <Image
              source={{ uri: img.url }}
              resizeMode="contain"
              alt="photo"
              width={Layout.scaleWidth(42)}
              height={100}
              mb={4}
            />
          </TouchableOpacity>
        ))}
      </HStack>
    );
  };

  const FileButton = ({ file, title }: any) => (
    <TouchableOpacity onPress={() => onViewFile(file.url)}>
      <Center
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.200" }}
        width={SIZE}
        height={SIZE}
        shadow={1}
        mr={10}
        my={2}
      >
        <MaterialCommunityIcons
          name={file.mime.includes("pdf") ? "file-pdf-box" : "file-word-box"}
          size={60}
          color="black"
        />
        <Text fontSize={12} color="gray.600">
          {title || file.name}
        </Text>
      </Center>
    </TouchableOpacity>
  );

  const renderDocuments = () => {
    if (!data.doc?.length) {
      return <Text>{t("EMPTY_CONTENT")}</Text>;
    }
    return (
      <ScrollView
        horizontal
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
      >
        {sortByOrder(data.doc).map((doc: LessonDocument) => {
          if (doc.file) {
            return (
              <FileButton key={doc.id} file={doc.file} title={doc.title} />
            );
          }
        })}
      </ScrollView>
    );
  };

  const renderBooks = () => {
    if (!data.ebook?.length) {
      return <Text>{t("EMPTY_CONTENT")}</Text>;
    }
    return (
      <ScrollView
        horizontal
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
      >
        {sortByOrder(data.ebook).map((doc: LessonDocument) => {
          if (doc.file) {
            return <FileButton key={doc.id} file={doc.file} />;
          }
        })}
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (selectedSection === "photo") {
      return renderImages();
    }
    if (selectedSection === "doc") {
      return renderDocuments();
    }
    return renderBooks();
  };

  function filterSection(type: SectionType) {
    setSection(type);
    onFilterNote(type);
  }

  return (
    <View
      px={5}
      py={10}
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.800" }}
      borderRadius={30}
      minHeight={240}
    >
      <Heading size="lg">{t("Notes")}</Heading>

      <HStack my={6}>
        {sections.map((s) => (
          <FilterButton
            key={s.state}
            label={s.label}
            selected={s.state === selectedSection}
            onPress={() => filterSection(s.state)}
            numOfItems={sections.length}
          />
        ))}
      </HStack>

      {renderContent()}
    </View>
  );
}
