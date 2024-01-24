import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons/faHeartCirclePlus'
import { Link } from 'expo-router';
import {
  View,
  StyleSheet,
  Pressable, 
  Text,
  SafeAreaView,
  Image,
  PanResponder, 
  Dimensions
} from 'react-native';

import { RibbonCardStack } from '../components/RibbonCardStack';

const images = [
  'https://www.singulart.com/blog/wp-content/uploads/2018/08/portrait-1140x1069.jpg', 
  'https://shotkit.com/wp-content/uploads/2021/06/Famous-portrait-CT_2860.jpeg',
  'https://i.redd.it/slumhmsqqfxa1.jpg',
  'https://cdn.britannica.com/72/146072-050-124A752E/Greyhound-bus.jpg',
  'https://nmwa.org/wp-content/uploads/2020/01/1997.166-GAP.jpg',
  'https://media.nga.gov/iiif/1b817e44-e9b5-4e6b-81ca-fe8b2c5f47ac/full/full/0/default.jpg?attachment_filename=portrait_of_a_young_woman_in_white_1963.10.118.jpg',
  'https://media.gettyimages.com/id/1128922258/photo/portrait-of-surprised-man-with-friends-in-background-opening-the-door.jpg?s=1024x1024&w=gi&k=20&c=VtWGI9mNY4CzXYiwR2WKTqZo09kX1f1dReqkTHxhdGY=',
  'https://s3.envato.com/files/463035482/64c2f928d342f03032585347_withmeta.jpg',
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120; // distance in pixels after which a swipe is considered
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH * 0.9 
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6; 

export default function TabOneScreen() {
  const [activeImageUri, setActiveImageUri] = useState<string|null>(null);

    const handleImageSelect = (uri: string|null) => {
        setActiveImageUri(uri);
    };

  const MatchFriendsButton = () => {
    return (
      <View style={{flexDirection: 'column', alignItems: 'center'}}>

        <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '95%'}}>
          <Link style={{padding: 5}} href="/modal" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesomeIcon icon={ faHeartCirclePlus } size={35} color='#FF255C'/>
              )}
            </Pressable>
          </Link>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      {/* <MatchFriendsButton /> */}
      <View style={{flexDirection: 'row', margin: 10, width: '95%', alignItems: 'center'}}>
        <View style={{backgroundColor: '#FE6F5E', width: 50, height: 50, borderRadius: 30}}/>

        <View style={{flexDirection: 'column', padding: 5}}>
          <Text style={{fontSize: 30, fontWeight: 600}}>Owen Dolan</Text>
          <Text style={{fontSize: 20, fontWeight: 600}}>"o-dog"</Text>
        </View>
      </View>

      <RibbonCardStack onImageSelect={handleImageSelect} cards={images}/>

      {activeImageUri && (
                <Image source={{ uri: activeImageUri }} style={styles.fullScreenImage} />
            )}

      <View style={{width: '98%', flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', padding: 5, margin: 5, backgroundColor: '#FE6F5E', borderRadius: 10}}>
          <Text style={{ fontSize: 20, color: 'white' }}>🔥5</Text>
          <Text style={{ fontSize: 20, marginLeft: 8, color: 'white' }}>👀34</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreenImage: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    top: 0,
    left: 0,
    zIndex: 10, // make sure it covers other components
  },
});
