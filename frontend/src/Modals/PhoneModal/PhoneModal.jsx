import React, { useState } from 'react';
import axios from 'axios';

function PhoneModal({ closeModal, user }) {
    const oldNum = user.phoneNumber;
    const [error, setError] = useState('');
    const [phoneNumberNow, setPhoneNumber] = useState(user.phoneNumber);
    const handleChangePhoneNumber = () => {
        axios.post('https://medicine-reminder-server.onrender.com/edit-phoneno', { newPhoneNum: phoneNumberNow, oldNum: oldNum })
            .then(response => {
                if (response.data.message == 'Phone number updated') {
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
        <div className='modal-container'>
            <div className='modal-header'>
                <h2>Change Phone Number</h2>
                <button onClick={closeModal} className='modal-close-btn'>&times;</button>
            </div>
            <div className='modal-body'>
                <div className='form-group'>
                    <label htmlFor='phoneNumber'>Phone Number:</label>
                    <input
                        type='text'
                        id='phoneNumber'
                        value={phoneNumberNow}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className='deleteButtonsPhone'>
                    <button style={{marginTop: 25, marginLeft: 538}} className='dangerPhone' onClick={() => handleChangePhoneNumber()}>Change Phone Number</button>
                </div>
                <div className='errorTag'>{error}</div>
            </div>
        </div>
    );
}

export default PhoneModal;