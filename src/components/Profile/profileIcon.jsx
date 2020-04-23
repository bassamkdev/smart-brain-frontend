import React from 'react';
import { 
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem 
} from 'reactstrap';

import './profileIcon.css'

const ProfileIcon = ({ onRouteChange, togglePortal, profilePicture }) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
 
    return(
        <div className='pa2 tc'>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                    tag="span"
                    data-toggle="dropdown"
                    aria-expanded={dropdownOpen}
                >
                    <img
                        src={profilePicture || "http://tachyons.io/img/logo.jpg"}
                        className="br-100 ba h3 w3 dib" alt="avatar"/>
                </DropdownToggle>
                <DropdownMenu 
                    className='b--transparent shadow-5 align-right'
                    style={{marginTop: '10px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}
                >
                    <DropdownItem onClick={togglePortal}>View Profile</DropdownItem>
                    <DropdownItem onClick={() => onRouteChange('signin')}>Sign Out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default ProfileIcon;