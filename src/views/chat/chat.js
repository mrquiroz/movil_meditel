
import React, { Component } from 'react';
import { FlatList, StyleSheet, View ,YellowBox,Image, ImageBackground, TouchableHighlight, TouchableOpacity, Alert} from 'react-native';
import {Text, ListItem, Divider,Avatar, Button} from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import {ClassicHeader,ModernHeader}  from '@freakycoder/react-native-header-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
//import { globalAgent } from 'http';
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
console.disableYellowBox=true;
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
    global.time_stamp = '';
  }

  state = {
      search: '',
      email:'',
      token:'',
      mensaje:[],
      datos:[{"content":'',"created_at":'',"role":''}],
      showAlert: false,
      messages: [],
  };
  
  componentDidMount(){
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.componentDidFocus()),
   ];
  }
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  
  chatUpdate() {
      console.log('chat_update')
        fetch('https://meditel-testing.herokuapp.com/api/message/getlast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + global.token, 
          },
          body: JSON.stringify({
              "id_asesoria": global.id_asesoria,
              "timestamp": global.time_stamp
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        console.log('chat_update')
        this.setState({datos:responseJson})
        //this.setState({mensaje:[{"_id": responseJson[0].created_at, "createdAt": moment(), "text": responseJson[0].content, "user": {"_id": 2}}]})
        console.log('jueeee')
        console.log(this.state.mensaje)
        this.map_mensajes(responseJson)
        //this.setState({messages:response.data})
      });
    };

  map_mensajes(mensaje = []){
    let iterador;
    iterador = mensaje
    iter = new Array()
    for(let i = 0; i < iterador.length; i++){
      sms = iterador[i]
      iter.append(sms)
      console.log('sms')
      console.log(sms)
      this.setState({mensaje:[{"_id": sms.created_at, "createdAt": sms.created_at, "text": sms.content, "user": {"_id": 2}}]})
      console.log(this.state.mensaje)
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, {
          _id: sms.created_at,
          text: sms.content,
          createdAt: new Date(),
          user: {
            name: "Catalina mena",
            _id: 2
          },
        }),
      }));
    }
  
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
  showAlert = () => {
  this.setState({
    showAlert: true
  });
};
  

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
 


  onSend(messages = []) {
    console.log('mensajes')
    console.log(messages)
    console.log(messages[0].text)
        fetch('https://meditel-testing.herokuapp.com/api/message/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + global.token, 
          },
          body: JSON.stringify({
              "id_asesoria": global.id_asesoria,
              "type": "text",
              "content": messages[0].text
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('response chat')
        console.log(responseJson)
        global.time_stamp = responseJson.timestamp;
          })
          .catch((error) => {
            console.log(error)
      });
      global.room.emit('message', {
        type: 'chat:update',
        data: {
          to_socket:global.socket_id
      }
    })
   
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  messageHandler ( message ) {
    const {type, data} = message;
    switch (type) {
      case 'chat:videollamada_request':
          this.setState({
            showAlert: true
          })
        // Si acepta se debe ejecutar this.props.navigation.navigate("videollamada");
      break;
      case 'chat:videollamada_refuse':
        // Mostrar prompt que solicitud de videollamada fue rechazada
      break;
      case 'chat:videollamada:finished':
        Alert.alert('Asesoria terminada')
        this.props.navigation.navigate("index")
        // Mostrar prompt que solicitud de videollamada fue rechazada
      break;
      case 'chat:update':
        console.log('si entro')
        this.chatUpdate()
        // Evento que indica que contraparte envió nuevo mensaje al chat
        // Se debe ejecutar endpoint de obtención de nuevos mensajes (api/message/getlast)
      break;
      default:
        console.log("Default case")
        break
    }
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
          {console.log('mesajes'+this.state.messages)}
          <AwesomeAlert
                show={this.state.showAlert}
                showProgress={false}
                title="Tu reserva"
                message= {"Fecha: " + global.selected_date +"\n" + "Hora: " + global.hora}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Cencelar"
                confirmText="Agendar"
                confirmButtonColor="orange"
                onCancelPressed={() => {
                  this.hideAlert();
                }}
                onConfirmPressed={() => {
                  this.props.navigation.navigate("videollamada");
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
