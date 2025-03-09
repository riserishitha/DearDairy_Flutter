import { Tabs } from 'expo-router';
import { Book, SquarePen as PenSquare } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Entries',
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="new-entry"
        options={{
          title: 'New Entry',
          tabBarIcon: ({ color, size }) => <PenSquare size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}