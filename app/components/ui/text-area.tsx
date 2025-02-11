import * as React from 'react';
import {TextInput, TextInputProps} from 'react-native';

import {cn} from '@/lib/utils';

export interface InputProps extends TextInputProps {
    className?: string;
}

const TextArea = React.forwardRef<TextInput, InputProps>(({className, ...props}, ref) => {
    return (
        <TextInput
            className={`h-24 w-full rounded-xl border border-gray-300 bg-white px-3 py-1 pt-1 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-4 ${className}`}
            ref={ref}
            multiline
            numberOfLines={4}
            textAlignVertical={'top'}
            {...props}
        />
    );
});

export {TextArea};