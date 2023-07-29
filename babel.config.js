module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "react-native-dotenv",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".ts",
            ".jsx",
            ".js",
            ".json",
          ],
          alias: {
            "@assets": "./assets",
            "@components": "./src/components",
            "@constants": "./src/constants",
            "@hooks": "./src/hooks",
            "@data-fetch": "./src/data-fetch",
            "@navigation": "./src/navigation",
            "@screens": "./src/screens",
            "@styles": "./src/styles",
            "@typings": "./src/typings",
            "@utils": "./src/utils",
            "@store": "./src/store",
            "@actions": "./src/store/actions",
            "@reducers": "./src/store/reducers",
            "@selectors": "./src/store/selectors",
            "@states": "./src/store/states",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
