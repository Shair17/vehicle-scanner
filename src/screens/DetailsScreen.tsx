import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { Div, Text, Button } from 'react-native-magnus';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../Root';
import { DetailItem } from '../components/DetailItem';

interface Props extends NativeStackScreenProps<StackParams, 'DetailsScreen'> {}

export const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const decodedVIN = route.params.decodedVIN.Results[0];

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			>
				<Div p="2xl">
					<Text mb="xl" fontWeight="400" fontSize="2xl">
						Results for{' '}
						<Text fontWeight="bold" fontSize="2xl">
							{decodedVIN.VIN}
						</Text>
					</Text>
					<DetailItem title="Make" content={decodedVIN.Make} />
					<DetailItem title="Model" content={decodedVIN.Model} />
					<DetailItem title="Year" content={decodedVIN.ModelYear} />
					<DetailItem title="Width" content={decodedVIN.Width} />
					<DetailItem title="Height" content={decodedVIN.Height} />
					<DetailItem
						title="Weight"
						content={decodedVIN.Weight || decodedVIN.CurbWeightLB}
					/>

					<Button
						mt="xl"
						fontWeight="500"
						fontSize="xl"
						rounded="lg"
						block
						onPress={() =>
							navigation.navigate('PhotosScreen', {
								decodedVIN: route.params.decodedVIN,
							})
						}
					>
						Take Photos
					</Button>
				</Div>
			</ScrollView>
		</SafeAreaView>
	);
};
