import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
	const token = useAuthStore((s) => s.token);
	const status = useAuthStore((s) => s.status);
	const setToken = useAuthStore((s) => s.setToken);

	return {
		token,
		status,
		setToken,
	};
};
