import React from 'react';

const CreateTicketModal = ({onClose}) => {
    return (
        <div style= {{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            zIndex: 1000,
        }}>
            <h2>Create Ticket</h2>
            <p>This is a placeholder modal</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default CreateTicketModal;