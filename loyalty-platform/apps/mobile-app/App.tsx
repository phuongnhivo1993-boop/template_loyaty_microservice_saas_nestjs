import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/services/authStore';
import { useWsStore } from './src/services/wsStore';

const TOKEN_KEY = 'auth_token';
const queryClient = new QueryClient();

function AppContent() {
  const token = useAuthStore(s => s.token);
  const connect = useWsStore(s => s.connect);
  const disconnect = useWsStore(s => s.disconnect);

  useEffect(() => {
    if (token) {
      connect(token);
    } else {
      disconnect();
    }
    return () => { disconnect(); };
  }, [token]);

  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  const setToken = useAuthStore(s => s.setToken);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then(t => {
      if (t) setToken(t);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
