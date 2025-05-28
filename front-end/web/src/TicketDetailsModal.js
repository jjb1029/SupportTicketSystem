import React, {useState} from 'react';

const TicketDetailsModal = ({ ticket, onClose }) => {

    // see if we have token
    const token = localStorage.getItem('token');

    if(!token) {
        alert('You must be logged in to view tickets.');
        return;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            zIndex: 1000
        }}>
            <h2>Ticket #{ticket.ticketNo}</h2>

            <button>Accept Ticket</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default TicketDetailsModal;