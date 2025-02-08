import * as React from "react";
import { Switch} from "react-native";


export interface SwitchProps {
    className?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const CustomSwitch = React.forwardRef<Switch, SwitchProps>(
    ({ className, value, onValueChange }, ref) => {
        return (
            <Switch
                className={`rounded-full p-2 transition-colors duration-100 ease-in-out relative ${className}`}
                value={value}
                onValueChange={onValueChange}
                ref={ref}
            />
        );
    }
);

export { CustomSwitch };