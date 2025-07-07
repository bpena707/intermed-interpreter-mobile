module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Use existing file
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testMatch: [
        '**/__tests__/**/*.(ts|tsx|js|jsx)',
        '**/*.(test|spec).(ts|tsx|js|jsx)'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-calendars)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        // Completely bypass NativeWind
        '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
        '^nativewind/(.*)$': '<rootDir>/__mocks__/nativewind.js',
    },
};