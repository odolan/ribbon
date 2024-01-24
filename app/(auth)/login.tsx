import { useState } from "react";
import { View, Text, TextInput, Keyboard, SafeAreaView, Dimensions, } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { TouchableOpacity } from "react-native-gesture-handler";

import { faMobile, faArrowRightLong} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120; // distance in pixels after which a swipe is considered
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH * 0.9 
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;

export default function Login() {
  const { setUser } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');

  const handleTextChange = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');

    // Format the number
    let formatted = '';
    if (cleaned.length <= 2) {
      formatted = `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    } else {
        Keyboard.dismiss();
    }

    // Update the state
    setPhoneNumber(formatted);
  };

  const login = () => {
    setUser({
      name: "Owen Dolan",
    });
  }

  return (
    <SafeAreaView>
        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingTop: SCREEN_HEIGHT * 0.1, padding: 10}}>
        
            <View style={{width: '100%'}}>
                <Text style={{fontSize: 40, fontWeight: '500'}}>Hey, "friend"</Text>
                <Text style={{fontSize: 30, fontWeight: '500'}}>lets get you back in there</Text>
            </View>
            
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.1}}>
                <Text style={{fontSize: 40, marginRight: 5}}>+1</Text>
                <TextInput keyboardType={'phone-pad'} placeholder="(123) 456 7890" style={{fontSize: 40}} value={phoneNumber} onChangeText={handleTextChange}/>
            </View>

            <View style={{width: SCREEN_WIDTH * 0.8}}>
                <TouchableOpacity onPress={login} style={{alignSelf: 'flex-end'}}>
                    <FontAwesomeIcon icon={faArrowRightLong} color="black" size={45} />
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  );
}