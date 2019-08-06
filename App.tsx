import React, { Component } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { height } = Dimensions.get('screen');

const BAR_SIZE = 100;
const TRESHOLD = height - BAR_SIZE;

export default class App extends Component {
  beganWith = 0;
  aContainer = new Animated.Value(BAR_SIZE);
  aMove = new Animated.Value(0);
  aCurrent?: Animated.CompositeAnimation;

  handleGestureEvent = e => {
    if (this.beganWith >= TRESHOLD) {
      Animated.event([{ nativeEvent: { translationY: this.aMove } }])(e);
    }
  };

  handleStateChange = (e) => {
    const { nativeEvent: { state, absoluteY, translationY } } = e;

    if (state === State.END && this.beganWith > TRESHOLD) {
      this.aCurrent = Animated.timing(this.aContainer, {
        toValue: translationY > 0 ? BAR_SIZE : 0,
        duration: 150,
      });

      this.aCurrent.start(() => {
        this.aCurrent = undefined;
        this.aMove.setValue(0);
      });
    } else if (state === State.BEGAN) {
      this.beganWith = absoluteY;
      this.aCurrent && this.aCurrent.stop();
    }
  };

  openBasket = () => {
    Animated.spring(this.aContainer, {
      toValue: 0
    }).start();
  };

  render() {
    const animatedValue = Animated.add(
      this.aMove,
      this.aContainer
    );

    const containerPosition = animatedValue.interpolate({
      inputRange: [0, BAR_SIZE],
      outputRange: [0, -BAR_SIZE],
      extrapolate: 'clamp',
    });

    const badgePosition = animatedValue.interpolate({
      inputRange: [0, BAR_SIZE],
      outputRange: [-10, -25],
      extrapolate: 'clamp',
    });

    return (
      <PanGestureHandler
        onGestureEvent={this.handleGestureEvent}
        onHandlerStateChange={this.handleStateChange}
        minPointers={2}>
        <View style={styles.container}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 14,
              color: '#AFAFAF',
              marginHorizontal: 50,
              textAlign: 'center'
            }}>
              Swipe up from bottom with two finger to open basket.
            </Text>
          </View>

          <Animated.View
            style={[
              styles.barContainer,
              { bottom: containerPosition }
            ]}>
            <ScrollView
              horizontal={true}
              style={styles.cartItemsScroll}
              contentContainerStyle={styles.cartItemsScrollContainer}>
              {[...new Array(10)].map((v, i) => (
                <View
                  key={`cart_item_${i}`}
                  style={styles.cartItemContainer}
                >
                  <View style={styles.cartItemIcon}/>
                  <Text style={styles.cartItemLabel} numberOfLines={1}>
                    Item #{i + 1}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Animated.View
              style={[
                styles.badgeContainer,
                { top: badgePosition }
              ]}>
              <TouchableOpacity
                hitSlop={{
                  left: 50,
                  top: 50,
                  right: 50,
                  bottom: 0,
                }}
                activeOpacity={1}
                onPress={this.openBasket}
              >
                <Text style={styles.badgeLabel}>
                  10
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </PanGestureHandler>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: BAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  cartItemsScroll: {
    maxHeight: 80,
  },
  cartItemsScrollContainer: {
    flexGrow: 1,
  },
  cartItemContainer: {
    width: 80,
    alignItems: 'center',
  },
  cartItemIcon: {
    margin: 5,
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  cartItemLabel: {
    fontSize: 10,
    color: '#AFAFAF',
  },
  badgeContainer: {
    position: 'absolute',
    minWidth: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000000'
  },
  badgeLabel: {
    marginHorizontal: 20,
    fontSize: 12,
    fontWeight: '600',
    color: '#FEFEFE',
  }
});