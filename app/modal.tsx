import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, FlatList, Keyboard, SafeAreaView } from 'react-native';

import { Text, View } from '../components/Themed';
import { useEffect, useState } from 'react';

import * as Contacts from 'expo-contacts';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
        return [];
      }
    
      // Filter contacts based on name matching the search text
      return contacts.filter((contact: CustomContact) => {
        if (!contact.name) return;
        return contact.name!.toLowerCase().includes(searchText.toLowerCase());
      });
    };


    const renderContact = ({ item }: { item: CustomContact }) => {
      return (
        <View style={{paddingVertical: 15, paddingHorizontal: 10, marginTop: 5, backgroundColor: '#F5F5F5', borderRadius: 8}}>
          <Text>{item.name}</Text>
        </View>
      );
    };

    return (
      <View style={{paddingTop: 10, width: '95%', alignItems: 'center' }}>
          <Text>Search your contacts for friends to match</Text>
          <TextInput
          style={{padding: 15, fontSize: 18, backgroundColor: '#F5F5F5', borderRadius: 10, marginTop: 10, width: '100%'}}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search contacts"
        />
        {(isLoading || !filterContacts()) ? <></> : (
          <FlatList
            style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 5, width: '95%'}}
            data={filterContacts().slice(0, 5)}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    );
  }
  
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{alignItems: 'center', height: '100%'}}>
          <ContactSearch />
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Text>hello this is going on </Text>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{width: 50, height: 50, borderRadius: 30, backgroundColor: 'green', margin: 5}}/>
              <View style={{width: 50, height: 50, borderRadius: 30, backgroundColor: 'green', margin: 5}}/>
            </View>
          </View>
      </TouchableWithoutFeedback>
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
