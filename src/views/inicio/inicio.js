import React, { Component } from 'react';
import { FlatList, StyleSheet, View ,Image,Modal,Alert, ImageBackground, TouchableHighlight,TouchableOpacity} from 'react-native';
import { List, ListItem,Header,SearchBar,Divider,Text,Card,Button } from 'react-native-elements'
import moment from 'moment';
// import BottomNavigation, {
//   IconTab,
//   Badge,
//   FullTab
// } from 'react-native-material-bottom-navigation'
// import { ScrollView } from 'react-native-gesture-handler';


export default class InicioScreen extends Component {
  constructor(props) {
    super(props);
    global.nombre = '';
    global.apellido = '';
    global.token = '';
    global.id_socket = '',
    global.id_doctor = '',
    global.id_asesoria = '',
    global.doctor= 'https://image.freepik.com/foto-gratis/sonriente-medico-mujer-hospital_23-2147767604.jpg';
  }
  state = {
    search: '',
    email:'',
    token:'',
    retoken:'',
    password:'',
    nombre:'',
    modalVisible: false,
    apellido:'',
  };

  save_movil = () => {
    console.log(moment())
    console.log('id_movil: '+global.movil)
    console.log('id_persona: '+global.token)
    fetch('https://meditel-testing.herokuapp.com/api/firebase/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + global.token, 
        },
        body: JSON.stringify({
          "firebase_token": global.movil
      })
    })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    })
    .catch((error) => {
        console.log('no se almaceno el id del dispositivo')
  });
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  Token = () => {
    if (this.state.token == ''){
      fetch('https://meditel-testing.herokuapp.com/api/auth/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
              "email": this.state.email,
              "password": this.state.password,
          })
      })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({token:responseJson.token});
        this.setState({nombre:responseJson.nombre});
        global.nombre = responseJson.nombre;
        global.apellido = responseJson.apellido;
        global.token = responseJson.token;
        this.setState({apellido:responseJson.apellido});
        this.setState({refreshToken:responseJson.refreshToken});
        this.save_movil();
        })
        .catch((error) => {
    });
    }
  };

  componentDidMount(){
    this.setState({email:(this.props.navigation.state.params || {}).email})
    this.setState({password:(this.props.navigation.state.params || {}).password})
    this.setState({modalVisible:global.agendada.modal})
  }
  componentDidUpdate(){
    this.Token()
  }
  
  onPressAtencionInmediata(){
    alert('Atención Inmediata');
  }
  onPressAgendarHora(){
    alert('Agendar Hora');
  }
  onPressEspecialidades(){
    alert('Especialidades')
  }
  onPressVerAsesoria(){
    () => this.props.navigation.navigate('chat')
}
  render() {
    const { search } = this.state;

    if (global.agendada.hasOwnProperty('id_socket')) { 
      global.id_socket = global.agendada.id_socket
      global.id_doctor = global.agendada.id_doctor
      global.id_asesoria = global.agendada.id_asesoria
    } else { 
        console.log('nada nuevo') 
    } 
  
    return (
      <View style={styles.container}>
        
        <View>
        <SearchBar
          inputStyle={{ fontSize: 14}}
          inputContainerStyle={{backgroundColor:"#F5F5F5"}}
          containerStyle={{backgroundColor: 'transparent', borderBottomColor: 0, borderTopColor: 0}}
          placeholderTextColor={'#86939e'}
          placeholder="¿Qué médico o especialidad buscas?"
          onChangeText={this.updateSearch}
          value={search}
          style={styles.search}
        />
        </View>
        <Modal transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>
            <View>
            <Card title="Tu asesoria esta por comenzar">
                <Text style={styles.paragraph}>
                ¿Estas listo?
                </Text>
            </Card>

                  <View style={{
                                flexDirection: 'row',
                                alignContent:'space-between'}}>
                  <View style={styles.loginContainer}>
                  <Button
                      title="Empezar"
                      type="outline"
                      onPress={() => this.props.navigation.navigate('chat')}
                      />
                  </View>
                  <View style={styles.loginContainer}>
                  <Button
                      title="Posponer"
                      titleStyle={{color:'red'}}
                      type="outline"
                      onPress={() => { this.setModalVisible(false);}}   
                    />
                  </View>
                  </View>
            </View>
          </View>
        </Modal>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', padding:10}}>
        
          <View >
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('inmediata', {
                    email: this.state.email,
                    token: this.state.token,
                    
                  })}}>
              <ImageBackground style={styles.imageFilter} blurRadius={0.5} 
              source={require('../../assets/atencion-inmediata.png')}>
              <Text style={styles.imageTitle}>
                Atención{"\n"}Inmediata
              </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
            
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('agendar')}}>
            <ImageBackground style={styles.imageFilter} blurRadius={0.5} 
            source={require('../../assets/agendar-hora.png')}
            onPress={this.onPressEspecialidades}>
              <Text style={styles.imageTitle}>
                Agendar Hora
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', paddingBottom:20}}>
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('especialidades')}}>
            <ImageBackground style={styles.imageArea} blurRadius={0.5} 
            source={require('../../assets/especialidades.png')}
            onPress={this.onPressEspecialidades}>
              <Text style={styles.imageTitle}>
                Especialidades
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <Text style = {styles.title}>{this.state.nombre} Bienvenido!</Text>
      </View>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 40,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  bottom:{
    width: '100%', 
    height: 50, 
    backgroundColor: '#7FCDCD', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  search:{
    paddingTop:10,
  },
  imageTitle:{
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15    
  },
  loginContainer: {
    flexDirection:'row',
    marginLeft: 32,
    paddingTop:20,
    alignContent:"space-between",
    marginBottom:15,
    height: 35,
    alignItems: "stretch",
  },
  modalContent: {
    height: 100,
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  imageFilter:{
    width: 160.49, 
    height: 104.33,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom:10
  },
  imageArea:{
    width: 332.94, 
    height: 68.35,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 10,
  },
  title:{
    color:'#4F5254', 
    fontWeight: 'bold', 
    fontSize: 21, 
    padding: 14
  }

});
