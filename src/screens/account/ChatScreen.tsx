import React, { useState, useCallback, useEffect } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import {
  GiftedChat,
  BubbleProps,
  Bubble,
  Send,
  Composer,
  InputToolbar,
  InputToolbarProps,
  ComposerProps,
  IMessage,
  SendProps,
} from "react-native-gifted-chat";
import { View, useColorMode } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppSelector } from "@hooks/redux";
import { getProfile } from "@selectors/authSelector";
import { fetchChatMessage } from "@data-fetch/chat";
import Layout from "@styles/Layout";
import { t } from "@utils/i18n";
import socket from "@utils/socket";

const BORDER_RADIUS = 28;

const adminUser = {
  _id: "A1",
  name: "admin",
};

interface Props {
  route: any;
}

const ChatScreen = ({ route }: Props) => {
  const { colorMode } = useColorMode();
  const profile = useAppSelector(getProfile);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const currentUser = { _id: profile.id };

  useEffect(() => {
    fetchHistory();

    socket.auth = {
      userId: profile.id,
      username: profile.username,
    };
    socket.connect();

    socket.on("message_deliver", ({ text, msgId, createdAt }) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: msgId,
            text,
            createdAt: new Date(createdAt),
            user: adminUser,
          },
        ])
      );

      socket.emit("message_receive", { msgId });
    });

    socket.on("connect_error", (err) => {
      if (err.message.includes("Unauthenticated")) {
        Alert.alert(t("CONNECT_ERROR"));
      }
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, [route]);

  const fetchHistory = async () => {
    let history: any[] = [];

    const { data } = await fetchChatMessage(profile.id);
    if (data) {
      history = data;
    }

    if (history.length !== 0) {
      setMessages(
        history.map((msg) => ({
          _id: msg.id,
          text: msg.text,
          user: msg.from_admin ? adminUser : currentUser,
          createdAt: msg.created_at,
        }))
      );
    } else {
      setTimeout(() => {
        setMessages([
          {
            _id: "s1",
            text: t("CHAT_STARTER"),
            createdAt: new Date(),
            user: adminUser,
          },
        ]);
      }, 1000);
    }
  };

  const onSend = useCallback((msg = []) => {
    socket.emit("message_send", {
      text: msg[0].text,
      to: "admin",
    });
    setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
  }, []);

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: styles.bubbleText,
          right: styles.bubbleText,
        }}
        wrapperStyle={{
          left: { ...styles.bubble, ...styles.leftBubble },
          right: { ...styles.bubble, ...styles.rightBubble },
        }}
      />
    );
  };

  const renderSend = (props: SendProps<IMessage>) => (
    <View style={styles.btnWrapper}>
      <Send {...props} containerStyle={styles.send}>
        <MaterialCommunityIcons name="send-circle" size={32} color="#F79F4E" />
      </Send>
    </View>
  );

  const renderInputToolbar = (props: InputToolbarProps) => (
    <InputToolbar
      {...props}
      containerStyle={{
        ...styles.inpuTooltBar,
        backgroundColor: colorMode === "dark" ? "#1f2937" : "white",
      }}
    />
  );

  const renderComposer = (props: ComposerProps) => (
    <Composer
      {...props}
      textInputStyle={{
        ...styles.composerText,
        backgroundColor: colorMode === "dark" ? "#4b5563" : "white",
      }}
    />
  );

  return (
    <View flex={1}>
      <GiftedChat
        messages={messages}
        keyboardShouldPersistTaps="handled"
        user={currentUser}
        showUserAvatar={false}
        alwaysShowSend
        onSend={(msg) => onSend(msg)}
        isTyping={isTyping}
        placeholder={t("CHAT_PLACEHOLDER")}
        timeTextStyle={{ left: styles.timeText, right: styles.timeText }}
        renderAvatar={() => undefined}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        bottomOffset={Platform.OS === "ios" ? 33 : 0}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  bubble: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    shadowColor: "#425965",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  leftBubble: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: 0,
    backgroundColor: "white",
    borderColor: "#E0E1E2",
  },
  rightBubble: {
    borderBottomRightRadius: 0,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    backgroundColor: "#FFEC80",
    borderColor: "#FFEC80",
  },
  bubbleText: {
    color: "black",
    fontSize: 14,
  },
  send: {
    justifyContent: "center",
  },
  timeText: {
    color: "#8D8C8C",
  },
  composerText: {
    width: Layout.scaleWidth(80),
    fontSize: 14,
    borderColor: "#E0E1E2",
    borderRadius: 20,
    borderWidth: 0.5,
    paddingTop: 4,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  inpuTooltBar: {
    borderTopWidth: 0,
    shadowColor: "#425965",
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 5,
  },
  btnWrapper: {
    paddingHorizontal: 10,
    width: Layout.scaleWidth(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
