import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import {Text, ListItem, Divider,Avatar,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Perfil_medico extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_medico:'',
            name:'',
            lastname:'',
            specialty:'',
            rating:'',
            motivo:'',
            id_asesoria:'',
            fecha:''
          }
      }

      Cancelar = () => {
          fetch('https://meditel-testing.herokuapp.com/api/asesoria/cancelar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + global.token, 
            },
            body: JSON.stringify({
                "id_asesoria": this.state.id_asesoria
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
            })
            .catch((error) => {
              console.log(error)
        });
        Alert.alert(
          'Hora cancelada exitosamente',
          'Puedes volver a solicitar alguna asesoria en la seccion de agendar',
          [
            {text: 'OK', onPress: () => this.props.navigation.navigate('index')},
  
            {text: ' Ver Asesorias', onPress: () => this.props.navigation.navigate('asesoria')},
          ],
          {cancelable: false},
        );
      };
    
      componentDidMount(){
        this.setState({id_medico:(this.props.navigation.state.params || {}).id_medico})
        this.setState({motivo:(this.props.navigation.state.params || {}).motivo})
        this.setState({fecha:(this.props.navigation.state.params || {}).fecha})
        this.setState({id_asesoria:(this.props.navigation.state.params || {}).id_asesoria})
                fetch('https://meditel-testing.herokuapp.com/api/doctor/show/'+(this.props.navigation.state.params || {}).id_medico, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': 'Bearer ' + global.token, 
                    }
                })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({name:responseJson.name});
                this.setState({lastname:responseJson.lastname});
                this.setState({specialty:responseJson.specialty});
                this.setState({rating:responseJson.rating.toString()});
                })
                .catch((error) => {
                    console.log('algo paso obteniendo los medicos disponibles')
            });
      }
    render() {
        return (
          <View style={styles.container}>
              <View style={styles.userRow}>
              <View style={styles.userImage}>
                <Avatar
                  rounded
                  size="large"
                  source={{
                    uri: global.doctor,
                  }}
                />
              </View>
              <View>
                <View style={styles.userRow}>
                <Text style={styles.name}>{this.state.name}</Text>
                <Text style={styles.name}>  {this.state.lastname}</Text>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                    paddingLeft: 15,
                  }}
                >
                        {this.state.rating} 
                </Text>
                <Icon name="star" size={17} color="yellow" />
                </View>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                  }}
                >
                  {this.state.specialty}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>
                        Tu Asesoria
                  </Text>

                  <Text style={styles.subtitle}>
                            Fecha
                  </Text> 
                  <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                    paddingLeft: 13
                  }}
                >
                  {this.state.fecha.slice(0,10)}
                </Text>

                  <Text style={styles.subtitle}>
                            Hora
                  </Text>

                  <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                    paddingLeft: 13
                  }}
                >
                  {this.state.fecha.slice(11,16)}
                </Text>

                  <Text style={styles.subtitle}>
                            Motivo
                  </Text>  

                  <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                    paddingLeft: 13
                  }}
                >
                  {this.state.motivo}
                </Text>
                <View style={{flex:1,
                          flexDirection: 'row',
                          alignContent:'space-between'}}>
            <View style={styles.loginContainer}>
            <Button
                title="Volver"
                type="outline"
                onPress={() => {this.props.navigation.navigate('asesoria');}}
                 />
            </View>
            <View style={styles.loginContainer}>
            <Button
                title="Cancelar asesoria"
                titleStyle={{color:'red'}}
                type="outline"
                onPress={() => { this.Cancelar();}}   
              />
            </View>
            </View>


          </View>
        );
      }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    padding:20,
   },
  scroll: {
    backgroundColor: 'white',
  },
  section:{
    paddingTop: 14
},
subtitle:{
  color:'#909090',
  fontWeight: 'bold', 
  fontSize: 17, 
  padding: 14
},
loginContainer: {
  flexDirection:'row',
  marginLeft: 29,
  paddingTop:20,
  alignContent:"space-between",
  marginBottom:15,
  height: 35,
  alignItems: "stretch",
},
  name:{
    fontSize:22,
    color:"black",
    fontWeight:'600',
  },
  title:{
    color:'#66696B', 
    fontWeight: 'bold', 
    fontSize: 22, 
    padding: 14
  },
  itemTitle:{
    color: '#707171',
    fontWeight:'bold',
    fontSize:14
},
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 1,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})