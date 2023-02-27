import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { Div, Text, Button, Input } from 'react-native-magnus';
import {
	BarCodeScannedCallback,
	BarCodeScanner,
	PermissionStatus,
} from 'expo-barcode-scanner';
import { useCameraPermissions } from '../hooks/useCameraPermissions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../Root';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import useAxios from 'axios-hooks';
import { DecodedVIN } from '../types/response';

interface VinState {
	encodedVIN: string;
	decodedVIN: string;
}

interface Props extends NativeStackScreenProps<StackParams, 'AskDataScreen'> {}

export const AskDataScreen: React.FC<Props> = ({ navigation }) => {
	const [scanned, setScanned] = useState<boolean>(false);
	const [vin, setVin] = useState<VinState>({
		decodedVIN: '',
		encodedVIN: '',
	});
	const [{ loading }, executeDecodeVin] = useAxios<DecodedVIN>(
		{
			method: 'GET',
		},
		{ manual: true }
	);
	const { hasPermission } = useCameraPermissions();

	const tapToScanAgain = () => {
		setVin({
			decodedVIN: '',
			encodedVIN: '',
		});
		setScanned(false);
	};

	const handleBarCodeScanned: BarCodeScannedCallback = ({ type, data }) => {
		if (scanned) return;

		setScanned(true);
		setVin({
			...vin,
			encodedVIN: data,
		});

		// Notifier.showNotification({
		// 	title: 'Success',
		// 	description: 'Success decoding VIN!',
		// 	Component: NotifierComponents.Alert,
		// 	componentProps: {
		// 		alertType: 'success',
		// 	},
		// });

		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	const decodeVin = async () => {
		if (!vin.encodedVIN) return;

		// console.log(vin.encodedVIN);

		executeDecodeVin({
			method: 'GET',
			url: `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues/${vin.encodedVIN}?format=json`,
		})
			.then((response) => {
				// console.log(response.data);

				// API retrieves this field '0' when there are no errors, so we can use this to validate if it's success or not
				const isSuccess = response.data.Results[0].ErrorCode === '0';

				if (isSuccess) {
					Notifier.showNotification({
						title: 'Success',
						description: 'Success decoding VIN!',
						Component: NotifierComponents.Alert,
						componentProps: {
							alertType: 'success',
						},
					});

					navigation.navigate('DetailsScreen', {
						decodedVIN: response.data,
					});
				} else {
					Notifier.showNotification({
						title: 'Error',
						description: 'Error decoding VIN!',
						Component: NotifierComponents.Alert,
						componentProps: {
							alertType: 'error',
						},
					});
				}
			})
			.catch((error) => {
				console.log(error);
				Notifier.showNotification({
					title: 'Error',
					description: 'Error decoding VIN!',
					Component: NotifierComponents.Alert,
					componentProps: {
						alertType: 'error',
					},
				});
			});
	};

	if (hasPermission === PermissionStatus.UNDETERMINED) {
		return (
			<Div flex={1} bg="#fff" alignItems="center" justifyContent="center">
				<Text fontSize="5xl" textAlign="center">
					Requesting for camera permission...
				</Text>
			</Div>
		);
	}

	if (hasPermission === PermissionStatus.DENIED) {
		return (
			<Div flex={1} bg="#fff" alignItems="center" justifyContent="center">
				<Text fontSize="5xl" textAlign="center">
					No access to camera.
				</Text>
			</Div>
		);
	}

	return (
		<Div flex={1} bg="#fff">
			<StatusBar backgroundColor="#fff" barStyle="dark-content" />
			<Div flex={1}>
				<Div
					mt={86}
					alignSelf="center"
					alignItems="center"
					justifyContent="center"
					h={300}
					w={300}
					overflow="hidden"
					rounded="lg"
				>
					<BarCodeScanner
						onBarCodeScanned={handleBarCodeScanned}
						style={{
							position: 'absolute',
							width: 400,
							height: 400,
						}}
						focusable
						type="back"
					/>
				</Div>

				<Div position="absolute" bottom={40} w="100%" p="xl">
					<Input
						placeholder="Insert VIN manually"
						mb="lg"
						value={vin.encodedVIN}
						onChangeText={(encodedVIN) => setVin({ ...vin, encodedVIN })}
					/>

					{scanned && false ? (
						<Input
							placeholder="Decoded VIN"
							mb="lg"
							value={vin.decodedVIN}
							onChangeText={(decodedVIN) => setVin({ ...vin, decodedVIN })}
						/>
					) : null}

					<Div row justifyContent="space-between">
						{scanned ? (
							<Button block w="48%" onPress={tapToScanAgain}>
								Tap to scan again
							</Button>
						) : null}
						<Button
							w={scanned ? '48%' : '100%'}
							onPress={decodeVin}
							loading={loading}
							h={55}
						>
							Decode VIN
						</Button>
					</Div>
				</Div>
			</Div>
		</Div>
	);
};
