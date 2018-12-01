import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizing, fontStyles } from '../../theme';
import RF from 'react-native-responsive-fontsize';

export default class RoundCounter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.view}>
                <Text numberOfLines={1} ellipsizeMode='middle' style={styles.text}>{this.props.round ? `Round ${this.props.round}` : 'Round 0'}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1 / 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryTextColor,
        borderRadius: 25
    },
    text: {
        fontSize: RF(10),
        fontWeight: fontStyles.bold,
        color: colors.mainBackgroundColor
    }
});