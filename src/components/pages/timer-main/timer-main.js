import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ButtonGrid from '../../button-grid/button-grid';
import { colors, spacing, sizing } from '../../../theme';
import ConfigurableImage from '../../configurable-image/configurable-image';
import RoundCounter from '../../round-counter/round-counter';
import Timer from '../../timer/timer';
import { Time, TimerType } from '../../../types';
import ImagePicker from 'react-native-image-picker';

export default class TimerMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ROUND: Time.MINUTES.ONE,
            WARN: Time.SECONDS.FIFTEEN,
            REST: Time.MINUTES.ONE,
            timer: Time.MINUTES.SIX,
            isPlaying: false,
            isResting: false,
            timerBackground: colors.timberWolf,
            roundNumber: 1,
            image: require('../../../assets/blog.jpg')
        }
    }

    handleOpeningImagePicker = () => {
        //alert('i got clicked!');
        const options = {
            title: 'Select Logo',
            cancelButtonTitle: 'Cancel',
            cameraType: 'front',
            mediaType: 'photo',
            storageOptions: {
                cameraRoll: true,
                waitUntilSaved: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log(`Response = ${response}`);

            if (response.didCancel) {
                console.log('User cancelled image picker.');
            } else if (response.error) {
                console.log(`ImagePicker Error: ${response.error}`);
            } else {
                const source = { uri: response.uri };

                alert(response.uri);

                this.setState({
                    image: source
                });
            }
        });
    }

    handleSwipeUp = async (timerType) => {
        if (this.state[timerType] < Time.MINUTES.NINETYNINE) {
            if (this.state[timerType] < Time.SECONDS.SIXTY)
                await this.setState({
                    [timerType]: this.state[timerType] + Time.SECONDS.FIFTEEN
                });
            else if (this.state[timerType] < Time.MINUTES.FIVE)
                await this.setState({
                    [timerType]: this.state[timerType] + Time.SECONDS.THIRTY
                });
            else
                await this.setState({
                    [timerType]: this.state[timerType] + Time.MINUTES.ONE
                });

            await this.setState({
                timer: this.state.ROUND
            });
        }
    }

    handleSwipeDown = async (timerType) => {
        if (this.state[timerType] > 0) {
            if (this.state[timerType] <= Time.MINUTES.ONE)
                await this.setState({
                    [timerType]: this.state[timerType] - Time.SECONDS.FIFTEEN
                });
            else if (this.state[timerType] <= Time.MINUTES.FIVE)
                await this.setState({
                    [timerType]: this.state[timerType] - Time.SECONDS.THIRTY
                });
            else
                await this.setState({
                    [timerType]: this.state[timerType] - Time.MINUTES.ONE
                });

            await this.setState({
                timer: this.state.ROUND
            });
        }
    }

    handlePlay = async () => {
        await this.setState({ isPlaying: !this.state.isPlaying });

        if (this.state.isPlaying) {
            console.log('starting timer;');
            this.timerStart();
            this.setTimerBackgroundColor();
        }
        else {
            clearInterval(this.timerInterval)
            await this.setState({
                timerBackground: colors.timberWolf
            });
        }
    }

    handleRefresh = async () => {

        clearInterval(this.timerInterval);
        await this.setState({
            isPlaying: false,
            isResting: false,
            ROUND: this.state.ROUND,
            WARN: this.state.WARN,
            REST: this.state.REST,
            timer: this.state.ROUND,
            roundNumber: 1,
            timerBackground: colors.timberWolf
        });
    }

    setTimerBackgroundColor = () => {
        if (!this.state.isResting) {
            if (this.state.timer <= this.state.WARN)
                this.setState({
                    timerBackground: colors.yellow
                });
            else
                this.setState({
                    timerBackground: colors.green
                });
        }
    }

    timerStart = () => {
        this.timerInterval = setInterval(() => {
            this.setState({
                timer: this.state.timer - Time.SECONDS.ONE
            }, () => {
                this.setTimerBackgroundColor();
                if (this.state.timer === 0)
                    this.roundEnds();
            });
        }, 1000);
    }

    roundEnds = async () => {
        clearInterval(this.timerInterval);
        if (this.state.isResting) {
            await this.setState({
                isResting: false,
                timerBackground: colors.green,
                timer: this.state.ROUND
            });
        } else {
            await this.setState({
                isResting: true,
                timer: this.state.REST,
                timerBackground: colors.red,
                roundNumber: this.state.roundNumber + 1
            });
        }
        this.timerStart();
    }

    convertToMinutes = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);

        return (
            seconds == 60 ?
                `${minutes + 1}:00` :
                `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={{ flex: 2 / 3 }}>
                        <ConfigurableImage onImagePress={this.handleOpeningImagePicker} image={this.state.image} />
                    </View>
                    <View style={{ flex: 1 / 3, flexDirection: 'column' }}>
                        <RoundCounter round={this.state.roundNumber} />
                        <Timer isPlaying={this.state.isPlaying} isResting={this.state.isResting} time={this.convertToMinutes(this.state.timer)} color={this.state.timerBackground} />
                    </View>
                </View>

                <ButtonGrid
                    style={styles.buttonGrid}
                    onSwipeUp={this.handleSwipeUp}
                    onSwipeDown={this.handleSwipeDown}
                    onPlay={this.handlePlay}
                    onRefresh={this.handleRefresh}
                    isPlaying={this.state.isPlaying}
                    roundTime={this.convertToMinutes(this.state.ROUND)}
                    warnTime={this.convertToMinutes(this.state.WARN)}
                    restTime={this.convertToMinutes(this.state.REST)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainBackgroundColor,
        margin: sizing.small
    },
    row: {
        flex: 3,
        flexDirection: 'row',
        marginBottom: sizing.xsmall
    },
    buttonGrid: {
        flex: 1,
        alignSelf: 'flex-end'
    }
});