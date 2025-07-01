// app/components/ui/skeleton.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, DimensionValue } from 'react-native';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({
 width = '100%',
 height = 20,
 borderRadius = 8,
 style,
 }: SkeletonProps) {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#E1E9EE',
                    opacity: fadeAnim,
                },
                style,
            ]}
        />
    );
}

// Skeleton container for grouping
export function SkeletonContainer({ children }: { children: React.ReactNode }) {
    return <View>{children}</View>;
}