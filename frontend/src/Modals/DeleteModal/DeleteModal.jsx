import React, { useState } from 'react';
import axios from 'axios';
import './DeleteModal.css';

const DeleteModal = ({ closeModal, user }) => {
    const [error, setError] = useState('');
    const handleDelete = () => {
        axios.post('http://localhost:5000/delete-user', { phoneNumber: user.phoneNumber })
            .then(response => {
                if (response.data.message == 'User Deleted') {
                    setError('');
                    closeModal();
                } else {
                    setError(response.data.message);
                }
            }).catch(err => {
                setError(err);
            });
    }
    
    return (
        <div>
            <div>
                <h2>Delete Patient</h2>
                <button onClick={closeModal}>&times;</button>
            </div>
            <div>
                <p className='deleteHeader'>Are you sure you want to delete user ?</p>
                <div className='deleteButtons'>
                    <button onClick={() => handleDelete()}>YES</button>
                    <button className='safe' onClick={closeModal}>NO</button>
                </div>
                <div>{error}</div>
            </div>
        </div>
    );
}

export default DeleteModal;