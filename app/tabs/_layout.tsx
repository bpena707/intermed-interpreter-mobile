import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import Colors from "@/constants/Colors";

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Appointments',
                    tabBarIcon: ({ color, size }) => <Ionicons name="today" size={size} color={color} />,
                    tabBarLabelStyle: { fontWeight: '600'},
                }}
            />

            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} name="line-chart" color={color} />,
                    tabBarLabelStyle: { fontWeight: '600'},
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons size={size} name="person-circle-outline" color={color} />,
                    tabBarLabelStyle: { fontWeight: '600'},
                }}
            />
            <Tabs.Screen
                name="rating"
                options={{
                    title: 'Rating',
                    tabBarIcon: ({ color, size }) => <Ionicons size={size} name="star" color={color} />,
                    tabBarLabelStyle: { fontWeight: '600'},
                }}
            />
        </Tabs>
    );
}

export default TabLayout;