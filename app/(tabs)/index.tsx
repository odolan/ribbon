import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons/faHeartCirclePlus'
import { Link } from 'expo-router';
import {
  View,
  StyleSheet,
  Pressable, 
  useColorScheme,
  Text,
  SafeAreaView,
  Animated, 
  PanResponder, 
  Dimensions
} from 'react-native';

import Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120; // distance in pixels after which a swipe is considered

export default function TabOneScreen() {
  const colorScheme = useColorScheme();

  type CardData = {
    name: String;
  }


  const MatchFriendsButton = () => {
    return (
      <View style={{flexDirection: 'column', alignItems: 'center'}}>

        <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '95%'}}>
          <Link style={{backgroundColor:'orange', padding: 5, borderRadius: 10}} href="/modal" asChild>
            <Pressable>
              {({ pressed }) => (
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 20, fontWeight:'500', padding: 5, color:'white'}}>Match Friends</Text>
                  <FontAwesomeIcon icon={ faHeartCirclePlus } size={30} color='#ef1452'/>
                </View>
              )}
            </Pressable>
          </Link>
        </View>

      </View>
    );
  };

  const CardStack = (props: { cards: CardData[] }) => {

    let MAX_VERTICAL_MOVEMENT = 10;

    const [currentIndex, setCurrentIndex] = useState(0);
    const position = useRef(new Animated.ValueXY()).current;
    
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        const limitedDY = Math.max(-MAX_VERTICAL_MOVEMENT, Math.min(MAX_VERTICAL_MOVEMENT, gesture.dy));
        position.setValue({ x: gesture.dx, y: limitedDY });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeCard('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeCard('left');
        } else {
          resetPosition();
        }
      },
    });

    type CardProps = {
      card: CardData
    };

    const Card: React.FC<CardProps> = ({ card }) => {
      return (
          <View style={{}}>
              <Text>{card.name}</Text>
          </View>
      );
  };

    const resetPosition = () => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    };

    const swipeCard = (direction: string) => {
      const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = (direction: string) => {
      if (direction === 'right') {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex(currentIndex + 1); // Move to the next card
    };

    const onSwipeRight = () => {
      console.log('Swiped right');
      // Add your swipe right logic here
    };

    const onSwipeLeft = () => {
      console.log('Swiped left');
      // Add your swipe left logic here
    };

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    const cardStyle = {
      transform: [
        { rotate },
        ...position.getTranslateTransform(),
      ],
      marginBottom: 50,
    }


    const renderCards = () => {
      return props.cards.map((card, index) => {
        if (index < currentIndex) {
          return null;
        }

        if (index === currentIndex) {
          return (
            <Animated.View
              key={index}
              style={[position.getLayout(), styles.card, cardStyle, {position: 'absolute', zIndex: 99}]}
              {...panResponder.panHandlers}
            >
              <Card card={{name: 'owen'}}/>
            </Animated.View>
          );
        }

        return (
          <Card key={index} card={{name: 'owen'}}/>
        );
      }).reverse();
    };

    return <View style={{marginTop: 20}}>{renderCards()}</View>;
  };

  return (
    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
      <MatchFriendsButton />
      <CardStack cards={[{name: 'owen'}, {name: 'tom'}, {name: 'peter'}, {name: 'mark'}]}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: 'green',

  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
