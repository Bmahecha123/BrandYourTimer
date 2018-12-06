import React from 'react';
import { StyleSheet, TextInput, View, Modal, Image, TouchableOpacity } from 'react-native';
import { colors, sizing, fontStyles } from '../../theme';
import RF from 'react-native-responsive-fontsize';
import { ColorPicker } from 'react-native-color-picker';

export default class ThemeModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                visible={this.props.isModalVisible}
                animationType='fade'
                supportedOrientations={['landscape']}
                onRequestClose={() => this.props.toggleModal()}>
                <View style={{
                    backgroundColor: this.props.backgroundColor,
                    flex: 1,
                    flexDirection: 'row'
                }} >
                    <View style={{ flex: 2 / 3 }}>
                        <Image style={{ ...styles.image, flex: 9 / 10, marginTop: sizing.xsmall }} resizeMode="contain" source={this.props.image} />
                        <TouchableOpacity onPress={this.props.handleColorConfirm} style={styles.confirmBtn}>
                            <Image style={styles.image} resizeMode="contain" source={require('../../assets/checkmark.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 / 3, flexDirection: 'column', backgroundColor: colors.timberWolf }}>
                        <TextInput style={styles.text} onChangeText={this.props.handleColorTextChange} defaultValue={this.props.backgroundColor} />
                        <ColorPicker
                            color={this.props.backgroundColor}
                            onColorChange={this.props.onColorChange}
                            onColorSelected={this.props.onColorChange}
                            style={{ flex: 4 / 5 }}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

const commonStyles = {
    button: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.timberWolf
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    text: {
        flex: 1 / 5,
        alignSelf: 'stretch',
        textAlign: 'center',

        fontSize: RF(5),
        fontWeight: fontStyles.bold
    },
    confirmBtn: {
        flex: 1 / 10,
        ...commonStyles.button,
        padding: sizing.xsmall,
        backgroundColor: colors.green,
        marginTop: sizing.xsmall,
        marginLeft: sizing.xlarge,
        marginRight: sizing.xlarge
    }
});