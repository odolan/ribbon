import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated, 
  PanResponder, 
  Dimensions,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
  GestureResponderEvent,
  Text,
} from 'react-native';

import { SwipeType } from './RibbonCardStack';

// constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const RIBBON_WIDTH = Dimensions.get('window').width * 0.95;
const RIBBON_CARD_HEIGHT = Dimensions.get('window').height * 0.7;

const HORIZONTAL_SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4; // distance in pixels after which a swipe is past the point of bouncing back to center
const SWIPE_OUT_DURATION = 130; // duration of swipe out animation

// determines the DISTANCE in px a gesture is before it is considered a movement
const HORIZONTAL_DISTANCE_THRESHOLD = 20; 
const VERTICAL_DISTANCE_THRESHOLD = 10; 

// determines the DISTANCE in px a gesture is before it is considered a movement
const HORIZONTAL_VELOCITY_THRESHOLD = 0.02; 
const VERTICAL_VELOCITY_THRESHOLD = 10; 


// ribbon card props 
type SwipableRibbonCardProps = {
  images: string[],
  onCardSwipe: (value: SwipeType) => void,
  style?: StyleProp<ViewStyle>;
  onImageSelect: (uri: string|null) => void,
};

/**
 * Ribbon Card
 * @param RibbonCardProps  
 * @returns Top Ribbon Card
 */
export const SwipableRibbonCard: React.FC<SwipableRibbonCardProps> = ({ style, images, onCardSwipe, onImageSelect }) => {

    const position = useRef(new Animated.ValueXY()).current; // For handling card movement animation
    const isImageSelected = useRef(false); // determines if someone is currently touching any photo
    const ribbonElementRef = useRef<View>(null); // ref for the ribbon view
    const imageHeight = RIBBON_CARD_HEIGHT / images.length; // height of each image on the card

    const [seenImageList, setSeenImageList] = useState<boolean[]>(Array.from({ length: images.length }, () => false));
    const colorList = ['#A14CE4', '#EF3939', '#30D3DD', '#32DB43', '#FFAA06', '#523CD9', '#F0E821', '#D728A6', '#9C1029'];

    // tracks the x position of the ribbon card
    const ribbonXPos = useRef(0);
    useEffect(() => {
        const id = position.x.addListener(({ value }) => ribbonXPos.current = Math.abs(value));
        return () => position.x.removeListener(id);
    }, []);

    // rotates the ribbon card around pivot
    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-5deg', '0deg', '5deg'],
        extrapolate: 'clamp',
    });

    // handles the swipe gesture transform
    const rotateAndTranslate = {
        transform: [
            { rotate },
            ...position.getTranslateTransform(),
        ],
    };

    // handles gesture response
    const panResponder = useRef(

        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            
            // on ribbon pan move
            onPanResponderMove: (evt, gestureState) => {
                const { dx: distanceX, dy: distanceY, vx: velocityX, vy: velocityY } = gestureState;
                const { locationY } = evt.nativeEvent;

                // if ribbon swipe should be considered horizontal
                if ((Math.abs(velocityX) > Math.abs(velocityY) + 0.07) && (!isImageSelected.current)) {
                    position.setValue({ x: distanceX, y: 0 }); // move the ribbon horizontally

                } else if ((Math.abs(distanceY) > VERTICAL_DISTANCE_THRESHOLD) && (ribbonXPos.current === 0)) { // consider a ribbon swipe after a certain threshold

                    // update current image if swipe within ribbon card
                    if (locationY >= 0 && locationY <= RIBBON_CARD_HEIGHT) {
                        let newActiveImageIndex = Math.floor(locationY / imageHeight);

                        onImageSelect(images[newActiveImageIndex]);
                        setSeenImageList(prevList => [...prevList.slice(0, newActiveImageIndex), true, ...prevList.slice(newActiveImageIndex + 1)]);
                        isImageSelected.current = true;
                    }
                }
            },

            // on ribbon pan release
            onPanResponderRelease: (evt, gestureState) => {
                // if an image isnt selected check if a ribbon swipe has occured
                if (!isImageSelected.current) {

                    // swipe right
                    if (gestureState.dx > HORIZONTAL_SWIPE_THRESHOLD) {
                        swipeCard('RightSwipe');
                    
                    // swipe left
                    } else if (gestureState.dx < -HORIZONTAL_SWIPE_THRESHOLD) {
                        swipeCard('LeftSwipe');
                    } else {
                        resetPosition();
                    }
                }
                // remove current image selected
                isImageSelected.current = false;
                onImageSelect(null);
            },
        })
    ).current;

    // swipes card in direction left or right
    const swipeCard = (direction: SwipeType) => {
        const x = (direction === 'RightSwipe') ? SCREEN_WIDTH + 10 : -SCREEN_WIDTH - 10;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => {
            onCardSwipe(direction)
            position.setValue({ x: 0, y: 0 });
        });
    };

    // animates card back to center on release
    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
    }; 

    return (
        <Animated.View {...panResponder.panHandlers} ref={ribbonElementRef} style={[rotateAndTranslate, styles.card]}>
            <View style={styles.imagesContainer} pointerEvents="none">
                { images.map((image, index) => (
                    <View key={index} style={{ position: 'relative', height: imageHeight}}>
                        <Image
                            key={image}
                            source={{ uri: image }}
                            style={[styles.image, { height: imageHeight}]}
                        />
                        <View style={[seenImageList[index] ? {opacity: 0}: {opacity: 1}, styles.image, {height: imageHeight, backgroundColor: colorList[index]}]}/>
                    </View>
                ))}
                {/* {images.map((image, index) => (
                    <Image
                        key={image}
                        source={{ uri: image }}
                        style={[styles.image, { height: imageHeight }]}
                    />
                ))} */}
            </View>
        </Animated.View>
    );
};

// props for uninteractable card
type UninteractableRibbonCardProps = {
    images: string[],
    style?: StyleProp<ViewStyle>;
  };

/**
 * Uninteractable Ribbon Card
 * @param RibbonCardProps  
 * @returns Uninteractable Ribbon Card
 */
export const UninteractableRibbonCard: React.FC<UninteractableRibbonCardProps> = ({ style, images }) => {

    const cardHeight = SCREEN_HEIGHT * 0.6; // or any other factor based on your design
    const imageHeight = cardHeight / images.length; // height of each image on the card 

    return (
        <View style={[styles.imagesContainer, styles.card]}>
            {images.map((image, index) => (
                <Image
                    key={image}
                    source={{ uri: image }}
                    style={[styles.image, { height: imageHeight }]}
                />
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        // margin: 20,
        width: RIBBON_WIDTH,
        height: RIBBON_CARD_HEIGHT,
        backgroundColor: 'black',
    },
    imagesContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    image: {
        width: '100%',
        resizeMode: 'cover',
        position: 'absolute',
    },
});