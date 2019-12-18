import React, { Component } from 'react';
import {
  // Text,
  // TouchableOpacity,
  View,
  YellowBox,
  Alert,
  StyleSheet
} from 'react-native';
import { 
  mediaDevices,
  RTCView
} from 'react-native-webrtc';
import {
  // button,
  container,
  rtcView
  // text
} from './styles';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import VideoCall from './utils/videocall';

YellowBox.ignoreWarnings(['Setting a timer', 'Unrecognized WebSocket connection', 'ListView is deprecated and will be removed']);

/* ==============================
 Global variables
 ================================ */
let room = null;
/* ==============================
 Class
 ================================ */
class Videollamada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: {},
      remoteStreamUrl: null,
      streamUrl: null,
      initiator: false,
      peer: {},
      full: false,
      connecting: false,
      waiting: true
    }

    this.messageHandler = this.messageHandler.bind(this);
  }

  videoCall = new VideoCall()
  
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.componentDidFocus()),
    ];
    this.getLocalStream().then( () => {
      this.getReady();
      global.room.emit('message', {
        type: 'videollamada:ready',
        data: {
          to_socket: global.socket_id
        }
      });
    });
  }

  componentDidFocus() {
    this.props.screenProps.socket.setHandler(this.messageHandler)
  }
  
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  messageHandler ( message ) {
    const {type, data} = message
    switch (type) {
      case 'videollamada:ready':
        // Evento que indica que ambos participantes están ready para enviarse mensajes signaling
        break;
      case 'videollamada:signaling':
        this.state.peer.signal(data.signal)
        break;
      case 'videollamada:finished':
        Alert.alert('El medico corto')
        // Se debe cerrar esta vista y volver al chat
        break;
      default:
        console.log("Default case")
        break;
    }
  }

  getLocalStream = () => {
    return new Promise( (resolve, reject) => {
      const isFront = true;
      const op = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 360,
            minFrameRate: 30,
          },
          facingMode: isFront ? 'user' : 'environment'
        }
      };

      mediaDevices.getUserMedia(op).then( stream => {
        this.setState({ streamUrl: stream.toURL(), localStream: stream })
        resolve();
      });
    });
  }

 
  
  getReady = () => {
    this.setState({ connecting: true })
    const peer = this.videoCall.init(
      this.state.localStream,
      this.state.initiator
    )
    this.setState({peer})
    peer.on( 'signal' , (data) => {
      global.room.emit('message',
        {
          type: 'videollamada:signaling',
          data: {
            signal: data,
            to_socket: global.socket_id
          }
        });
    });

    peer.on('stream', stream => {
      this.setState({remoteStreamUrl: stream.toURL(), connecting: false, waiting: false});
    })

    peer.on('error', function(err) {
      console.log(err)
    })
  }

  // switchCamera = () => {
  //   this.state.localStream.getVideoTracks().forEach(track => {
  //     track._switchCamera();
  //   });
  // };

  // button = (func, text) => (
  //   <TouchableOpacity style={button.container} onPress={func}>
  //     <Text style={button.style}>{text}</Text>
  //   </TouchableOpacity>
  // );
  
  render() {
    return (
      <View style={container.style}>
        <View style={rtcView.testStyle}>
          <RTCView streamURL={this.state.streamUrl} style={{overflow: 'hidden', flex: 1, backgroundColor: 'black'}}/>
        </View>
        {!(this.state.connecting || this.state.waiting) && (
          <RTCView streamURL={this.state.remoteStreamUrl} style={rtcView.fullScreen}/>
        )}
        <Button
          rounded
          icon={ <Icon name="remove" size={40} color="white" />}
          buttonStyle={styles.myButton}
          style={{borderRadius: 50}}
          onPress={()=>this.props.navigation.navigate('chat')}/>
      </View>
    );
  }
}

/* ==============================
 Functions
 ================================ */
 const getSubscription = (sc, room_id) => {

  // let room = sc.ws.getSubscription(room_id);

  // if (!room) {
  //     return sc.subscribe(room_id);    
  // } else {
  //     return room;
  // }
}

/* ==============================
 Export
 ================================ */
export default Videollamada;


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop:60,
    marginBottom: 60,
    // marginTop:130,
    // marginBottom: 90,
    opacity:0.7,
  },
  loginContainer: {
    justifyContent: 'center',
    flexDirection:'row',
    marginLeft: 30,
    marginRight: 30,
    marginBottom:15,
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
    height: 35,
    alignItems: "stretch",
  },
  myButton:{
    padding: 5,
    height: 60,
    width: 60,  //The Width must be the same as the height
    borderRadius:400, //Then Make the Border Radius twice the size of width or Height   
    backgroundColor:'red',

  },
  logo: {
    width: 289,
    height: 110,
  },
  button: {
    margin: 5,
    borderRadius: 30,
  },
  background: {
    flex:1,
    width: '100%', 
    height: '101%',
    resizeMode: 'cover',
  },  
  input: {
    flex:1,
    color:'#fff',
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 0  
  },
  signIn: {
    backgroundColor: '#46AFA3',
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    color: 'transparent',
    borderRadius: 7,
    fontSize: 10,
  },
  signUp: {
    borderColor: 'transparent',
    borderWidth: 0.5,
    marginLeft:20,
    marginRight:20,
    color: '#fff',
    borderRadius: 7
  },
  inputIcon: {
    paddingRight:20,
    paddingLeft:10
  },
  forgotPassword: {
    color: '#fff',
    marginLeft:178,
    opacity: 0.8,
  }
});
