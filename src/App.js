import logo from './logo512.png';
import openLock from './openLock.png';
import closedLock from './closedLock.png';
import './App.css';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { app } from './firebase';
import { getDatabase, ref, set, child, get } from "firebase/database";
import bcrypt from 'bcryptjs';
import React from 'react';

function App() {
  var [LoggedIn, SetLoggedIn] = useState(false);
  var [AdminVisibility, SetAdminVisibility] = useState(false);

  var LoggedInUser = localStorage.getItem('LoggedInUser');
  var IsAdmin = localStorage.getItem('Admin');
  var intervalId;

  if (!LoggedIn && LoggedInUser === null) {
    return (
      <div className="App">

        <img src={logo} width="120px" alt="Logo"/>

        <div>
          <TextField
            id="Rnum"
            label="Studenten Nummer"
            margin="normal"
            variant="filled"
            sx={{ input: { background: 'white' }}}
          /><br></br>

          <TextField
            id="Passw"
            label="Wachtwoord"
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="filled"
            sx={{ input: { background: 'white' }}}
          /><br></br>

        <div id="LoginErr">
        </div><br></br>

          <Button margin="normal" size="large" variant="contained" onClick={NukiLogin}>Login</Button>

        </div>

      </div>
    );
  }
  else if (AdminVisibility && IsAdmin === "true") {
    return (
      <div className="App">
         <h1 style={{ color: 'white'}}>Nuki Slot</h1>
         <p  style={{ color: 'lightgray' }}>Admin Menu</p>

        <div class="div3">
          <TextField
            id="NewRnum"
            label="Studenten Nummer"
            margin="normal"
            variant="filled"
            sx={{ input: { background: 'white' }}}
          /><br></br>

          <TextField
            id="NewPassw"
            label="Wachtwoord"
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="filled"
            sx={{ input: { background: 'white' }}}
          /><br></br>

          <FormControlLabel control={<Switch id="NewAdmin"/>} label="Admin" /><br></br>

          <div id="RegErr"></div>
          
          <Button style={{width: '220px', margin: '10px'}} size="large" variant="contained" onClick={NukiRegister}>Register new user</Button><br></br>
        </div>

        <Button style={{width: '220px'}} size="large" variant="contained" onClick={AdminMenu}>Return</Button><br></br>

        <div class="div3">
          <Button style={{width: '220px'}} id="logbtn" size="large" variant="contained" onClick={LoadLog}>Load Logs</Button><br></br>

          <div id="maindiv"></div>
        </div>

      </div>
    );
  }
  else if (!AdminVisibility && IsAdmin === "true") {
    return (
      <div className="App">
         <h1 style={{ color: 'white'}}>Nuki Slot</h1>
         <p  style={{ color: 'lightgray' }}>Lokaal 1.16</p>

         <div class="div1">
            <img class="image1" id="imgUnLock" onClick={NukiLock} src={openLock} width="200px" alt="Logo" style={{visibility: 'hidden' }}/>
            <img class="image2" id="imgLock" onClick={NukiUnlock} src={closedLock} width="200px" alt="Logo" style={{visibility: 'hidden' }}/>
            <p id="status" style={{ color: 'lightgray' }}></p>
        </div>
        
        <div class="div2">
          <Button style={{ height: '75px', width: '300px',fontSize: '25px', margin: '10px' }} variant="contained" id="logoutbtn" onClick={Logout}>Logout</Button><br></br>
          <Button style={{ height: '75px', width: '300px',fontSize: '25px', margin: '10px' }} variant="contained" id="adminbtn" onClick={AdminMenu}>Admin Menu</Button><br></br>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="App">
         <h1 style={{ color: 'white'}}>Nuki Slot</h1>
         <p  style={{ color: 'lightgray' }}>Lokaal 1.16</p>

         <div class="div1">
            <img class="image1" id="imgUnLock" onClick={NukiLock} src={openLock} width="200px" alt="Logo" style={{visibility: 'hidden' }}/>
            <img class="image2" id="imgLock" onClick={NukiUnlock} src={closedLock} width="200px" alt="Logo" style={{visibility: 'hidden' }}/>
            <p id="status" style={{ color: 'lightgray' }}></p>
        </div>
        
        <div class="div2">
          <Button style={{ height: '75px', width: '300px',fontSize: '25px', margin: '10px' }} variant="contained" id="logoutbtn" onClick={Logout}>Logout</Button><br></br>
        </div>
      </div>
    );
  }

  async function NukiLock(){
    console.log("Lock started")
    await fetch('https://api.nuki.io/smartlock/645574324/action/lock', {
      method: 'POST',
      headers: {
          accept: 'application/json',
          authorization: 'Bearer bdeb6ae900e63ad6e8c13afa19fa2ce4b053838c7d1efd91cddc209b95b6acec74740b2c3602946e',
      }
  }).then(data => {
    console.log(data);

    if (data.status === 204)
      ActionWrite("lock");
    })
  }

  async function NukiUnlock(){
    console.log("unlock started")
    await fetch('https://api.nuki.io/smartlock/645574324/action/unlock', {
      method: 'POST',
      headers: {
          accept: 'application/json',
          authorization: 'Bearer bdeb6ae900e63ad6e8c13afa19fa2ce4b053838c7d1efd91cddc209b95b6acec74740b2c3602946e', 
      }
  }).then(data => {
    console.log(data);

    if (data.status === 204)
      ActionWrite("unlock");
    })
  }

  async function GetStatus(){
    // console.log("Get status started")
    await fetch('https://api.nuki.io/smartlock', {
      method: 'GET',
      headers: {
          accept: 'application/json',
          authorization: 'Bearer bdeb6ae900e63ad6e8c13afa19fa2ce4b053838c7d1efd91cddc209b95b6acec74740b2c3602946e', 
      }
    }).then(data => data.json())
    .then(json => {
  
    if (json[0].state.state === 1) {
      // alert("deur gesloten")
      // console.log("Slot gesloten")
      document.getElementById("imgUnLock").style.visibility = "hidden"
      document.getElementById("imgLock").style.visibility = "visible"
      document.getElementById("status").innerHTML = "Status: Slot gesloten"
      document.getElementById("status").style = "color:#DADBDF"
      }
    if (json[0].state.state === 3) {
      // alert("deur open")
      // console.log("Slot open")
      document.getElementById("imgLock").style.visibility = "hidden"
      document.getElementById("imgUnLock").style.visibility = "visible"
      document.getElementById("status").innerHTML = "Status: Slot open"
    
      document.getElementById("status").style = "color:#87BF9A"
      }
    if (json[0].state.state === 4) {
      // alert("slot in beweging")
      console.log("Slot wordt gesloten")
      document.getElementById("status").innerHTML = "Status: Slot wordt gesloten"
      }
    if (json[0].state.state === 2) {
      // alert("slot in beweging")
      console.log("Slot wordt geopend")
      document.getElementById("status").innerHTML = "Status: Slot wordt geopend"
      }
    })
  }

  async function Start(){
    intervalId = setInterval(function(){
     GetStatus()
    }, 1000);
  }

   
  function NukiLogin(){
    var userId = document.getElementById("Rnum").value;
    var LoginErr = document.getElementById("LoginErr");
    var Password = document.getElementById("Passw").value;

    const dbRef = ref(getDatabase());
    get(child(dbRef, `Nukilock/users/${userId.toLowerCase()}`)).then((snapshot) => {
    if (userId !== "" && Password !== ""){
      if (snapshot.exists()) {
        if (bcrypt.compareSync(Password, snapshot.val().password)){
          localStorage.setItem('LoggedInUser', userId);
          localStorage.setItem('Admin', snapshot.val().admin);
          IsAdmin = localStorage.getItem('Admin');
          SetLoggedIn(true);
          Start();
        }
        else
          LoginErr.innerText = "Onjuist Wachtwoord."
      }
      else
          LoginErr.innerText = "Gebruiker niet gevonden."
    }
    else
      LoginErr.innerText = "Gelieve alle velden in te vullen."
    }).catch((error) => {
      console.error(error);
    });
  }

  function NukiRegister(){
    var NewuserId = document.getElementById("NewRnum").value.toLowerCase();
    var NewPassword = document.getElementById("NewPassw").value;
    var NewAdminstate = document.getElementById("NewAdmin").checked;
    var RegErr = document.getElementById("RegErr");

    const hashedPassword = bcrypt.hashSync(NewPassword, bcrypt.genSaltSync());

    if (NewuserId !== "" && NewPassword !== ""){
      const db = getDatabase();
      set(ref(db, 'Nukilock/users/' + NewuserId), {
        password: hashedPassword,
        email: NewuserId + "@student.vives.be",
        admin: NewAdminstate
      });

      RegErr.innerText = "Gebruiker succesvol toegevoegd"
    }
    else
      RegErr.innerText = "Gelieve alle velden in te vullen."
  }

  function Logout(){
    clearInterval(intervalId);
    localStorage.removeItem('LoggedInUser');
    localStorage.removeItem('Admin');
    IsAdmin = false;
    SetLoggedIn(false);
  }

  function LoadLog(){
    var maindiv = document.getElementById('maindiv');
    const dbRef = ref(getDatabase());
    get(child(dbRef, `Nukilock/actions`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        snapshot.forEach(actions => {
          maindiv.innerHTML += '<div>' + actions.val().timestamp + '</div><div>Action: ' + actions.val().action + '<br>User: ' + actions.val().user + '</div><br>';
      ;})
    }
    }).catch((error) => {
      console.error(error);
    });

    document.getElementById("logbtn").style.display = "none";
  }

  function AdminMenu(){
    IsAdmin = localStorage.getItem('Admin');
    if(AdminVisibility){
      SetAdminVisibility(false);
      Start();
    }
    else{
      if(IsAdmin === "true"){
        clearInterval(intervalId);
        SetAdminVisibility(true);
      }
      else
        alert('U heeft geen administrator rechten.');
    }
  }

  function ActionWrite(actionstr){
    var currentTime = Date().toString()

    const db = getDatabase();
    set(ref(db, 'Nukilock/actions/' + Math.floor(Date.now() / 1000)*-1), {
      action: actionstr,
      user: LoggedInUser,
      timestamp: currentTime
    });
  }

}


export default App;
