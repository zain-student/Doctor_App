// In ClientScreen.js

import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, TextInput} from 'react-native';
import {fetch} from '@react-native-community/netinfo';
import {NetworkInfo} from 'react-native-network-info';
var net = require('react-native-tcp');

const createClient = (ip, chats, setChats) => {
  const client = net.createConnection(6666, ip, () => {
    console.log('opened client on ' + JSON.stringify(client.address()));
    // client.write('Hello, server! Love, Client.');
  });

  client.on('data', data => {
    // setChats([...chats, {id: chats.length + 1, msg: data}]);
    console.log('Client Received: ' + data);

    // client.destroy(); // kill client after server's response
    // this.server.close();
  });

  client.on('error', error => {
    console.log('client error ' + error);
  });

  client.on('close', () => {
    console.log('client close');
  });
  return client;
};

const ClientScreen = ({navigation}) => {
  const [client, setClient] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // fetchData();

    return () => {};
  }, []);
  const fetchData = async () => {
    // let ip = await NetworkInfo.getIPV4Address(); //await NetworkInfo.getGatewayIPAddress();

    // fetch().then(state => {
    let ip = await NetworkInfo.getGatewayIPAddress();
    console.warn('ip network info', ip);
    // console.log('Connection type', state.type);
    // console.log('Is connected?', state.isConnected, state.details?.ipAddress);
    // let ip = state.details?.ipAddress;
    setClient(createClient(ip));
    // });
  };
  return (
    <View>
      <Text>Client Screen</Text>
      <Button
        title="Stop Client"
        onPress={() => {
          if (client) {
            client.destroy();
            setClient(null);
          } else {
            fetchData();
          }
        }}
      />
      {client ? <Text>Client is on</Text> : null}
      <FlatList
        data={chats}
        renderItem={({item}) => {
          return <Text style={{margin: 10, fontSize: 20}}>{item.msg}</Text>;
        }}
        keyExtractor={item => item.id}
      />
      <TextInput
        placeholder="Type a message"
        placeholderTextColor="black"
        style={{margin: 10, borderWidth: 2, color: 'white'}}
        onSubmitEditing={({nativeEvent: {text}}) => {
          if (client) {
            client.write(JSON.stringify({msg: text, id: 1}));
          }
        }}
      />
    </View>
  );
};

export default ClientScreen;
