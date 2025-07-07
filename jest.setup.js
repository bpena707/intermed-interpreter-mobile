import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
});

// Mock Animated API
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-calendars
jest.mock('react-native-calendars', () => ({
    Calendar: 'Calendar',
    CalendarList: 'CalendarList',
    Agenda: 'Agenda',
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
    },
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
    }),
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
    AntDesign: 'AntDesign',
    FontAwesome6: 'FontAwesome6',
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
}));

// Mock date-fns
jest.mock('date-fns', () => ({
    format: jest.fn((date, formatString) => {
        if (formatString === 'hh:mm a') {
            return '10:30 AM';
        }
        return '2024-01-15';
    }),
    parse: jest.fn((timeString, formatString, referenceDate) => {
        return new Date(`2024-01-01T${timeString}`);
    }),
    addHours: jest.fn((date, hours) => {
        return new Date(date.getTime() + hours * 60 * 60 * 1000);
    }),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn(() => ({
        width: 375,
        height: 812,
    })),
}));

// Global test setup
global.__DEV__ = true;

// Mock console methods to keep tests clean
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};