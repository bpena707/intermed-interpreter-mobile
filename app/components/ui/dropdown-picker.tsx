import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {useEffect, useState} from "react";
import {View} from "react-native";
import {current} from "@react-native-community/cli-tools/build/releaseChecker";

interface DropdownPickerProps {
    items: ItemType<string>[]
    onChange: (value: string | null) => void
    placeholder?: string
    value?: string
}

const DropDownSelect = ({
    items,
    onChange,
    placeholder,
    value: externalValue
}: DropdownPickerProps) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | null>(externalValue ?? null);
    const [dropDownItems, setDropDownItems] = useState(items);
    const [loading, setLoading] = useState(false);

    // set the value of the dropdown to the external value if it is defined, otherwise use the internal value

    //call the onchange function when the value changes
    useEffect(() => {
        onChange(internalValue ?? '');
    }, [internalValue]);

    return (
        <View style={{ elevation: 9999, overflow: 'visible', position: 'relative', zIndex: 9999 }} >
            <DropDownPicker
                open={open}
                value={internalValue}
                items={dropDownItems}
                setOpen={setOpen}
                setValue={setInternalValue}
                setItems={setDropDownItems}
                placeholder={placeholder}
                listMode={'SCROLLVIEW'}
                searchable={true}
                loading={loading}
                style={{ width: '100%' }}
                dropDownDirection={'TOP'} //dropdown direction was specified as top because if down, the z index appears behind other elements on the page
            />
        </View>
    )
}

export default DropDownSelect