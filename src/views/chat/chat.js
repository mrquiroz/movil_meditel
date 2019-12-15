
import React, { Component } from 'react';
import { FlatList, StyleSheet, View ,Image, ImageBackground, TouchableHighlight, TouchableOpacity, Alert} from 'react-native';
import {Text, ListItem, Divider,Avatar, Button} from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import {ClassicHeader,ModernHeader}  from '@freakycoder/react-native-header-view';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { ScrollView } from 'react-native-gesture-handler';
// import TouchableScale from 'react-native-touchable-scale';
// import Icon from 'react-native-vector-icons/FontAwesome';


//TODO: Cuando se haga el fetch desde el back se debe rescatar la asesoria_id del respectivo médico
let room = null;
const token = global.token
const agendada = [
    {
        name: '<Fecha>',
        subtitle: '<Nombre médico>',
        hora: '<Hora>',
        asesoria_id: 'someId'
    },
]

export default class Chat extends Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);
    this.messageHandler = this.messageHandler.bind(this);
  }

  state = {
      search: '',
      email:'',
      token:'',
      messages: [],
  };
  
  componentDidMount(){
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.componentDidFocus()),
   ];
  }

  componentDidFocus() {
  this.props.screenProps.socket.setHandler(this.messageHandler)
  }

  componentDidUpdate(){

  }

  componentWillUnmount() {
  this.subs.forEach(sub => sub.remove());
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }
  

  requestVideollamada() {
    global.room.emit('message', {
        type: 'chat:videollamada_request',
        data: {
          to_socket:global.socket_id
      }
    })
    this.props.navigation.navigate("videollamada");
  }

  //TODO: Se debe ejecutar cuando has enviado un nuevo mensaje
  chatUpdate() {
    // 1. Actualizar la vista de los mensajes a través de la agregación de nuevo elemento a array de mensajes
    // 2. Se ejecuta endpoint que postea el nuevo mensaje
    // 3. Si endpoint es exitoso se notifica a contraparte con chat:update vía WS.
    global.room.emit('message', {
        type: 'chat:update',
        data: {
          to_socket:global.socket_id
      }
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  messageHandler ( message ) {
    const {type, data} = message;
    switch (type) {
      case 'chat:videollamada_request':
        this.props.navigation.navigate("videollamada")
        // Si acepta se debe ejecutar this.props.navigation.navigate("videollamada");
      break;
      case 'chat:videollamada_refuse':
        // Mostrar prompt que solicitud de videollamada fue rechazada
      break;
      case 'chat:update':
        // Evento que indica que contraparte envió nuevo mensaje al chat
        // Se debe ejecutar endpoint de obtención de nuevos mensajes (api/message/getlast)
      break;
      default:
        console.log("Default case")
        break
    }
    this.props.navigation.navigate("videollamada");
  }
  
    render() {
        const { search } = this.state;
        return (
            <View style={styles.container}>

          <ModernHeader
            text="Chat"
            rightIconType="Ionicons"
            
            backgroundColor="#fdfdfd"
            //rightIconName="ios-settings"
            //rightIconColor={colors.light.primary}
            rightIconComponent={ <Icon name="video-camera" size={25} color="#3AB8DA" />}
            rightIconOnPress={() => this.requestVideollamada()}
          />
                <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
            </View>
        );
    }
}
const subscribeToRoom = (sc, room_id, token) => {
   if ( !sc.hasConnection ) {
       sc.connect(token);
   }

   let room = sc.ws.getSubscription(room_id);
   sc.topic = room_id;
   if (!room) {
       return sc.subscribe(room_id);    
   } else {
       return room;
   }
 }

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 20
  },
  title:{
    color:'#66696B', 
    fontWeight: 'bold', 
    fontSize: 22, 
    padding: 14
  },
  subtitle:{
    color:'#909090',
    fontWeight: 'bold', 
    fontSize: 17, 
    padding: 14
  },
  section:{
      paddingTop: 14
  },
  itemTitle:{
      color: '#707171',
      fontWeight:'bold',
      fontSize:14
  },
  info:{
    fontSize:16,
    color: "black",
    padding:20,
  },
  itemSubtitle:{
      color: '#707171',
      fontSize:13,
      paddingTop:3
  },
  itemTitleAgendada:{
    color: '#FF9F1C',
    fontWeight:'bold',
    fontSize:14
  },
  itemTitleRight:{
    color: '#A3A3A3',
    fontSize:14,
    textAlignVertical:'top',
  },
});
