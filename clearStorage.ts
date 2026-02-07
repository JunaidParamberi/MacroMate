// Run this file to clear all local storage data
// npx ts-node clearStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

async function clearStorage() {
  try {
    await AsyncStorage.clear();
    console.log('✅ All local storage cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
  }
}

clearStorage();
