import { StyleSheet, TextInput, FlatList, Keyboard, SafeAreaView, TouchableOpacity, Dimensions, Pressable, View, Text} from 'react-native';

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane, faCircleCheck, faXmark} from '@fortawesome/free-solid-svg-icons';

import { router } from 'expo-router';

import * as Contacts from 'expo-contacts';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120; // distance in pixels after which a swipe is considered
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH * 0.9 
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6; 

type CustomContact = {
  name: string | undefined;
  phone: string | undefined;
  image: string | undefined;
  id: string;
};


export default function ModalScreen() {
  
  const ContactSearch = () => {

    const [searchText, setSearchText] = useState('');
    const [contacts, setContacts] = useState<CustomContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [match, setMatch] = useState<CustomContact[]>([]);

    useEffect(() => {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Contacts permission is required to use this feature.');
        } else {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image, Contacts.Fields.ID], // Include Image field
          });
          
          const formattedContacts: CustomContact[] = data.map((contact) => {
            const thing: CustomContact = {
              name: contact.name,
              phone: contact.phoneNumbers?.[0]?.number, // Assuming you want the first phone number
              image: contact.image?.uri, // Access image URI if available
              id: contact.id
            };
            return thing;
          });
          setContacts(formattedContacts);
          setIsLoading(false);
        }
      })();
    }, []);


    const filterContacts = () => {
      if (!searchText) {
        // Return an empty array if searchText is empty
        return contacts;
      }
    
      // Filter contacts based on name matching the search text
      return contacts.filter((contact: CustomContact) => {
        if (!contact.name) return;
        return contact.name!.toLowerCase().includes(searchText.toLowerCase());
      });
    };


    // selects and deselects contact
    const contactSelected = (contact: CustomContact) => {
      if (match.some(item => item.id === contact.id)) {
        setMatch(match.filter(item => item.id !== contact.id));
      } else if (match.length < 2) {
        setMatch([...match, contact]);
      }
    }

    // search contact
    const renderContact = ({ item }: { item: CustomContact }) => {
      return (
        <TouchableOpacity onPress={() => contactSelected(item)} activeOpacity={1} style={{paddingVertical: 8, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E4E2', marginRight: 10}}/>
            <Text style={{fontSize: 20}}>{item.name}</Text>
          </View>
          
          {/* show selected check */}
          { !match.some(contact => contact.id === item.id) ? <></> :
            <View>
              <FontAwesomeIcon icon={ faCircleCheck } size={25} color='green'/>
            </View>
          }
          

        </TouchableOpacity>
      );
    };

    // match contact 
    const renderMatchContact = ({ item }: { item: CustomContact }) => {
      return (
        <View style={{padding: 5, width: match.length === 2 ? '95%' : '100%', alignItems: 'center', flexDirection: 'row', backgroundColor: '#F5F5F5'}}>
          <View style={{backgroundColor: '#BEBFC5', width: 20, height: 20, borderRadius: 30}}/>
          <Text style={{marginLeft: 10, fontSize: 20, flex: 1}}>{item.name}</Text>
          
          <TouchableOpacity onPress={() => setMatch(match.filter(contact => contact.id !== item.id))}>
            <FontAwesomeIcon icon={faXmark} size={20} style={{alignSelf: 'flex-end'}}/>
          </TouchableOpacity>
        </View>
      );
    };


    return (
      <View style={{paddingTop: 10, width: '95%', alignItems: 'center'}}>

        {/* Contact search bar */}
        <View style={{flexDirection: 'column', backgroundColor: '#F5F5F5', width: '100%', borderRadius: 10, padding: 10}}>

          {/* Text input */}
          <TextInput
          style={{padding: 5, fontSize: 23, width: '100%'}}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search contacts"
          />

          <View style={{flexDirection: 'row', backgroundColor: '#F5F5F5'}}>
            {/* Match list */}
            <FlatList 
              data={match}
              scrollEnabled={false}
              renderItem={renderMatchContact}
            />

            {/* Match button */}
            { match.length != 2 ? <></> :
              <View style={{justifyContent: 'center', backgroundColor: '#F5F5F5' }}>
                <Pressable onPress={() => router.back()} disabled={false} style={{backgroundColor: '#C51E3A', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                  <Text style={{color: '#F5F5F5', fontSize: 20, fontWeight: '700', marginRight: 10}}>Match</Text>
                  <FontAwesomeIcon icon={ faPaperPlane } size={20} color='white'/>
                </Pressable>
              </View>
            }
            
          </View>   
        </View>

        {/* Contacts filter list */}
        {(isLoading) ? <></> : (
          <FlatList
            style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10, width: '100%'}}
            data={filterContacts()}
            renderItem={renderContact}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={Keyboard.dismiss}
          />
        )}
      </View>
    );
  }
  
  return (
    <SafeAreaView>
      <View style={{alignItems: 'center', height: '100%'}}>
          <ContactSearch />   
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
