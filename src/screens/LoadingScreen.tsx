import { StackParams } from '../Root';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoadingTemplate } from '../components/LoadingTemplate';

interface Props extends NativeStackScreenProps<StackParams, 'LoadingScreen'> {}

export const LoadingScreen: React.FC<Props> = () => {
	return <LoadingTemplate />;
};
