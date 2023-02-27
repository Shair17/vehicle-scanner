import { Div } from 'react-native-magnus';
import { ActivityIndicator } from 'react-native';

export const LoadingTemplate: React.FC = () => {
	return (
		<Div flex={1} alignItems="center" justifyContent="center" bg="#fff">
			<ActivityIndicator size="large" />
		</Div>
	);
};
