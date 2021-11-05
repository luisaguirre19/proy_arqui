import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Injectable({
  providedIn: 'root'
})
export class SqlliteService {
  private storage: SQLiteObject;

  constructor(
    private sqlite: SQLite
    ) 
    { }

  crear_db(){
    this.sqlite.create({
      name: 'db_usuario.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
        this.storage = db;
          this.crear_tabla();
    });
  }

  crear_tabla(){
    this.storage.executeSql(
      'create table transac(id_usuario int null, ENVIA varchar(500) null, RECIBE varchar(500) null, CANTIDAD int null)', [])
    .then(() => {
    })
    .catch(e => console.log(e));
  }

  insert_usuario(id_usuario, ENVIA, RECIBE, CANTIDAD) {
    let data = [id_usuario, ENVIA, RECIBE, CANTIDAD];
    return this.storage.executeSql('INSERT INTO transac (id_usuario, ENVIA, RECIBE, CANTIDAD) VALUES (?, ?, ?, ?)', data).then(data => {
    });
  }

  buscar_transaccion(ENVIA, RECIBE, CANTIDAD){
    console.log("entra a busacar transac")
    this.storage.executeSql("SELECT * FROM transac where RECIBE = '" + RECIBE  +"'", []).then(data => {
      console.log("cantidad de columnas --> " + data.rows.length)
      if (data.rows.length > 0){
        this.storage.executeSql("UPDATE transac set id_usuario = id_usuario + 1, CANTIDAD = CANTIDAD + " + CANTIDAD + " where RECIBE = '" + RECIBE  + "'", []).then(data => {

        })
        this.storage.executeSql("UPDATE transac set id_usuario = id_usuario + 1, CANTIDAD = CANTIDAD - " + CANTIDAD + " where RECIBE = '" + ENVIA  + "'", []).then(data => {
        })
      }else{
        this.insert_usuario(1, ENVIA, RECIBE, CANTIDAD)
      }
    })
  }

  ver(comando){
     return this.storage.executeSql(comando, []).then(data => {
       console.error("esto el select :_D " + data + " parse " )
        return data;
    })
  }

}
