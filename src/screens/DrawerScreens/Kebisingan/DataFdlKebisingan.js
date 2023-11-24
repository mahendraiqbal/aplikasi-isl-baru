import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const DataFdlKebisingan = ({navigation}) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 25,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}>
                        DATA FDL KEBISINGAN
                    </Text>
                    <TouchableOpacity>
                        <Text>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default DataFdlKebisingan;