import {TouchableOpacity, Text, StyleSheet, TouchableOpacityProps} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import {cn} from "@/lib/utils";

// const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
//     switch (variant) {
//         case 'secondary':
//             return 'bg-gray-500'
//         case "danger":
//             return "bg-red-600";
//         case "success":
//             return "bg-green-500";
//         case "outline":
//             return "bg-transparent border-neutral-300 border-[0.5px]";
//         default:
//             return "bg-[#24a0ed]";
//     }
// }
//
// const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
//     switch (variant) {
//         case "primary" :
//             return "text-black"
//         case "secondary":
//             return "text-gray-100";
//         case "danger":
//             return "text-red-100";
//         case "success":
//             return "text-green-100";
//         default:
//             return "text-white";
//     }
// };



const buttonVariant = cva(
    'w-full h-14 rounded-2xl p-2 flex flex-row justify-center items-center border ',
    {
        variants: {
            variant: {
                default: 'bg-black',
                destructive: 'bg-red-800',
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




// const CustomButton = ({
// onPress,
// title,
// bgVariant = "primary",
// textVariant = "default",
// IconLeft,
// IconRight,
// className,
// ...props
// }: ButtonProps) => {
//     return (
//         <TouchableOpacity
//             onPress={onPress}
//             className={`w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
//             {...props}
//         >
//             {IconLeft && <IconLeft />}
//             <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
//                 {title}
//             </Text>
//             {IconRight && <IconRight />}
//         </TouchableOpacity>
//     );
// };

export default CustomButton;

