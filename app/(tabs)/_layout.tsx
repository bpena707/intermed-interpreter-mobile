import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import Colors from "@/constants/Colors";

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Today',
                    tabBarIcon: ({ color, size }) => <Ionicons name="today" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} name="history" color={color} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} name="line-chart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons size={size} name="person-circle-outline" color={color} />,
                }}
            />
            <Tabs.Screen
                name="rating"
                options={{
                    title: 'Rating',
                    tabBarIcon: ({ color, size }) => <Ionicons size={size} name="star" color={color} />,
                }}
            />
        </Tabs>
    );
}

export default TabLayout;