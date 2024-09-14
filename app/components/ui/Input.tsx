import * as React from "react"
import {TextInput, TextInputProps} from 'react-native'

import { cn } from "@/lib/utils"

export interface InputProps
    extends TextInputProps {
    classname? :string
}

const Input = React.forwardRef<TextInput, InputProps>(
    ({ className,inputMode, ...props }, ref) => {
        return (
            <TextInput
                inputMode={inputMode}
                className={`h-12 w-[300px] items-center rounded-xl border border-gray-300 bg-white px-3 py-3 text-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-2 ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
