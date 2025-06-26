import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import "./TicketDetailsModal.js"

const EditTicketSection = ({ticket, onClose, onTicketUpdate}) => {
    const [title, setTitle] = useState(ticket.ticketTitle);
    const [description, setDescription] = useState(ticket.ticketDescription);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const userIsCreator = ticket.ticketCreator.username === localStorage.getItem('username');
    const userIsTech = localStorage.getItem('role') === 'tech';

    useEffect(() => {
        setTitle(ticket.ticketTitle);
        setDescription(ticket.ticketDescription);
    }, [ticket]); 

    const handleSaveChanges = async() => {
        try {
            setIsSaving(true);
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
            const updatedTicket = {...ticket, ticketTitle: title, ticketDescription: description}
            onTicketUpdate(updatedTicket);
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
            onClose();
        } catch (err) {
            console.error("Error updating ticket: ", err);
        }
    };

    return (
        <>
            <p>New Title: </p>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <p>New Description: </p>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
                className={`save-button ${saveSuccess ? 'success' : ''}`}
                onClick={handleSaveChanges}
            >
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved! ✅' : 'Save'}
            </motion.button>
            <button onClick={onClose}>Cancel</button>
        </>
    );
}

export default EditTicketSection;