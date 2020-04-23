import React from 'react';
import ReactDOM from 'react-dom';
import './Portal.css'

const Portal = ({ children }) => {
    const modalRoot = document.getElementById('modal-root');
    const el =document.createElement('div');

    React.useEffect( () => {
        modalRoot.appendChild(el);
    }, []);
    React.useEffect( () => {
        return () => modalRoot.removeChild(el);
    });

    return ReactDOM.createPortal(children, el);
}

export default Portal;