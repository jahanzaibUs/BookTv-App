import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@LAZYCLUB";

const isString = (v: any): boolean => typeof v === "string";

export const setItem = async (key: string, value: any) => {
  try {
    const storeValue = isString(value) ? value : JSON.stringify(value);
    await AsyncStorage.setItem(`${STORAGE_KEY}:${key}`, storeValue);
  } catch (err) {
    console.log(err);
  }
};

export const getItem = async (key: string, parse?: boolean) => {
  try {
    const item = await AsyncStorage.getItem(`${STORAGE_KEY}:${key}`);
    if (item && parse) {
      return JSON.parse(item);
    }
    return item;
  } catch (err) {
    console.log(err);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY}:${key}`);
  } catch (err) {
    console.log(err);
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.log(err);
  }
};

export const multiRemove = async (keys: string[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (err) {
    console.log(err);
  }
};
