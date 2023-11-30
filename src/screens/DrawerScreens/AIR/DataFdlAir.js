import React from 'react';
import { view, Text, Button, StyleSheet } from 'react-native';

const DataFdlAir = ({navigation}) => {
    <view style={styles.container}>
        <Text>Add Screen Fdl Air</Text>
        <Button title='Click Test'>
            onPress={()=> alert('button di click')}
        </Button>
    </view>
}

export default DataFdlAir;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'top',
        justifyContent : 'top',
        backgroundColor : '#8fcbbc'
    },
});