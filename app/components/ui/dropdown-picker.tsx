import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {useEffect, useState} from "react";
import {View} from "react-native";

interface DropdownPickerProps {
    items: ItemType<string>[];
    onChange: (value: string | null) => void;
    placeholder?: string;
}

const DropDownSelect = ({
    items,
    onChange,
    placeholder
}: DropdownPickerProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [dropDownItems, setDropDownItems] = useState(items);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <View>
            <DropDownPicker
                open={open}
                value={value}
                items={dropDownItems}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setDropDownItems}
                placeholder={placeholder}
                listMode={'SCROLLVIEW'}
                searchable={true}

            />
        </View>
    )
}

export default DropDownSelect