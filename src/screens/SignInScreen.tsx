import { useState } from 'react';
import {
	StatusBar,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Keyboard,
	Platform,
} from 'react-native';
import { Button, Div, Icon, Input, Text } from 'react-native-magnus';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParams } from '../Root';
import useAxios from 'axios-hooks';
import { useAuth } from '../hooks/useAuth';
import { Notifier, NotifierComponents } from 'react-native-notifier';

type SignInResponse = {
	status: 'success' | 'error';
	message: string;
	access_token: string;
};

type SignInBody = {};

type SignInError = {
	status: 'success' | 'error';
	message: string;
	access_token: string;
};

interface Props extends NativeStackScreenProps<StackParams, 'SignInScreen'> {}

export const SignInScreen: React.FC<Props> = ({ navigation }) => {
	const [form, setForm] = useState({
		username: '',
		password: '',
	});
	const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
	const [{ loading }, executeSignIn] = useAxios<
		SignInResponse,
		SignInBody,
		SignInError
	>(
		{
			url: 'https://seawayexport.com/api/checkUserLogin',
			method: 'POST',
		},
		{
			manual: true,
		}
	);
	const { setToken } = useAuth();

	const togglePasswordVisibility = () => setPasswordHidden(!passwordHidden);

	const handleSignIn = () => {
		if (!form.password || !form.password) {
			Notifier.showNotification({
				title: 'Error',
				description: 'Please insert your username and password.',
				Component: NotifierComponents.Alert,
				componentProps: {
					alertType: 'error',
				},
			});
			return;
		}

		executeSignIn({
			params: {
				username: form.username,
				userpassword: form.password,
			},
		})
			.then((response) => {
				const data = response.data;

				if (data.status === 'error') {
					Notifier.showNotification({
						title: 'Error',
						description: data.message,
						Component: NotifierComponents.Alert,
						componentProps: {
							alertType: 'error',
						},
					});
					return;
				}

				console.log(data);

				setToken(data.access_token);
			})
			.catch((error) => {
				console.log(error);
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
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<StatusBar
				backgroundColor="#fff"
				barStyle="dark-content"
				translucent={false}
			/>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
				<Div flex={1} bg="body">
					<Div flex={1} p="2xl">
						<Div flex={4}>
							<Div>
								<Text fontWeight="bold" color="#000" fontSize="5xl">
									Welcome back!
								</Text>
								<Text mt="lg" fontSize="md" color="gray700">
									We are happy to see you there, log in to. Have a good day :)
								</Text>
							</Div>

							<Div mt="2xl">
								<Input
									bg="body"
									color="#000"
									focusBorderColor="blue500"
									fontWeight="500"
									placeholder="Username"
									rounded="lg"
									keyboardType="default"
									autoCapitalize="none"
									onChangeText={(username) => setForm({ ...form, username })}
									value={form.username}
									prefix={
										<Icon name="person" color="#000" fontFamily="Ionicons" />
									}
								/>

								<Div my="md" />

								<Input
									bg="body"
									color="#000"
									focusBorderColor="blue500"
									fontWeight="500"
									placeholder="Password"
									secureTextEntry={passwordHidden}
									rounded="lg"
									onChangeText={(password) => setForm({ ...form, password })}
									value={form.password}
									prefix={
										<Icon
											name="lock-closed"
											color="#000"
											fontFamily="Ionicons"
										/>
									}
									suffix={
										<TouchableOpacity
											onPress={togglePasswordVisibility}
											activeOpacity={0.6}
										>
											<Icon
												name={passwordHidden ? 'eye' : 'eye-off'}
												color="#000"
												fontFamily="Ionicons"
												fontSize="xl"
											/>
										</TouchableOpacity>
									}
								/>

								<Div my="md" />
							</Div>
						</Div>
						<Div flex={2} justifyContent="flex-end">
							<Button
								fontWeight="600"
								block
								rounded="lg"
								fontSize="xl"
								h={55}
								bg="blue500"
								loading={loading}
								onPress={handleSignIn}
								shadow="sm"
							>
								Log in
							</Button>
						</Div>
					</Div>
				</Div>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
