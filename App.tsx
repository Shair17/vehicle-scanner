import './src/services/setupAxios';

import React, { useEffect } from 'react';
import { ThemeProvider } from 'react-native-magnus';
import { Root } from './src/Root';
import { NavigationContainer } from '@react-navigation/native';
import { NotifierWrapper } from 'react-native-notifier';
import { useAuthStore } from './src/stores/useAuthStore';

export default function App() {
	const loadTokens = useAuthStore((s) => s.loadToken);

	useEffect(() => {
		loadTokens();
	}, []);

	return (
		<NotifierWrapper>
			<NavigationContainer>
				<ThemeProvider>
					<Root />
				</ThemeProvider>
			</NavigationContainer>
		</NotifierWrapper>
	);
}
