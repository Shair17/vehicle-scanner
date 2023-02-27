import { Div, Text } from 'react-native-magnus';

interface Props {
	title: string;
	content: string;
}

export const DetailItem: React.FC<Props> = ({ title, content }) => {
	const contentIsAvailable = !!content;

	return (
		<Div mb="xl">
			<Text fontWeight="500" fontSize="3xl">
				{title}
			</Text>
			<Text fontSize="xl" color={contentIsAvailable ? '#000' : 'red500'}>
				{contentIsAvailable ? content : 'Not Available'}
			</Text>
		</Div>
	);
};
