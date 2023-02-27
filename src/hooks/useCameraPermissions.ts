import { useEffect, useState } from 'react';
import { PermissionStatus, BarCodeScanner } from 'expo-barcode-scanner';

export const useCameraPermissions = () => {
	const [hasPermission, setHasPermission] = useState<PermissionStatus>(
		PermissionStatus.UNDETERMINED
	);

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();

			setHasPermission(status);
		};

		getBarCodeScannerPermissions();
	}, []);

	return { hasPermission };
};
