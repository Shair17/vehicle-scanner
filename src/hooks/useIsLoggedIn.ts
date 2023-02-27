import { useAuth } from './useAuth';

export const useIsLoggedIn = () => {
	const { status, token } = useAuth();

	return !!token && status === 'authenticated';
};
