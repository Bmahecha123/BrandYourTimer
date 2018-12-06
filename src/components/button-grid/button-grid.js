import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { sizing, colors, fontStyles } from '../../theme';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { TimerType } from '../../types';
import RF from 'react-native-responsive-fontsize';

export default class ButtonGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    onSwipe(gestureName, timerType) {
        const { SWIPE_UP, SWIPE_DOWN } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                this.props.onSwipeUp(timerType)
                break;
            case SWIPE_DOWN:
                this.props.onSwipeDown(timerType)
                break;
        }
    }

    render() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (
            <View style={styles.view}>
                <TouchableOpacity onPress={this.props.onPlay} style={styles.button}>
                    <Image style={styles.image} resizeMode="contain" source={this.props.isPlaying ? require('../../assets/pause.png') : require('../../assets/play.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onRefresh} style={styles.button}>
                    <Image style={styles.image} resizeMode="contain" source={require('../../assets/refresh.png')} />
                </TouchableOpacity>
                <GestureRecognizer
                    style={timerStyles.round}
                    onSwipe={(direction) => this.onSwipe(direction, TimerType.ROUND)} >
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.text}>{this.props.roundTime ? this.props.roundTime : 0}</Text>
                </GestureRecognizer>
                <GestureRecognizer
                    style={timerStyles.warn}
                    onSwipe={(direction) => this.onSwipe(direction, TimerType.WARN)} >
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.text}>{this.props.warnTime ? this.props.warnTime : 0}</Text>
                </GestureRecognizer>
                <GestureRecognizer
                    style={timerStyles.rest}
                    onSwipe={(direction) => this.onSwipe(direction, TimerType.REST)} >
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.text}>{this.props.restTime ? this.props.restTime : 0}</Text>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    button: {
        flex: 1,
        padding: sizing.small,
        backgroundColor: colors.timberWolf,
        borderRadius: 100
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    text: {
        fontSize: RF(10),
        color: colors.primaryTextColor,
        fontWeight: fontStyles.bold
    }
});

const timerStyles = StyleSheet.create({
    round: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: colors.green
    },
    warn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: colors.yellow
    },
    rest: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: colors.red
    }
});