import React from 'react';
import './profile.css'

const Profile = ({ isProfileOpen, togglePortal, loadUser, user, profilePicture }) => {
    const { name, joined, entries, age, pet, id, email, hasphoto } = user

    const fileInputRef = React.createRef();
    const [imageFile, setImageFile] = React.useState();
    const [profileImage, setProfileImage] = React.useState();
    const [isOnPhoto, setIsOnPhoto] = React.useState(false);

    const [userInfo, setUserInfo] = React.useState({
        name: name,
        age: age,
        pet: pet,
        hasphoto: hasphoto,
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo({...userInfo, [name]: value})
    }

    const handleImageUpload = (image) => {
        return fetch("https://dghnfjuec1.execute-api.us-east-1.amazonaws.com/dev/requestUploadURL", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: email,
              type: image.type
            })
          })
          .then(response => response.json())
          .then(result => {
            return fetch(result.uploadURL, {
              method: "PUT",
              body: image
            })
          }).catch(err => console.log(err))
    }

    const handleSave = async (data) => {
        const { userInfo, imageFile } = data;
        if (imageFile){
            await handleImageUpload(imageFile, name)
        }
        fetch(`http://localhost:3000/profile/${id}`, {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({ formInput: userInfo })
        }).then(resp => {
            if (resp.status === 200 || resp.status === 304) {
                togglePortal();
                loadUser({ ...user, ...userInfo});
            }
        }).catch(console.log)
    }

    const openFileInputDialog = () => {
        fileInputRef.current.click()
    }

    const onFileAdded = event => {
        setImageFile(event.target.files[0]);
        setUserInfo({...userInfo, hasphoto: true})
    }

    React.useEffect( () => {
        if(imageFile){
            setProfileImage(URL.createObjectURL(imageFile))
        }
    }, [imageFile])

    return (
        <div className='profile-modal'>
            <article className="br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5 bg-white">
				<main className=" pa4 black-80 w-80">
                    <div 
                        className=" h4 w4 br-100 dib profile-picture"
                        onClick = {openFileInputDialog}
                        onMouseEnter = { () => setIsOnPhoto(true)}
                        onMouseLeave = { () => setIsOnPhoto(false)}
                    >
                        <div className={ isOnPhoto ? 'photo-edit-mode br-100' : 'photo-edit-mode-disabled'}>
                            Choose
                        </div>
                        <img
                            src={profileImage || profilePicture || "http://tachyons.io/img/logo.jpg"}
                            alt="avatar"
                            className="br-100 image"
                        />
                        <input 
                            ref={fileInputRef}
                            type="file"
                            onChange={onFileAdded}
                            hidden
                        />
                    </div>
                    <h1>{ name }</h1>
                    <h4>{`Images Submitted: ${entries}`}</h4>
                    <p>{`Member since: ${new Date(joined).toLocaleDateString()}`}</p>
                    <hr/>
				    <div className="measure ">
				        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name:</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 background-hover"
                                type="text"
                                name="name"
                                placeholder={name} 
                                id="name"
                                onChange={handleChange}
                            />
				        </div>
				        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="age">Age:</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 background-hover" 
                                type="text" 
                                name="age"
                                placeholder={ age }  
                                id="age"
                                onChange={handleChange}
                            />
				        </div>
				        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="pet">Pet:</label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 background-hover" 
                                type="text" 
                                name="pet"  
                                id="pet"
                                placeholder= { pet }
                                onChange={handleChange}
                            />
				        </div>
		 		    </div>
                    <div 
                        className='mt4'
                        style={{ display: 'flex', 'justifyContent': 'space-evenly'}}    
                    >
                        <button onClick={ () => handleSave({userInfo, imageFile}) } className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20'>
                            Save
                        </button>
                        <button onClick={togglePortal} className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'>
                            Cancel
                        </button>
                    </div>
				</main>
                <div className='modal-close' onClick={togglePortal}>&times;</div>
			</article>
        </div>
    )
}

export default Profile;