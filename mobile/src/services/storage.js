import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'spendiq_jwt_token';

const isWeb = Platform.OS === 'web';

/**
 * Save the JWT token — uses localStorage on web, SecureStore on native
 */
export const saveToken = async (token) => {
  try {
    if (isWeb) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Storage: Error saving token', error);
  }
};

/**
 * Retrieve the saved JWT token
 */
export const getToken = async () => {
  try {
    if (isWeb) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Storage: Error getting token', error);
    return null;
  }
};

/**
 * Delete the JWT token
 */
export const deleteToken = async () => {
  try {
    if (isWeb) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Storage: Error deleting token', error);
  }
};
