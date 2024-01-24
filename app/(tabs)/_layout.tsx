import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { faHome, faCamera, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{tabBarStyle: { borderTopWidth: 0, backgroundColor: 'transparent'}}}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faHome} color="#1B1B1B" size={30} />,
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faCamera} color="#1B1B1B" size={30} />,
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faUser} color="#1B1B1B" size={30} />,
        }}
      />
    </Tabs>
  );
}
