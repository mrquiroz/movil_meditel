import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Modal,
  TouchableHighlight,
  Picker,
  Alert,
  TouchableOpacity
} from 'react-native';
import {Text, ListItem, Divider,Avatar,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import {LocaleConfig} from 'react-native-calendars';
import { conditionalExpression } from '@babel/types';
import moment from "moment";


export default class Seleccionar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_medico:'',
            name:'',
            lastname:'',
            showAlert: false,
            specialty:'',
            paciente:'',
            hora:'12:00',
            fecha:'2019-11-01',
            rating:'',
            ocupados :[],
            data:[],
            horario:{},
            modalVisible: false,
            ready:false,
          }
          this.onDayPress = this.onDayPress.bind(this);
          global.selected_date = '';
          global.horario = '';
          global.Horario = ['1'];
          global.Horario_oc = ['1'];
          global.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUyLCJpYXQiOjE1NzYxMTc0MTV9.fUkBM8ZdzVjqyyQa7UOkDd37lN-NjmEjENxCT9Ym2W8'
      }
    updateFecha = (fecha) => {
        this.setState({ fecha: fecha })
     }
    updateHora= (hora) => {
      this.setState({ hora: hora })
    }

    Registro = () => {
      console.log("si entro : "+this.state.fecha + ' '+ this.state.hora)
        fetch('https://meditel-testing.herokuapp.com/api/asesoria/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + global.token, 
          },
          body: JSON.stringify({
              "fecha": global.selected_date +' '+this.state.hora,
              "id_doctor": this.state.id_medico
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('id_medico:'+this.state.id_medico)
        //console.log(responseJson)
          })
          .catch((error) => {
            //console.log(error)
      });
      Alert.alert(
        'Hora exitosamente agendada',
        'Puedes revisar tu asesoria en la seccion de asesorias',
        [
          {text: 'OK', onPress: () => this.props.navigation.navigate('agendar')},

          {text: ' Ver Asesorias', onPress: () => this.props.navigation.navigate('asesoria')},
        ],
        {cancelable: false},
      );
    };
    showAlert = () => {
        this.setModalVisible(!this.state.modalVisible);

      this.setState({
        showAlert: true
      });
    };

    hideAlert = () => {
      this.setState({
        showAlert: false
      });
    };

    fecha = (horario,fecha) =>{
      console.log('HORARIO')
      console.log(horario)
      console.log(fecha)
      if(fecha in horario ){
        var time1 = horario[fecha].inicio.split('.')[0];
        var time2 = horario[fecha].fin.split('.')[0];
        let fecha1 = moment(time1,'HH:mm:ss')
        var fecha2 = moment(time2,'HH:mm:ss')
        var Horario = new Array();
        while (fecha1 < fecha2.add(1,'m')){
            var cosa = fecha1.toString()
            Horario.push(cosa.split(' ')[4])
            fecha1 = fecha1.add(15,'m')
            
        }
        var Horario_oc = new Array();
        //console.log('Horario oc')
        //console.log(global.Horario_oc)
        Horario_oc = global.Horario_oc.filter( valor => fecha in valor)
        Horario_oc = Horario_oc.map(valor => valor[fecha])
        //console.log('Horario oc filter')
        //console.log(Horario_oc)
        //console.log(Horario_oc)
        //global.Horario_oc = Horario_oc.map(valor => valor.toString())
        Horario = Horario.map(valor => valor)
        //console.log('Horario')
        //console.log(Horario)
        Horario = Horario.filter(n => !Horario_oc.includes(n));
        //console.log('Horario fin')
        //console.log(Horario)
        global.Horario= Horario
        //console.log('-------- no aqui---------')
        this.setModalVisible()
      }
    }

    updateNombre= (nombre) => {
      this.setState({ paciente: nombre })
    }
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
    
      componentDidMount(){
        this.setState({id_medico:'gedg0ehc'})
                fetch('https://meditel-testing.herokuapp.com/api/doctor/show/gedg0ehc', {
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

        this.setState({id_medico:'gedg0ehc'})
            fetch('https://meditel-testing.herokuapp.com/api/asesoria/agendados/gedg0ehc', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + global.token, 
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ocupados:responseJson.data})
                })
                .catch((error) => {
                    console.log('Error al cargar las fechas')
            });

            this.setState({id_medico:'gedg0ehc'})
            fetch('https://meditel-testing.herokuapp.com/api/agenda/disponibilidad/gedg0ehc', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + global.token, 
                }
            })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({data:responseJson.data})
            this.setState({ready:true});
            })
            .catch((error) => {
                console.log('Error al cargar las fechas')
        });
      }
    render() {

      const data = this.state.data;
      const ocupados = this.state.ocupados;
      let iterador;
      let iter_oc;
      if (this.state.ready) {
        iterador = data
        iter_oc = ocupados
    } else {
        iterador = [{startDate:'',endDate:''}]
        iter_oc = [{fecha:''}]
    }
    const cosa = Object.values(iterador).map(value => ({[value.startDate.split('T')[0]]: {disabled: false}}))
    const test1 = Object.values(iterador).map(value => ({[value.startDate.split('T')[0]]: {'inicio':value.startDate.split('T')[1],'fin':value.endDate.split('T')[1]}}))
    //console.log(iterador[0])
    const test_oc = Object.values(iter_oc).map(value => ({[value.fecha.split(' ')[0].split('T')[0]]: value.fecha.split(' ')[1]}))
    console.log(this.state.ocupados)
    const cosita = global.Horario_oc
    //this.setState({horario:test})
    global.horario = test
    global.Horario_oc = test_oc
    //console.log('test:'+test)
    //console.log('cosita: '+cosa)
    const integrado = Object.values(cosa).reduce((a,b) => Object.assign(a,b))
    const test = Object.values(test1).reduce((a,b) => Object.assign(a,b))
    global.horario = test
    //console.log('test:'+test)

    const cosa2 = Object.values(iterador).map(value => ([value.startDate.split('T')[1]]))
    //console.log('test:'+test)
    

    LocaleConfig.locales['esp'] = {
      monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthNamesShort: ['Ene.','Feb.','Mars','Abr','May','Jun','Jul.','Agos','Sept.','Oct.','Nov.','Dic.'],
      dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
      dayNamesShort: ['Dom.','Lun.','Mar.','Mir.','Jue.','Vie.','Sab.'],
      today: 'Hoy\'hoy'
    };
    LocaleConfig.defaultLocale = 'esp';

        return (
          <View style={styles.container}>

          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}>
          <View style={{marginTop: 22}}>
          <Text style={styles.name2}>{global.selected_date}</Text>
          <Text style={styles.name2}>Hora</Text>
          
          <View style={styles.section}>
          <Picker
            //style={{your_style}}
            mode="dropdown"
            selectedValue={global.Horario[0]}
            onValueChange= {this.updateHora}> 
            {global.Horario.map((item, index) => {
                return (<Picker.Item label={item} value={index} key={index}/>) 
            })}
        </Picker>        
        </View>
          <View style={{flex:1,
                          flexDirection: 'row',
                          alignContent:'space-between'}}>
            <View style={styles.loginContainer}>
            <Button
                title="Agendar asesoria"
                type="outline"
                onPress={() => {this.showAlert();}}
                 />
            </View>
            <View style={styles.loginContainer}>
            <Button
                title="Cancelar"
                titleStyle={{color:'red'}}
                type="outline"
                onPress={() => { this.setModalVisible(false);}}   
              />
            </View>
            </View>
            </View>
        </Modal>


          <ScrollView>
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
                <Text style={styles.name}>{this.state.name}</Text>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                  }}
                >
                  {this.state.specialty}
                </Text>
                <View style={styles.userRow}>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                  }}
                >
                  {this.state.rating}
                </Text>
                <Icon name="star" size={17} color="yellow" />
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.name2}>Paciente</Text>
              <Picker selectedValue = {global.nombre + ' '+ global.apellido} onValueChange = {this.updateNombre}>
               <Picker.Item label = {global.nombre + ' '+ global.apellido} value = {global.nombre + ' '+ global.apellido} />
              </Picker>

            </View>
            <Text style={styles.name2}>Horario medico</Text>
            {console.log('INTEGRADO')}
            {console.log(integrado)}
            <CalendarList
              onDayPress={(day)=>this.fecha(global.horario,day.dateString.toString())}
              style={styles.calendar}
              current={'2019-12-12'}
              horizontal
              pagingEnabled
              markedDates={integrado}
              disabledByDefault={true}
              disableTouchEventByDefault= {true}
              hideArrows={false}
            />

            










            <AwesomeAlert
                show={this.state.showAlert}
                showProgress={false}
                title="Tu reserva"
                message= {"Fecha: " + global.selected_date +"\n" + "Hora: " + this.state.hora}
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
                  this.Registro();
                }}
              />
              </ScrollView>
          </View>
          
        );
      }

      onDayPress(day) {
        console.log('day.dateString')
        console.log(day.dateString)
        if (day.dateString in integrado){
          this.setModalVisible(true);
        global.selected_date = day.dateString;
        this.setState({
          selected: day.dateString
        });
        }
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
  name:{
    fontSize:22,
    color:"black",
    fontWeight:'600',
  },
  name2:{
    fontSize:18,
    color:"black",
    fontWeight:'600',
    paddingTop:10,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 10 
  },
  input: {
    flex:1,
    color:'black',
    fontSize:16,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 0  
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
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
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
  
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})