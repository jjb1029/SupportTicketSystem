import React, {useState} from 'react';

const TicketDetailsModal = ({ ticket, onClose, onTicketUpdate}) => {
    // see if we have token
    const token = localStorage.getItem('token');

    if(!token) {
        alert('You must be logged in to view tickets.');
        return;
    }

    const handleAcceptTicket = async(e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');

        // check for ticket in local storage
        const token = localStorage.getItem('token');

        if(!token) {
            alert("You need to be logged in to accept a ticket.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticket.ticketNo}/assign`, {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify({username})
            });
            
            // conflict response - comes from accepting an already assigned ticket
            if(response.status === 409) {
                alert("Ticket is already assigned.");
                throw new Error("Cannot reassign ticket.");
            }

            // good response
            if(!response.ok) {
                throw new Error("Failed to assign ticket.");
            }

            alert(`Ticket #${ticket.ticketNo} has been assigned to ${username}`);
            onTicketUpdate();
            onClose();
        } catch(error) {
            console.log("Error: " + error);
            //alert("An error occured while assigning ticket.");
        }
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
            <p>Ticket Description:</p>
            <p style={{
                border: '2px groove black',
                padding: '6px 10px',
            }}>{ticket.ticketDescription}</p>

            <button onClick={handleAcceptTicket}>Accept Ticket</button>
            <button onClick={onClose}>Close</button>
        </div>
        </>
    );
}

export default TicketDetailsModal;