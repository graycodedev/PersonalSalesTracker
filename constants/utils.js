import { Platform, StatusBar } from 'react-native';

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = (10 * 3.5 + (StatusHeight || 0));
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);

