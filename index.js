/**
 * @format
 */
import './shim'
import 'react-native-gesture-handler'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerGlobals} from 'react-native-webrtc'
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";

messaging().setBackgroundMessageHandler( async (payload) => {
    console.log(payload)
    switch (payload.data.type) {
        case 'agendada:recordatorio':
            PushNotification.localNotification({
                title: "Tu asesoría está por comenzar",
                message: "Con "+payload.data.nombre+' '+payload.data.apellido, // (required)
                id: '33',
                bigText: "Tu asesoría agendada con "+payload.data.nombre+' '+payload.data.apellido+' comenzará en 10 minutos'
            });
            break;
        case 'agendada:ready':
            global.agendada = {
                id_socket: payload.data.id_socket,
                id_asesoria: payload.data.id_asesoria,
                id_doctor: payload.data.id_doctor
            };
            PushNotification.cancelAllLocalNotifications();
            // PushNotification.cancelLocalNotifications({id: '33'}),
            PushNotification.localNotification({
                title: "Tu médico te espera!",
                message: payload.data.nombre+' '+payload.data.apellido+' está list@ para comenzar la asesoría', // (required)
                bigText: 'Ingresa a la aplicación, '+payload.data.nombre+' '+payload.data.apellido+' te está esperando!'
            });
    }
});

registerGlobals();
AppRegistry.registerComponent(appName, () => App);
