import { FlatList, TouchableOpacity, Platform } from 'react-native';
import { Button, Div, Text, Image, Dropdown, Icon } from 'react-native-magnus';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../Root';
import { PressHereToUploadPhotos } from '../components/PressHereToUploadPhotos';
import { useUploadPhotos } from '../hooks/useUploadPhotos';
import { PhotoPreviewOverlay } from '../components/PhotoPreviewOverlay';
import useAxios from 'axios-hooks';
import { useAuth } from '../hooks/useAuth';
import { Notifier, NotifierComponents } from 'react-native-notifier';

interface Props extends NativeStackScreenProps<StackParams, 'PhotosScreen'> {}

export const PhotosScreen: React.FC<Props> = ({ navigation, route }) => {
	const decodedVIN = route.params.decodedVIN;
	const VIN = decodedVIN.Results[0].VIN;
	const { token } = useAuth();
	const [{ loading }, executeUploadPhotos] = useAxios(
		{
			method: 'POST',
			url: 'https://seawayexport.com/api/addDispatch',
		},
		{
			manual: true,
		}
	);
	const {
		currentSelectedPhoto,
		photos,
		photoDropdownRef,
		closePhotoDropdown,
		openPhotoDropdown,
		pickPhotoFromGallery,
		takePhoto,
		deletePhoto,
		photoPreviewOverlayVisible,
		closePhotoOverlay,
		openPhotoPreview,
	} = useUploadPhotos();
	const hasPhotos = !!photos && photos.length > 0;

	const handleOnButtonPress = () => {
		if (!hasPhotos) {
			navigation.popToTop();

			return;
		}

		const formData = new FormData();

		const newPhotos = photos.map((photo) => {
			const uri =
				Platform.OS === 'android'
					? photo.uri
					: photo.uri.replace('file://', '');
			const fileName = photo.uri.split('/').pop();
			const match = /\.(\w+)$/.exec(photo.fileName as string);
			const ext = match?.[1];
			const type = match ? `image/${match[1]}` : `image`;

			return {
				uri,
				fileName,
				type,
			};
		});

		formData.append('access_token', token!);
		formData.append('vin', VIN);
		formData.append('image[]', newPhotos as any);

		// here upload photos...
		executeUploadPhotos({
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
			.then((response) => {
				const data = response.data;

				const isSuccess = data?.success?.status_code === 200;

				if (isSuccess) {
					Notifier.showNotification({
						title: 'Success',
						description: data?.success?.message,
						Component: NotifierComponents.Alert,
						componentProps: {
							alertType: 'success',
						},
					});
				} else {
					Notifier.showNotification({
						title: 'Error',
						description: 'An unknown error has occurred.',
						Component: NotifierComponents.Alert,
						componentProps: {
							alertType: 'error',
						},
					});
				}

				navigation.popToTop();
			})
			.catch((error) => {
				Notifier.showNotification({
					title: 'Error',
					description: 'An unknown error has occurred.',
					Component: NotifierComponents.Alert,
					componentProps: {
						alertType: 'error',
					},
				});
			});
	};

	return (
		<Div flex={1}>
			<Div p="2xl" flex={1}>
				<Div flex={3}>
					{hasPhotos ? (
						<FlatList
							ListHeaderComponent={() => {
								return (
									<PressHereToUploadPhotos
										fontSize="xl"
										iconSize="xl"
										iconMt="xs"
										onPress={openPhotoDropdown}
									/>
								);
							}}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							style={{ flex: 1 }}
							data={photos}
							numColumns={2}
							renderItem={({ item, index }) => {
								return (
									<TouchableOpacity
										style={{ flex: 1 }}
										activeOpacity={0.8}
										onPress={() => openPhotoPreview(item.uri)}
										onLongPress={() => deletePhoto(item.uri)}
									>
										<Div flex={1} m={5} rounded="lg" h={150} overflow="hidden">
											<Image
												// rounded="lg"
												flex={1}
												source={{
													uri: item.uri,
												}}
											/>
										</Div>
									</TouchableOpacity>
								);
							}}
							keyExtractor={(item) => item.uri}
						/>
					) : (
						<PressHereToUploadPhotos onPress={openPhotoDropdown} />
					)}
				</Div>
				<Div mt="2xl">
					<Button
						fontWeight="600"
						block
						rounded="lg"
						fontSize="xl"
						h={55}
						bg="blue500"
						loading={loading}
						onPress={handleOnButtonPress}
						shadow="sm"
					>
						{hasPhotos ? 'Upload' : 'Cancel'}
					</Button>
				</Div>
			</Div>

			<Dropdown
				backdropColor="#000"
				ref={photoDropdownRef}
				title={
					<Text px="xl" color="gray500" pb="md" fontWeight="500">
						Upload photos
					</Text>
				}
				mt="md"
				pb="2xl"
				showSwipeIndicator={true}
				roundedTop="lg"
			>
				<Dropdown.Option
					value="TAKE_PHOTO"
					py="lg"
					px="xl"
					block
					fontWeight="500"
					prefix={
						<Icon
							name="camera"
							fontFamily="Ionicons"
							mr="lg"
							color="purple500"
							fontSize="4xl"
						/>
					}
					onPress={takePhoto}
				>
					Take photo
				</Dropdown.Option>
				<Dropdown.Option
					value="PICK_FROM_GALLERY"
					py="lg"
					px="xl"
					block
					fontWeight="500"
					prefix={
						<Icon
							name="images"
							fontFamily="Ionicons"
							mr="lg"
							color="indigo500"
							fontSize="4xl"
						/>
					}
					onPress={pickPhotoFromGallery}
				>
					Select from gallery
				</Dropdown.Option>
				<Dropdown.Option
					value="CANCEL_DROPDOWN"
					py="lg"
					px="xl"
					block
					fontWeight="500"
					prefix={
						<Icon
							name="close"
							fontFamily="Ionicons"
							mr="lg"
							fontSize="4xl"
							color="red500"
						/>
					}
					onPress={closePhotoDropdown}
				>
					Cancel
				</Dropdown.Option>
			</Dropdown>

			{photoPreviewOverlayVisible ? (
				<PhotoPreviewOverlay
					avatar={{
						uri: currentSelectedPhoto,
					}}
					photoPreviewOverlayVisible={photoPreviewOverlayVisible}
					closePhotoOverlay={closePhotoOverlay}
				/>
			) : null}
		</Div>
	);
};
