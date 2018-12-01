import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizing, fontStyles } from '../../theme';
import RF from 'react-native-responsive-fontsize';

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.view, { backgroundColor: this.props.color }]}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.text}>{this.props.time ? this.props.time : 0}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 2/3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
        borderRadius: 25,
        marginTop: sizing.xsmall
    },
    text: {
        fontSize: RF(20),
        color: colors.primaryTextColor,
        fontWeight: fontStyles.bold
    }
});