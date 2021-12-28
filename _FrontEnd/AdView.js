import React from 'react';
import { View, Text } from 'react-native';

export default function addContainer() {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            height: 100
        }}>
            <Text>Your Ad Here!</Text>
        </View>
    );
};
