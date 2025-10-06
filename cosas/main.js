import { v4 as uuidv4 } from 'uuid';
import { connect } from '@planetscale/database'

const config = {
  host: __DATABASE_HOST__,
  username: __DATABASE_USERNAME__,
  password: __DATABASE_PASSWORD__
}

const conn = connect(config)

// Base URL
const baseUrl = "https://proyecto-ninja-ebon.vercel.app"
// Form
const form = document.getElementById("form")
const links = document.getElementById("links")

form.addEventListener("submit", createRoom)

const btnReStart = document.getElementById("restart")

btnReStart.addEventListener("click", deselectCamera)

//const uuid = uuidv4();

let customPlayerLink_1 = null;
let customPlayerLink_2 = null;

async function createRoom(e) {
  e.preventDefault();

  // Inputs value
  var uuid = document.querySelector("#nombreSala").value;
  var enlaceJugador1 = document.querySelector("#enlaceJugador1").value;
  var enlaceJugador2 = document.querySelector("#enlaceJugador2").value;
  var nombreJuez1 = document.querySelector("#nombreJuez1").value;
  var enlaceJuez1 = document.querySelector("#enlaceJuez1").value;
  var nombreJuez2 = document.querySelector("#nombreJuez2").value;
  var enlaceJuez2 = document.querySelector("#enlaceJuez2").value;

  // Validate 

  if (uuid == "") {
    document.getElementById("nombreSala").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  } else if (enlaceJugador1 == "") {
    document.getElementById("enlaceJugador1").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  } else if (enlaceJugador2 == "") {
    document.getElementById("enlaceJugador2").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  } else if (nombreJuez1 == "") {
    document.getElementById("nombreJuez1").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  } else if (enlaceJuez1 == "") {
    document.getElementById("enlaceJuez1").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  } else if (nombreJuez2 == "") {
    document.getElementById("nombreJuez2").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  } else if (enlaceJuez2 == "") {
    document.getElementById("enlaceJuez2").focus();
    alert('Favor de llenar los campos faltantes >:v ');
  }

  //select
  const result = await conn.execute('SELECT * FROM room where uuid_sala = ?', [uuid]);

  if (result.rows.length > 0) {
    //alert ("Ya existe una sala con ese nombre :v");

    //update
    const jugador1 = await conn.execute('SELECT playerlink_1 FROM room where uuid_sala = ?', [uuid]);
    const jugador2 = await conn.execute('SELECT playerlink_2 FROM room where uuid_sala = ?', [uuid]);

    if(jugador1.rows[0].playerlink_1 == enlaceJugador1 && jugador2.rows[0].playerlink_2 != enlaceJugador2) {
      
      const query = 'UPDATE room SET playerlink_2 = :linkJugador2 where uuid_sala = :sala'

      const params = {
        sala: uuid,
        linkJugador2: enlaceJugador2
      }

      await conn.execute(query, params)

      alert ("Se actualizo el link del jugador 2 :v");

      // Create custom urls
      let params_py_1 = new URLSearchParams(new URL(enlaceJugador1).search);
      let streamID_1 = params_py_1.get("view"); // get the uuid from room created before
      let params_py_2 = new URLSearchParams(new URL(enlaceJugador2).search);
      let streamID_2 = params_py_2.get("view"); // get the uuid from room created before

      customPlayerLink_1 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_1

      customPlayerLink_2 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_2

      const roomUrl = baseUrl + '/room/index.html?room_uuid=' + uuid

      const room = {
        playerlink1: customPlayerLink_1,
        playerlink2: customPlayerLink_2,
        url: roomUrl,
        room: uuid
      }

      //localStorage.setItem("room",JSON.stringify(room))

      links.innerHTML = `
      <ul>
        <li> Enlace Jugador 1: ${room.playerlink1} </li>
        <li> Enlace Jugador 2: ${room.playerlink2} </li>
        <hr>
        <li> Enlace Sala: ${room.url} </li>
      <ul>  
      `

    } else if (jugador1.rows[0].playerlink_1 != enlaceJugador1 && jugador2.rows[0].playerlink_2 == enlaceJugador2) {
      
      const query = 'UPDATE room SET playerlink_1 = :linkJugador1 where uuid_sala = :sala'
      
      const params = {
        sala: uuid,
        linkJugador1: enlaceJugador1
      }

      await conn.execute(query, params)

      alert ("Se actualizo el link del jugador 2 :v");
                // Create custom urls
      let params_py_1 = new URLSearchParams(new URL(enlaceJugador1).search);
      let streamID_1 = params_py_1.get("view"); // get the uuid from room created before
      let params_py_2 = new URLSearchParams(new URL(enlaceJugador2).search);
      let streamID_2 = params_py_2.get("view"); // get the uuid from room created before

      customPlayerLink_1 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_1

      customPlayerLink_2 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_2

      const roomUrl = baseUrl + '/room/index.html?room_uuid=' + uuid

      const room = {
        playerlink1: customPlayerLink_1,
        playerlink2: customPlayerLink_2,
        url: roomUrl,
        room: uuid
      }
      
      //localStorage.setItem("room",JSON.stringify(room))

      links.innerHTML = `
      <ul>
        <li> Enlace Jugador 1: ${room.playerlink1} </li>
        <li> Enlace Jugador 2: ${room.playerlink2} </li>
        <hr>
        <li> Enlace Sala: ${room.url} </li>
      <ul>  
      `

    } else if (jugador1.rows[0].playerlink_1 != enlaceJugador1 && jugador2.rows[0].playerlink_2 != enlaceJugador2) {

      const query = 'UPDATE room SET playerlink_1 = :linkJugador1, playerlink_2 = :linkJugador2 where uuid_sala = :sala'
      
      const params = {
        sala: uuid,
        linkJugador1: enlaceJugador1,
        linkJugador2: enlaceJugador2
      }

      await conn.execute(query, params)
      
      alert (":Se actualizo el link del jugador 1 y Jugador 2 :v");
      
      // Create custom urls
      let params_py_1 = new URLSearchParams(new URL(enlaceJugador1).search);
      let streamID_1 = params_py_1.get("view"); // get the uuid from room created before
      let params_py_2 = new URLSearchParams(new URL(enlaceJugador2).search);
      let streamID_2 = params_py_2.get("view"); // get the uuid from room created before

      customPlayerLink_1 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_1

      customPlayerLink_2 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_2

      const roomUrl = baseUrl + '/room/index.html?room_uuid=' + uuid

      const room = {
        playerlink1: customPlayerLink_1,
        playerlink2: customPlayerLink_2,
        url: roomUrl,
        room: uuid
      }
      
      //localStorage.setItem("room",JSON.stringify(room))

      links.innerHTML = `
      <ul>
        <li> Enlace Jugador 1: ${room.playerlink1} </li>
        <li> Enlace Jugador 2: ${room.playerlink2} </li>
        <hr>
        <li> Enlace Sala: ${room.url} </li>
      <ul>  
      `
  } 
} else {

    alert ("Insert");


    //Insert

    const query = 'INSERT INTO room (`uuid_sala`, `playerlink_1`, `playerlink_2`, `juezname_1`,`juezlink_1`,`juezname_2`,`juezlink_2`) VALUES (:uuid, :epy1, :epy2, :njz1, :ejz1, :njz2, :ejz2)'

    const params = {
      uuid: uuid,
      epy1: enlaceJugador1,
      epy2: enlaceJugador2,
      njz1: nombreJuez1,
      ejz1: enlaceJuez1,
      njz2: nombreJuez2,
      ejz2: enlaceJuez2
    }

    const results = await conn.execute(query, params)

    // Create custom urls
    let params_py_1 = new URLSearchParams(new URL(enlaceJugador1).search);
    let streamID_1 = params_py_1.get("view"); // get the uuid from room created before
    let params_py_2 = new URLSearchParams(new URL(enlaceJugador2).search);
    let streamID_2 = params_py_2.get("view"); // get the uuid from room created before

    customPlayerLink_1 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_1

    customPlayerLink_2 = baseUrl + '/room/index.html?room_uuid=' + uuid + '&stream_id=' + streamID_2

    const roomUrl = baseUrl + '/room/index.html?room_uuid=' + uuid

    const room = {
      playerlink1: customPlayerLink_1,
      playerlink2: customPlayerLink_2,
      url: roomUrl,
      room: uuid
    }

      //localStorage.setItem("room",JSON.stringify(room))

    links.innerHTML = `
    <ul>
      <li> Enlace Jugador 1: ${room.playerlink1} </li>
      <li> Enlace Jugador 2: ${room.playerlink2} </li>
      <hr width="480 px">
      <li> Enlace Sala: ${room.url} </li>
    <ul>  
  `

  }


}

//let room = JSON.parse(localStorage.getItem("room"))

//console.log(room);

async function deselectCamera() {
  const query = 'UPDATE room SET camara_seleccionada = :camera_id where uuid_sala = :sala'

  const params = {
    sala: uuid,
    camera_id: null
  }

  await conn.execute(query, params)

}


const btnStop = document.getElementById("stop");

form.addEventListener("submit", btnStop);

async function btnStop(e) {

//select
const resultado = await conn.execute('SELECT * FROM room where uuid_sala = ?', [uuid]);
const online = await conn.execute('SELECT online FROM room where uuid_sala = ?', [uuid]);

if (resultado.rows.length > 0) {
  alert ("Ya existe una sala con ese nombre :v" + online);
}
}
