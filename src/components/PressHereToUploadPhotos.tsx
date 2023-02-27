import { TouchableOpacity } from 'react-native';
import { Div, Icon, Text } from 'react-native-magnus';

interface Props {
	onPress: () => void;
	fontSize?: string | number;
	iconSize?: string | number;
	iconMt?: string | number;
}

export const PressHereToUploadPhotos: React.FC<Props> = ({
	onPress,
	fontSize = '5xl',
	iconSize = '6xl',
	iconMt = 'md',
}) => {
	return (
		<TouchableOpacity activeOpacity={0.7} style={{ flex: 1 }} onPress={onPress}>
			<Div
				flex={1}
				alignItems="center"
				justifyContent="center"
				// bg="red"
				borderWidth={2}
				borderStyle="dashed"
				borderColor="blue500"
				rounded="lg"
			>
				<Div my="md">
					<Text
						fontSize={fontSize}
						textAlign="center"
						color="blue500"
						fontWeight="bold"
						mx="md"
					>
						Press here to pick photos
					</Text>
					<Icon
						mt={iconMt}
						fontFamily="Ionicons"
						name="add-circle"
						color="blue500"
						fontSize={iconSize}
					/>
				</Div>
			</Div>
		</TouchableOpacity>
	);
};
