import React from 'react';

import ProfileIcon from '../Profile/profileIcon'
const Navigation = ({onRouteChange, isSignedIn, togglePortal, profilePicture}) =>{
		if(isSignedIn){
			return(
				<nav style = {{display: 'flex', justifyContent: 'flex-end'}}>
					<ProfileIcon togglePortal={togglePortal} onRouteChange={onRouteChange} profilePicture={profilePicture}/>
				 </nav>
				 )
		}else{
		return(
				<nav style = {{display: 'flex', justifyContent: 'flex-end'}}>
					<p className = 'f3 link dim underline pa3 black pointer'
					onClick={() => onRouteChange('signin')}>
					Sign In</p>
					<p className = 'f3 link dim underline pa3 black pointer'
					onClick={() => onRouteChange('register')}>
					Register</p>
				 </nav>
		)
		}
}

export default Navigation;