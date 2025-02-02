import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

export default function Tab() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.modalContainer}>
                <Text>Lookup patient </Text>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white', // This is the modal's content background; adjust as needed
        borderRadius: 10,
        padding: 20,
        // Optionally, add a shadow or elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
