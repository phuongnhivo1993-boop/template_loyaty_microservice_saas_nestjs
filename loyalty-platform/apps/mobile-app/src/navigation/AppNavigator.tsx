import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
import PointsHistoryScreen from '../screens/PointsHistoryScreen';
import MembershipCardScreen from '../screens/MembershipCardScreen';
import TierProgressScreen from '../screens/TierProgressScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import VoucherDetailScreen from '../screens/VoucherDetailScreen';
import KYCUploadScreen from '../screens/KYCUploadScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CashbackScreen from '../screens/CashbackScreen';
import StoresScreen from '../screens/StoresScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import CreateOrderScreen from '../screens/CreateOrderScreen';
import CancelOrderScreen from '../screens/CancelOrderScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import GiftCardScreen from '../screens/GiftCardScreen';
import StoreDetailScreen from '../screens/StoreDetailScreen';
import { useAuthStore } from '../services/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Rewards: { active: 'gift', inactive: 'gift-outline' },
  Orders: { active: 'receipt', inactive: 'receipt-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function TabIcon({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  const icon = TAB_ICONS[label] || { active: 'ellipse', inactive: 'ellipse-outline' };
  return <Ionicons name={focused ? icon.active : icon.inactive} size={24} color={color} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => <TabIcon label={route.name} focused={focused} color={color} />,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB', paddingBottom: 4, height: 56 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Rewards" component={RewardsScreen} options={{ tabBarLabel: 'Rewards' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: 'Orders' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="RewardDetail" component={RewardDetailScreen} />
          <Stack.Screen name="Referrals" component={ReferralsScreen} />
          <Stack.Screen name="Badges" component={BadgesScreen} />
          <Stack.Screen name="Vouchers" component={VouchersScreen} />
          <Stack.Screen name="VoucherDetail" component={VoucherDetailScreen} />
          <Stack.Screen name="Missions" component={MissionsScreen} />
          <Stack.Screen name="Password" component={PasswordScreen} />
          <Stack.Screen name="Notifications" component={NotificationCenterScreen} />
          <Stack.Screen name="Checkin" component={CheckinScreen} />
          <Stack.Screen name="PointsHistory" component={PointsHistoryScreen} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="MembershipCard" component={MembershipCardScreen} />
          <Stack.Screen name="TierProgress" component={TierProgressScreen} />
          <Stack.Screen name="KYCUpload" component={KYCUploadScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Cashback" component={CashbackScreen} />
          <Stack.Screen name="Stores" component={StoresScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
          <Stack.Screen name="CancelOrder" component={CancelOrderScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="GiftCards" component={GiftCardScreen} />
          <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
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
