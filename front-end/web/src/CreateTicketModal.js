import React, {useState} from 'react';
import {motion} from 'framer-motion';
import "./CreateTicketModal.css";

const CreateTicketModal = ({onClose, onTicketCreated}) => {
    const[ticketTitle, setTicketTitle] = useState('');
    const[ticketDescription, setTicketDescription] = useState('')

    const handleCreateTicket = async(e) => {
        e.preventDefault();

        // check for ticket in local storage
        const token = localStorage.getItem('token');

        // if we don't find token, we let them know
        if(!token) {
            alert("You must be logged in to create a ticket.");
            return;
        }

        // if there is a token, try to send a POST request to the backend for ticket creation
        try {
            const response = await fetch('http://localhost:8080/api/tickets', {
                method: 'POST', // used to send data to server
                headers: { // key-value pairs that give server information about the request, important so spring boot knows how to parse the data
                    'Content-type':'application/json', // tells the server we're sending json
                    'Authorization': `Bearer ${token}`, // securely sends a token to our back end
                },
                body: JSON.stringify({
                    ticketTitle: ticketTitle, // contains the actual data, converted to json string
                    ticketDescription: ticketDescription
                }),
            });

            // if response works
            if(response.ok) {
                setTicketTitle(''); // clear form
                setTicketDescription(''); // clear form
                await onTicketCreated();
                onClose();
            } else {
                alert('Failed to create ticket');
            }
        } catch(error) {
            console.log('Error: ' + error);
            alert('An error occured while creating ticket');
        }
    }

    return (
        <div className="create-ticket-overlay">
            <motion.div
                className="create-ticket-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
            >
                <button className="create-close-button" onClick={onClose}>X</button>
                <h2>Create New Ticket</h2>

                <form onSubmit={handleCreateTicket} className="ticket-form">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        required
                        placeholder="Enter ticket title"
                    />

                    <label>Description:</label>
                    <textarea
                        value = {ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        required
                        placeholder="Describe the issue"
                    />

                    <div className="form-buttons">
                        <button type="submit" className="create-submit-button">Submit</button>
                        <button type="button" className="create-cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default CreateTicketModal;