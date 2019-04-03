import React, { Component } from 'react';
import Particles from 'react-particles-js'; //npmp install
//import Clarifai from 'clarifai'; //npm install //presun na server

import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/register/Register';

import './App.css';

//presun na server
// const app = new Clarifai.App({
//   apiKey: '01ff889243434b8cbd66e4cb5e00660a'
// });

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  //lifecycle hook - pomoci fetch se pripojim na server - pro test
  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(console.log) //jednodussi bez data => console
  // }


  loadUser = (userdata) => {
    this.setState({
      user: {
        id: userdata.id,
        name: userdata.name,
        email: userdata.email,
        entries: userdata.entries,
        joined: userdata.joined
      }
    })
  }

  //only one bouning box for one face, doesn't work for more faces
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; //z response JSONu me zajimaji coords
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    //console.log(event.target.value);
    this.setState({ input: event.target.value });
  }


  onButtonSubmit = () => {
    //console.log('click');
    this.setState({ imageUrl: this.state.input });
    //presun na server
    //app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    //pridani fetch pro rozdeleni imageurl
    // fetch('https://ferdanreco.herokuapp.com/imageurl', {
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        //id: this.state.user.id //fix
        input: this.state.input
      })
    })
      .then(response => response.json()) //protoze mam fetch() musim konverzi do JSON
      .then(response => {
        if (response) {
          // fetch('https://ferdanreco.herokuapp.com/image', {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          }).then(response => response.json())
            .then(count => {
              //this.setState({user:{entries: count}}) //problem: zmenim cely objekt, nezobrazuje mi pak jmeno
              //chci ho jen updatnout o jiny pocet entries
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .then(console.log(response)) //smazat
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ initialState }) //isSignedIn: false
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    //const { isSignedIn, imageUrl, route, box } = this.state; //dekonstrukci nepouzivam
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
          ? (
            <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition
                box={this.state.box}
                imageUrl={this.state.imageUrl} />
            </div>
          )
          : (
            this.state.route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
