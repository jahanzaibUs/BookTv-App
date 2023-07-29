import React from "react";
import {
  View,
} from "native-base";
import WebView from "react-native-webview";

interface EditProfileProps {
  navigation: any;
}

export default function TermsAndConditions({ navigation }: EditProfileProps) {
  
  return (
<View flex={1} _light={{ bg: "white" }} _dark={{ bg: "coolGray.900" }}>
<WebView
    //   style={styles.container}
      source={{ uri: 'https://www.booktvhk.com/tncpage' }}
    //   onMessage={onMessage}
    //   onNavigationStateChange={onNavigationStateChange}
    />
    </View>
  );
}
