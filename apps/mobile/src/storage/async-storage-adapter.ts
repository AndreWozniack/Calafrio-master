import type { StorageAdapterAsync } from "@calafrio/ficha-app";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const mobileStorageAdapter: StorageAdapterAsync = {
  getItem: async (key: string) => AsyncStorage.getItem(key),
  setItem: async (key: string, value: string) =>
    AsyncStorage.setItem(key, value),
  removeItem: async (key: string) => AsyncStorage.removeItem(key),
};
