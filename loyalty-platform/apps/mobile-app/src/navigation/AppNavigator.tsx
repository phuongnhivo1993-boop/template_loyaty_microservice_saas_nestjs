import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ReferralsScreen from '../screens/ReferralsScreen';
import BadgesScreen from '../screens/BadgesScreen';
import VouchersScreen from '../screens/VouchersScreen';
import MissionsScreen from '../screens/MissionsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import RewardDetailScreen from '../screens/RewardDetailScreen';
import NotificationCenterScreen from '../screens/NotificationCenterScreen';
import CheckinScreen from '../screens/CheckinScreen';
import { useAuthStore } from '../services/authStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Rewards" component={RewardsScreen} />
          <Stack.Screen name="RewardDetail" component={RewardDetailScreen} />
          <Stack.Screen name="Referrals" component={ReferralsScreen} />
          <Stack.Screen name="Badges" component={BadgesScreen} />
          <Stack.Screen name="Vouchers" component={VouchersScreen} />
          <Stack.Screen name="Missions" component={MissionsScreen} />
          <Stack.Screen name="Password" component={PasswordScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationCenterScreen} />
          <Stack.Screen name="Checkin" component={CheckinScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
