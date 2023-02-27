import AsyncStorage from '@react-native-async-storage/async-storage';

// Only use with strings
// if you want to store objets or arrays, then
// use JSON.stringify(...) ir order to store it
export const storeData = async (key: string, value: string) => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (error) {
		console.log(error);
	}
};

// key param is uses to get a value store with that same key
// in this app usually using `@SeawayExport/accessToken`
export const getData = async (key: string) => {
	try {
		const value = await AsyncStorage.getItem(key);

		return value ?? null;
	} catch (error) {
		console.log(error);
	}
};

export const removeData = async (key: string) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (error) {
		console.log(error);
	}
};
