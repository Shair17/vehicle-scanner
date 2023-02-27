import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AskDataScreen } from './screens/AskDataScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { DecodedVIN } from './types/response';
import { PhotosScreen } from './screens/PhotosScreen';
import { SignInScreen } from './screens/SignInScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { useAuth } from './hooks/useAuth';

export type StackParams = {
	LoadingScreen: undefined;
	AskDataScreen: undefined;
	DetailsScreen: {
		decodedVIN: DecodedVIN;
	};
	PhotosScreen: {
		decodedVIN: DecodedVIN;
	};
	SignInScreen: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

export const Root = () => {
	const { status: authStatus } = useAuth();

	return (
		<Stack.Navigator
			initialRouteName="AskDataScreen"
			screenOptions={{
				animation: 'slide_from_right',
				contentStyle: {
					backgroundColor: 'white',
				},
				headerShadowVisible: false,
			}}
		>
			{authStatus === 'loading' ? (
				<Stack.Screen
					name="LoadingScreen"
					component={LoadingScreen}
					options={{
						headerShown: false,
					}}
				/>
			) : authStatus === 'unauthenticated' ? (
				<Stack.Screen
					name="SignInScreen"
					component={SignInScreen}
					options={{
						headerShown: false,
					}}
				/>
			) : (
				<Stack.Group>
					<Stack.Screen
						name="AskDataScreen"
						component={AskDataScreen}
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="DetailsScreen"
						component={DetailsScreen}
						options={{
							title: 'Details',
						}}
					/>
					<Stack.Screen
						name="PhotosScreen"
						component={PhotosScreen}
						options={{
							title: 'Take Photos',
						}}
					/>
				</Stack.Group>
			)}
		</Stack.Navigator>
	);
};
