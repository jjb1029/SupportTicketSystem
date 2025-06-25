import React, {useState} from 'react';

const EditTicketModal = ({ticket, onClose, onTicketUpdate}) => {
    const [title, setTitle] = useState(ticket.ticketTitle);
    const [description, setDescription] = useState(ticket.ticketDescription);
    const userIsCreator = ticket.ticketCreator.username === localStorage.getItem('username');
    const userIsTech = localStorage.getItem('role') === 'tech';

    const handleSaveChanges = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/tickets/${ticket.ticketNo}/update`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ticketTitle: title,
                    ticketDescription: description
                }),
            });

            if(!response.ok) {
                throw new Error("update failed.");
            }
            onClose();
        } catch (err) {
            console.error("Error updating ticket: ", err);
        }
    };

    return (
        <>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </>
    )}