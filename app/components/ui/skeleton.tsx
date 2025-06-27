import React from 'react';
import { View, ViewStyle, DimensionValue } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface SkeletonProps {
    className?: string;
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
 ...props
}: SkeletonProps) {
    return (
            <View
                style={[
                    {
                        width,
                        height,
                        borderRadius,
                    } as ViewStyle,
                    style
                ]}
                {...props}
            />
    );
}