import { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Div, Text } from 'react-native-magnus';
import { PermissionStatus } from 'expo-barcode-scanner';
import { useCameraPermissions } from '../hooks/useCameraPermissions';

export const TestScreen = () => {
	const { hasPermission } = useCameraPermissions();

	const toggleActiveState = async () => {
		// if (barcodes && barcodes.length > 0 && isScanned === false) {
		//   setIsScanned(true);
		//   // setBarcode('');
		//   barcodes.forEach(async (scannedBarcode: any) => {
		//     if (scannedBarcode.rawValue !== '') {
		//       setBarcode(scannedBarcode.rawValue);
		//       Alert.alert(barcode);
		//     }
		//   });
		// }
	};

	// useEffect(() => {
	//   toggleActiveState();
	//   return () => {
	//     barcodes;
	//   };
	// }, [barcodes]);

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
			<StatusBar barStyle="light-content" backgroundColor="#000000" />

			{/* <RNHoleView
        holes={[
          {
            // x: widthToDp('8.5%'),
            // y: heightToDp('36%'),
            // width: widthToDp('83%'),
            // height: heightToDp('20%'),

            x: 10,
            y: 45,
            width: 100,
            height: 200,
            borderRadius: 10,
          },
        ]}
        style={styles.rnholeView}
      /> */}
		</Div>
	);
};
