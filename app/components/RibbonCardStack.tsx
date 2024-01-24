import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet, 
  Dimensions
} from 'react-native';

import { SwipableRibbonCard, UninteractableRibbonCard } from './RibbonCard';

// defines card swipe actions
export type SwipeType = 'LeftSwipe' | 'RightSwipe';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const CARD_WIDTH = SCREEN_WIDTH * 0.9 
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6; 



type RibbonStackProps = {
    cards: string[];
    onImageSelect: (uri: string|null) => void;
}

export const RibbonCardStack: React.FC<RibbonStackProps> = ({ cards, onImageSelect }) => {

    // let MAX_VERTICAL_MOVEMENT = 10;

    const [currentRibbonIndex, setCurrentRibbonIndex] = useState(0);


    // handles top ribbon card swipe
    const onCardSwipe = ( swipe: SwipeType ) => {
      console.log(swipe);

      setCurrentRibbonIndex(currentRibbonIndex + 1); // increment top card
    }

    // rendes the ribbon card stack
    const renderCards = () => {
      return cards.map((card, index) => {
      
      // if there is no card to display
      if (index < currentRibbonIndex) {
          return null;
      }

      // if the cards index is the current index to be the top card
      if (index === currentRibbonIndex) {
          return <SwipableRibbonCard key={index} onCardSwipe={onCardSwipe} onImageSelect={onImageSelect} images={cards}/>
      }

      // if the card is not the top card, draw a default background card
      return <UninteractableRibbonCard key={index} images={cards}/>
      }).reverse();
    };

    return <View>{renderCards()}</View>;
};


const styles = StyleSheet.create({
});