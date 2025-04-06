import {TouchableOpacity, Text, StyleSheet, TouchableOpacityProps} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import {cn} from "@/lib/utils";

const buttonVariant = cva(
    'w-full h-14 rounded-2xl p-2 flex flex-row justify-center items-center border',
    {
        variants: {
            variant: {
                default: 'bg-blue-600',
                destructive: 'bg-red-600',
                confirm: 'bg-green-600',
                dark: 'bg-zinc-800',
                outline: 'bg-transparent'
            }
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariant>  {
    classname?: string
}

const CustomButton = ({
    classname,
    variant,
    children,
    ...props
}: ButtonProps) => {
    return (
        <TouchableOpacity
            className={cn(buttonVariant({ variant }), classname)}
            {...props}
        >
            {children}
        </TouchableOpacity>
    )
}

export default CustomButton;