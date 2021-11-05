
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Injectable, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import {  SqlliteService} from "../service/sqllite.service";
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {


  constructor(public SQL : SqlliteService, public toastController: ToastController, public alertController: AlertController, private barcodeScanner: BarcodeScanner){}

  // socket = new WebSocket("wss://e713h73ky6.execute-api.us-east-2.amazonaws.com/production");
  ws = new WebSocket("wss://e713h73ky6.execute-api.us-east-2.amazonaws.com/production"); 

   DESTINO
   CANTIDAD
   PUBLICA
   PRIVADA
   descripcion
   estado = "Desconectar"
  ngOnInit() {
    this.SQL.crear_db()
    let self = this

    this.ws.onopen = this.onOpen;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;

    this.ws.onmessage = function(e) {
      onMessage_callback(e.data);
    };

    function onMessage_callback(data){
      self.enviar_db(data) 
    }
  }

  enviar(){
    if(this.DESTINO == "" || this.CANTIDAD == ""){
      alert("Es necesario ingresar el destino y la cantidad")
    }else{
      if(this.PRIVADA == Md5.hashStr (this.PUBLICA.toString())){
        let data = {
          desde:this.PUBLICA.toString(),
          to:this.DESTINO,
          cantidad:this.CANTIDAD
        }
        console.log("esto enviamos " + data)
        //this.socket.send(JSON.stringify(data))
        this.ws.send(JSON.stringify(data))
      }else{
        alert("Las claves no coinciden")
      }
    }
  }

  abonar(){
    if(this.CANTIDAD == ""){
      alert("Es necesario ingresar la cantidad a abonar.")
    }else{
      if(this.PRIVADA == Md5.hashStr (this.PUBLICA.toString())){
        let data = {
          desde:"abono",
          to:this.PUBLICA.toString(),
          cantidad:this.CANTIDAD
        }
        console.log("esto enviamos " + data)
        //this.socket.send(JSON.stringify(data))
        this.ws.send(JSON.stringify(data))
      }else{
        alert("Las claves no coinciden")
      }
    }
  }

  crear_claves(){
    let by = new Uint32Array(1)

    let hash = crypto.getRandomValues(by)
    this.PUBLICA = hash

    let pwd = Md5.hashStr (hash.toString())
    this.PRIVADA = pwd

    let data = {
      desde:"primer_envio",
      to:hash.toString(),
      cantidad:1000
    }
    //this.socket.send(JSON.stringify(data))
    this.ws.send(JSON.stringify(data))

    this.DESTINO = ""
    this.CANTIDAD = ""
  }

  ver(){
    if(this.PRIVADA == Md5.hashStr (this.PUBLICA.toString())){
      let consulta = "select CANTIDAD from transac where RECIBE = '" + this.PUBLICA + "'"
      let lists = [];
      this.SQL.ver(consulta).then(data=>{
        for(let i=0; i< data.rows.length; i++){
          console.log(data.rows.item(i))
          lists.push(data.rows.item(i));
          this.descripcion = "Tu disponible en monedero es Q." + data.rows.item(i).CANTIDAD
        }
      })
    }else{
      alert("Las claves no coinciden, deben coincidir para ver tu estado de cuenta")
    }

  }


    onOpen(event: any): void {
          console.log("connected"); 
           this.presentToast("Te has conectado a la red de CSJS")
           this.descripcion = "Desconectar"
    }
    
    
    onError(event: any): void {
        console.log(JSON.stringify(event.data));
    }
    
    onClose(event: any): void {
        console.log(JSON.stringify(event.data));
        this.presentToast("Has cerrado tu conexcion a la red de CSJS")
        this.descripcion = "Conectar"
    }

    enviar_db(db){
      let msg = {ENVIA:"", RECIBE:"",CANTIDAD:""}
      msg = JSON.parse(db)

      console.log(msg.ENVIA)
      console.log(msg.RECIBE)
      console.log(msg.CANTIDAD)

      if(msg.RECIBE == this.PUBLICA){
        this.descripcion = "Se han abonado Q." + msg.CANTIDAD + " a tu monedero."
      }
      this.SQL.buscar_transaccion(msg.ENVIA, msg.RECIBE, msg.CANTIDAD)
    }

    conectar(){
      if (this.estado == "Conectar") {
        this.ws.OPEN
        this.estado = "Desconectar"

      }else{
        this.estado = "Conectar"
        this.ws.close
      }
    }

    
    
    async presentToast(msg) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 2000
      });
      toast.present();
    }

    limpiar(){
     this.presentAlertConfirm()
    }

    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirmar accion!',
        message: 'Estas apunto de borrar la informacion en pantalla, asegurate de tener tu clave publica y privada guardada.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Continuar',
            handler: () => {
              this.PUBLICA = ""
              this.PRIVADA = ""
              this.DESTINO = ""
              this.CANTIDAD = ""
              this.descripcion = ""
            }
          }
        ]
      });
  
      await alert.present();
    }

    scanear() {
      const options: BarcodeScannerOptions = {
        preferFrontCamera: false,
        showFlipCameraButton: true,
        showTorchButton: true,
        torchOn: false,
        prompt: 'Escanea el QR del Destino',
        resultDisplayDuration: 500,
        formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
        orientation: 'portrait',
      };
  
      this.barcodeScanner.scan(options).then(barcodeData => {
        console.log('Barcode data', barcodeData);
        this.DESTINO = barcodeData.text;
  
      }).catch(err => {
        console.log('Error', err);
      });
    }
  
   
}