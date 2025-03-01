import {Modal, Text, View} from "react-native";

interface FollowUpModalProps {
    visible: boolean;
    onClose: () => void;
}

const FollowUpModal = ({
    visible,
    onClose,
}: FollowUpModalProps) => {
    return(
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View>
                <Text>
                    Follow Up Modal
                </Text>
            </View>
        </Modal>
    )
}

export default FollowUpModal;
