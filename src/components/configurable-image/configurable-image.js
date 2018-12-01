import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { sizing, colors } from '../../theme';

export default class ConfigurableImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.view}>
                <Image style={styles.image}  resizeMode="contain" source={require('../../assets/blog.jpg')} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    },  
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    }
});