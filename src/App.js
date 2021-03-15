import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    picture: '',
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    console.log(handleSignIn);
        firebase.auth().signInWithPopup(provider)
        .then(res => {
         const {displayName, email} = res.user;
         const signedInUser = {
           isSignedIn: true,
           name: displayName,
           email: email
         }
         setUser(signedInUser);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () =>{
       firebase.auth().signOut()
       .then(res => {
            const signedOutUser = {
              isSignedIn: false,
              name:'',
              email:'',
              error:'',
              success: false
            }
            setUser(signedOutUser);
       })
      .catch(err => {
       // An error happened.
      })
  }
  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
        isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
        const isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      // [...cart, newItem]
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (event) => {
     if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
         const  newUserInfo = {...user};
         newUserInfo.error = '';
         newUserInfo.success = true;
          setUser(newUserInfo);
      })
      .catch(error => {
        const  newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ..
      });
     }

     if(!newUser && user.email && user.password){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
         const  newUserInfo = {...user};
         newUserInfo.error = '';
         newUserInfo.success = true;
         setUser(newUserInfo);
        })
        .catch((error) => {
        const  newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
     });
     }

     event.preventDefault();
  }
  return (
    <div className="button">
      {
      user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button> :
      <button onClick={handleSignIn} >Sign in</button>
      }
      {
        user.isSignedIn && <div>
        <p>Welcome,{user.name}</p>
        <p>Your email: {user.email}</p>
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor ="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
           {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name" />}
           <br/>
           <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
           <br/>
           <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
           <br/>
           <input type="submit" value="Submit"/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success && <p style={{color:'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;
