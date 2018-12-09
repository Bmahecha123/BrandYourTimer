import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ButtonGrid from '../../components/button-grid/button-grid';
import { colors, sizing } from '../../theme';
import ConfigurableImage from '../../components/configurable-image/configurable-image';
import RoundCounter from '../../components/round-counter/round-counter';
import Timer from '../../components/timer/timer';
import { Time } from '../../types';
import ImagePicker from 'react-native-image-picker';
import { Player } from 'react-native-audio-toolkit';
import { fromHsv } from 'react-native-color-picker';
import ThemeModal from '../theme-modal/theme-modal';

const DEFAULT_IMAGE = require('../../assets/image.png');
const IMAGEKEY = 'BYT_LOGO';
const BGCOLORKEY = 'BYT_BACKGROUND_COLOR';

export default class TimerMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ROUND: Time.MINUTES.FIVE,
            WARN: Time.SECONDS.FIFTEEN,
            REST: Time.MINUTES.ONE,
            isPlaying: false,
            isResting: false,
            timerBackground: colors.timberWolf,
            roundNumber: 1,
            image: DEFAULT_IMAGE,
            isModalVisible: false
        }
    }

    componentDidMount = async () => {
        await this.setDefaultImage();
        await this.setDefaultBackgroundColor();
        await this.handleRefresh();
    }

    setDefaultImage = async () => {
        try {
            const value = await AsyncStorage.getItem(IMAGEKEY);
            if (value !== null) {
                await this.setState({
                    image: {
                        uri: value
                    }
                });
            }
        } catch (error) {
            console.log('Error setting previous image, setting back to default.');
            await this.setState({
                image: DEFAULT_IMAGE
            });
        }
    }

    setDefaultBackgroundColor = async () => {
        try {
            const value = await AsyncStorage.getItem(BGCOLORKEY);
            if (value !== null) {
                this.props.onUpdateBackground(value);
            }
        } catch (error) {
            console.log('Error setting previous background color, setting back to default.');
        }
    }

    saveToStorage = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('Error saving image to storage.');
            console.log(error);
        }
    }

    handleOpeningImagePicker = async () => {
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
                this.saveToStorage(IMAGEKEY, response.uri);
                this.setState({
                    image: {
                        uri: response.uri
                    }
                });
                this.toggleModal();
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
            if (this.state.timer <= this.state.WARN) {
                if (this.state.timer === this.state.WARN) {
                    new Player('warn.mp3').play();
                }
                this.setState({
                    timerBackground: colors.yellow
                });
            }
            else {
                this.setState({
                    timerBackground: colors.green
                });
            }
        }
    }

    timerStart = () => {
        new Player('timer.mp3').play();
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

    toggleModal = () => {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        });
    }

    handleColorChange = async (color) => {
        await this.saveToStorage(BGCOLORKEY, color);
        this.props.onUpdateBackground(fromHsv(color));
    }

    handleColorConfirm = () => {
        this.toggleModal();
    }

    handleColorTextChange = (color) => {
        this.props.onUpdateBackground(color);
    }

    render() {
        return (
            <View style={styles.container}>
                <ThemeModal
                    isModalVisible={this.state.isModalVisible}
                    toggleModal={this.toggleModal}
                    backgroundColor={this.props.backgroundColor}
                    image={this.state.image}
                    onColorChange={this.handleColorChange}
                    handleColorConfirm={this.handleColorConfirm}
                    handleColorTextChange={this.handleColorTextChange} />

                <View style={styles.row}>
                    <View style={{ flex: 2 / 3, marginRight: sizing.xsmall }}>
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
const commonStyles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: sizing.small
    },
}

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container
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