import React from 'react';
import './signin.css';

class SignIn extends React.Component  {
	constructor(props) {
		super(props);
		this.state ={
			signInEmail:'',
			signInPassword:''
		}
	}


	onEmailchange = (event) =>{
		this.setState({signInEmail: event.target.value})
	}

	onPasswordchange = (event) =>{
		this.setState({signInPassword: event.target.value})
	}

	saveAuthTokenSession = (token) => {
		window.sessionStorage.setItem('token', token)
	}

	onSubmitSignIn = () => {
		fetch('http://localhost:3000/signin', {
			method: 'POST',
			headers: {'content-Type': 'application/json'},
			body: JSON.stringify({
				email:this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
		.then(response => response.json())
		.then(data => {
			if(data.userId && data.success === true) {
				this.saveAuthTokenSession(data.token)
				fetch(`http://localhost:3000/profile/${data.userId}`, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': data.token
					}
				})
				.then(resp => resp.json())
				.then(user => {
					if(user && user.email) {
						this.props.loadUser(user);
						this.props.onRouteChange('home')
					}
				})
				.catch(console.log)
			}
		})
	}

	render () {
		const {onRouteChange} = this.props;
		return (
			<article className="br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
				<main className=" pa4 black-80">
				  <form className="measure ">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 background-hover"
				        		type="email"
				        		name="email-address" 
				        		id="email-address"
				        		onChange = {this.onEmailchange}
				        		/>
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 background-hover" 
				        		type="password" 
				        		name="password"  
				        		id="password"
				        		onChange = {this.onPasswordchange}
				        		/>
				      </div>
				    </fieldset>
				    <div className="">
				      <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
				       onClick = {this.onSubmitSignIn}
				       type="button" value="Sign in"/>
				    </div>
				    <div className="lh-copy mt3">
				      <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
		   			 </div>
		 		 </form>
				</main>
			</article>
		)
	}
}

export default SignIn;