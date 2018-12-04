import React from 'react';
import { Platform, View } from 'react-native';
import TimerMain from './src/components/pages/timer-main/timer-main';
import { colors } from './src/theme';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: colors.mainBackgroundColor
    };
  }

  handleUpdateBackground = (color) => {
    this.setState({
      backgroundColor: color
    });
  }

  render() {
    return (
      <View style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}>
        <TimerMain backgroundColor={this.state.backgroundColor} onUpdateBackground={this.handleUpdateBackground} />
      </View>
    );
  }
}
