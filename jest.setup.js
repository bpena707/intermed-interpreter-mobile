import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
});

// Mock PixelRatio
jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    getPixelSizeForLayoutSize: jest.fn((layoutSize) => layoutSize * 2),
    roundToNearestPixel: jest.fn((layoutSize) => layoutSize),
}));


// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
}));

// Mock StyleSheet - IMPROVED VERSION
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => {
    const originalStyleSheet = {
        create: (styles) => styles,
        flatten: (style) => style,
        hairlineWidth: 1,
        absoluteFill: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        absoluteFillObject: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        compose: (style1, style2) => [style1, style2],
        roundToNearestPixel: (value) => Math.round(value),
    };

    return {
        __esModule: true,
        default: originalStyleSheet,
        ...originalStyleSheet,
    };
});

// Mock Expo modules
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
    },
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
    format: jest.fn(() => '10:30 AM'),
    parse: jest.fn(() => new Date('2024-01-01T10:30:00')),
    addHours: jest.fn((date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000)),
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

// Mock Expo EventEmitter
jest.mock('expo-modules-core', () => ({
    EventEmitter: jest.fn(() => ({
        addListener: jest.fn(),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
    })),
    NativeModulesProxy: {},
    requireNativeModule: jest.fn(),
}));

// Mock Clerk authentication
jest.mock('@clerk/clerk-expo', () => ({
    useAuth: jest.fn(() => ({
        isLoaded: true,
        isSignedIn: true,
        userId: 'mock-user-id',
        getToken: jest.fn().mockResolvedValue('mock-token'),
    })),
    useUser: jest.fn(() => ({
        isLoaded: true,
        user: {
            id: 'mock-user-id',
            firstName: 'Test',
            lastName: 'User',
        },
    })),
    ClerkProvider: ({ children }) => children,
}));

// Mock TanStack Query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
        clear: jest.fn(),
    })),
    QueryClient: jest.fn(),
    QueryClientProvider: ({ children }) => children,
}));

// Mock Axios
jest.mock('axios', () => ({
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(() => ({
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        })),
    },
}));

// Mock Expo Web Browser
jest.mock('expo-web-browser', () => ({
    openBrowserAsync: jest.fn(),
    dismissBrowser: jest.fn(),
}));

// Mock StyleSheet with proper module structure
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => {
    const StyleSheet = {
        create: jest.fn((styles) => styles),
        flatten: jest.fn((style) => style),
        hairlineWidth: 1,
        absoluteFill: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        absoluteFillObject: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        compose: jest.fn((style1, style2) => [style1, style2]),
        roundToNearestPixel: jest.fn((value) => Math.round(value)),
    };

    return {
        __esModule: true,
        default: StyleSheet,
        ...StyleSheet,
    };
});