import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { sizing, colors } from '../../theme';

export default class ConfigurableImage extends React.Component {
    constructor(props) {
        super(props);
    }

    onOpeningImagePicker = () => {
        this.props.onImagePress();
    }

    render() {
        return (
            <TouchableOpacity style={styles.view} onPress={this.onOpeningImagePicker}>
                <Image style={styles.image} resizeMode="contain" source={this.props.image} />
            </TouchableOpacity>
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