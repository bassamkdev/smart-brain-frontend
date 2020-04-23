import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import Portal from './components/Modal/Portal'
import Profile from './components/Profile/Profile'

const particleOptions = {
  particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: 800
        }         
      }
   }
 }
 const initialState = {
  input : '',
  imageUrl :'',
  boxes : [],
  route : 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id:'',
    name:'',
    email:'',
    hasphoto: false,
    age: 0,
    pet: '',
    entries:0,
    joined:''
  },
  profilePicture: null,
 }
class App extends Component {
  constructor () {
    super();
    this.state = initialState;
  }

  componentDidMount() {
		const token = window.sessionStorage.getItem('token');
		if (token) {
			fetch('http://localhost:3000/signin', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(resp => resp.json())
			.then(data => {
				if (data && data.id) {
					fetch(`http://localhost:3000/profile/${data.id}`, {
						method: 'get',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': token
						}
					})
					.then(resp => resp.json())
					.then(user => {
						if(user && user.email) {
							this.loadUser(user);
							this.onRouteChange('home')
						}
					})
				}
			})
			.catch(console.log)
		}
  }
  
  loadProfilePicture (email) {
    return fetch("https://dghnfjuec1.execute-api.us-east-1.amazonaws.com/dev/requestProfilePhoto", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: email,
      })
    })
    .then(response => response.json())
    .then(result => {
      return this.setState({profilePicture: result.profilePhoto})
    }).catch(err => console.log(err))
  }

  loadUser = (data) => {
    this.setState({user: {
      id : data.id,
      name: data.name,
      email: data.email,
      hasphoto: data.hasphoto,
      entries: data.entries,
      joined: data.joined,
      age: data.age,
      pet: data.pet,
    }}, () => {
      if (this.state.user.hasphoto) {
        this.loadProfilePicture(this.state.user.email);
      }
    })
  }

  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return data.outputs[0].data.regions.map(region => {
        const clarifaiFace = region.region_info.bounding_box;
        return {
                  leftcol: clarifaiFace.left_col *width,
                  rightcol: width - (clarifaiFace.right_col *width),
                  toprow: clarifaiFace.top_row *height,
                  bottomrow: height - (clarifaiFace.bottom_row * height)
                }
      })
    }
    return
  }

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState ({boxes: boxes});
    } else {
      this.setState({ boxes: []})
    }
  }

  onInputChange = (event) => {
  this.setState({input : event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {
        'content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({input:this.state.input })
    })
    .then(response => response.json())
    .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {
            'content-Type': 'application/json',
            'Authorization': window.sessionStorage.getItem('token')
          },
            body: JSON.stringify({
                id:this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err => console.log('Err'))
      
  }

  handleSignOut = () => {
    fetch('http://localhost:3000/signout', {
			method: 'POST',
			headers: {'content-Type': 'application/json'},
			body: JSON.stringify({
				token: window.sessionStorage.getItem('token')
			})
    })
    window.sessionStorage.removeItem('token');
  }

  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState(initialState);
      this.handleSignOut();
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState ({route: route})
  }

  togglePortal = () => {
    this.setState( prevState => ({
      ...prevState,
      isProfileOpen: !this.state.isProfileOpen
    }))
  }

  render () {
    const {boxes, imageUrl, isSignedIn, route, isProfileOpen, user, profilePicture} = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation 
          onRouteChange={this.onRouteChange} 
          isSignedIn={isSignedIn}
          togglePortal={this.togglePortal}
          profilePicture={profilePicture}
        />
          {isProfileOpen &&
        <Portal>
          <Profile 
            isProfileOpen={isProfileOpen} 
            togglePortal={this.togglePortal}
            user={user}
            loadUser={this.loadUser}
            profilePicture={profilePicture}
          />
        </Portal>}
        {route === 'home'
         ? <div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={imageUrl} boxes={boxes}/>
          </div>
          :(route === 'signin'
            ?<SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
       </div>
    );
  }
}

export default App;
