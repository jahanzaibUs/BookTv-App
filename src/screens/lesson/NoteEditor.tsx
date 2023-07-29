import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, TextArea } from "native-base";

import LabelButton from "@components/LabelButton";
import { t } from "@utils/i18n";

interface NoteEditorProps {
  navigation: any;
  route: any;
}

export default function NoteEditor({ navigation, route }: NoteEditorProps) {
  const [text, setTextValue] = useState("");

  useEffect(() => {
    if (route.params.text) {
      setTextValue(route.params.text);
    }
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <LabelButton onPress={() => navigation.goBack()}>
          {t("Done")}
        </LabelButton>
      ),
    });
  }, []);

  const onChange = (e: any) => {
    setTextValue(e.currentTarget.value);
  };

  return (
    <ScrollView
      backgroundColor="white"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ flex: 1 }}
    >
      <TextArea
        value={text}
        onChange={onChange}
        autoFocus
        h="100%"
        border="none"
        lineHeight={6}
        pb={350}
        px={5}
        pt={5}
      />
    </ScrollView>
  );
}
