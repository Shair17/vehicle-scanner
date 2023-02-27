import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { DropdownRef } from 'react-native-magnus';
import * as ImagePicker from 'expo-image-picker';
import { Notifier } from 'react-native-notifier';

export const useUploadPhotos = () => {
	const [photos, setPhotos] =
		useState<ImagePicker.ImagePickerResult['assets']>(null);
	const photoDropdownRef = useRef<DropdownRef>(null);
	const [photoPreviewOverlayVisible, setPhotoPreviewOverlayVisible] =
		useState<boolean>(false);
	const [currentSelectedPhoto, setCurrentSelectedPhoto] = useState<
		string | undefined
	>(undefined);

	const takePhoto = async () => {
		try {
			const { status } = await ImagePicker.requestCameraPermissionsAsync();

			if (status === ImagePicker.PermissionStatus.GRANTED) {
				const { assets, canceled } = await ImagePicker.launchCameraAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					// base64: true,
					quality: 1,
					allowsMultipleSelection: true,
				});

				if (canceled) {
					return;
				}

				if (photos == null) {
					setPhotos(assets);
				} else {
					setPhotos([...photos, ...assets]);
				}
			} else {
				Notifier.showNotification({
					title: 'Error',
					description:
						'Camerra permissions denied by you, please allow permissions.',
				});
			}
		} catch (error) {
			// console.log(error);

			Notifier.showNotification({
				title: 'Error',
				description: 'An unknown error has occurred.',
			});
		}
	};

	const pickPhotoFromGallery = async () => {
		try {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (status === ImagePicker.PermissionStatus.GRANTED) {
				const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					// base64: true,
					quality: 1,
					allowsMultipleSelection: true,
				});

				if (canceled) {
					return;
				}

				if (photos == null) {
					setPhotos(assets);
				} else {
					setPhotos([...photos, ...assets]);
				}
			}
		} catch (error) {
			// console.log(error);

			Notifier.showNotification({
				title: 'Error',
				description: 'An unknown error has occurred.',
			});
		}
	};

	const openPhotoDropdown = () => {
		photoDropdownRef.current?.open();
	};

	const closePhotoDropdown = () => {
		photoDropdownRef.current?.close();
	};

	const openPhotoOverlay = () => {
		setPhotoPreviewOverlayVisible(true);
	};

	const closePhotoOverlay = () => {
		setPhotoPreviewOverlayVisible(false);
	};

	const setPhotoOverlay = (photo: string) => {
		setCurrentSelectedPhoto(photo);
	};

	const openPhotoPreview = (photo: string) => {
		setPhotoOverlay(photo);
		openPhotoOverlay();
	};

	const deletePhoto = (photoUri: string) => {
		Alert.alert('Delete photo', 'Are you sure to delete this photo?', [
			{
				text: 'No',
				style: 'cancel',
			},
			{
				text: 'Yes',
				onPress: () => {
					if (!photos) return;

					setPhotos(photos.filter((photo) => photo.uri !== photoUri));
				},
			},
		]);
	};

	return {
		deletePhoto,
		openPhotoPreview,
		currentSelectedPhoto,
		closePhotoOverlay,
		openPhotoOverlay,
		photoPreviewOverlayVisible,
		photos,
		photoDropdownRef,
		openPhotoDropdown,
		closePhotoDropdown,
		takePhoto,
		pickPhotoFromGallery,
	};
};
