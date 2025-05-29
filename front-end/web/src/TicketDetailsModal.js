import React, {useState} from 'react';

const TicketDetailsModal = ({ ticket, onClose }) => {

    // see if we have token
    const token = localStorage.getItem('token');

    if(!token) {
        alert('You must be logged in to view tickets.');
        return;
    }

    return (

        <>
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
        }} onClick={onClose} />

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
            <p>{ticket.ticketDescription}</p>

            <button>Accept Ticket</button>
            <button onClick={onClose}>Close</button>
        </div>
        </>
    );
}

export default TicketDetailsModal;