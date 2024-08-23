import {TouchableOpacityProps} from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant ?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
    textVariant ?: 'primary' | 'secondary' | 'danger' | 'success' | 'default';
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;

}

