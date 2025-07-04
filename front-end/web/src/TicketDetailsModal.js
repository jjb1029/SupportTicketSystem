import React, {useState, useEffect} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import "./TicketDetailsModal.css"
import EditTicketSection from "./EditTicketSection.js"

const TicketDetailsModal = ({ ticket, onClose, onTicketUpdate}) => {
    const [currentTicket, setCurrentTicket] = useState(ticket);
    const [logMessage, setLogMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(ticket.ticketTitle);
    const [editedDescription, setEditedDescription] = useState(ticket.ticketDescription);
    const [showEditSection, setShowEditSection] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const userIsCreator = ticket.ticketCreator.username === localStorage.getItem('username');
    const userIsTech = localStorage.getItem('role') === 'tech';

    useEffect(() => {
        fetchLogsForTicket();
    }, [ticket.ticketNo]); // dependency array -> run when ticket.ticketNo changes

    // see if we have token/authorization to view tickets
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

            // bad response
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

    const handleSubmitLog = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        if(!token) {
            alert("You need to be logged in to view ticket.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/ticketlogs/ticket/${ticket.ticketNo}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    message: logMessage 
                }),
                
            });

            // good response
            if(response.ok) {
                const data = await response.json();
                alert(`Log added to the ticket log.`);
                setLogMessage(''); // clear form
                fetchLogsForTicket();
                onTicketUpdate();
            } else {
                alert(`Failed to submit log`);
            }
        } catch(error) {
            console.log('error: ' + error);
            alert('An error occured while submitting log');
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const fetchLogsForTicket = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/ticketlogs/ticket/${ticket.ticketNo}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // bad response
            if(!response.ok) {
                throw new Error('Failed to fetch logs.');
            }

            const data = await response.json();

            // set logs to store the array of logs in state
            setLogs(data);
        } catch(error) {
            console.error("Error fetching logs: " + error);
        }
    }

    const handleSaveChanges = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/tickets/${ticket.ticketNo}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ticketTitle: editedTitle,
                    ticketDescription: editedDescription
                }),
            });

            if(!response.ok) {
                throw new Error("Update failed.");
            }
            console.log("ticket description: " + editedDescription);
            console.log("ticket title: " + editedTitle);
            setIsEditing(false);
            onTicketUpdate();
            onClose();
        } catch (err) {
            console.error("Error updating ticket: ", err);
        }
    }

    const handleTicketUpdate = (updatedTicket) => {
        setCurrentTicket(updatedTicket); // updates modal with new information from editing
        onTicketUpdate(); // updates list also
    };

    return (
        <motion.div 
            className="ticket-modal-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <AnimatePresence>
                <motion.div 
                    className="ticket-modal"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale:  1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <button onClick={onClose} className="ticket-close-button">X</button>

                    <h2>Ticket #{currentTicket.ticketNo}</h2>
                    <p><strong>Title:</strong> {currentTicket.ticketTitle}</p>
                    <p><strong>Description:</strong> {currentTicket.ticketDescription}</p>
                    <p><strong>Status:</strong> {currentTicket.ticketStatus}</p>
                    <p><strong>Created:</strong> {new Date(currentTicket.timeCreated).toLocaleString()}</p>
                    <p><strong>Created by:</strong> {currentTicket.ticketCreator?.username}</p>
                    <p><strong>Assigned to:</strong> {currentTicket.ticketHandler?.username || "Unassigned"}</p>
                    {((userIsCreator || userIsTech) && (showEditSection === false) && !(isAnimating)) && (
                        <button onClick={() => setShowEditSection(true)} className="edit-button">Edit</button>
                    )}
                    <AnimatePresence>
                        {showEditSection && (
                            <motion.div
                                key="edit-section"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                onAnimationStart={() => setIsAnimating(true)}
                                onAnimationComplete={() => setIsAnimating(false)}
                                className="edit-ticket-section"
                            >
                                <EditTicketSection
                                    key={currentTicket.ticketNo}
                                    ticket={currentTicket}
                                    onClose={() => setShowEditSection(false)}
                                    onTicketUpdate={handleTicketUpdate}
                                />
                                
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <hr style={{ margin: '20px 0'}} />

                    <h3>Add Log</h3>
                    <textarea
                        value={logMessage}
                        onChange={(e) => setLogMessage(e.target.value)}
                        placeholder="Leave a log..."
                        className="ticket-textarea"
                    />
                    <button onClick={handleSubmitLog} className="ticket-submit-button">Submit Log</button>

                    <h3 style={{ marginTop: '20px' }}>Logs</h3>
                    <div className="ticket-logs-container">
                        {logs.length === 0 ? (
                            <p style={{ fontStyle:'italic' }}>No logs yet.</p>
                        ) : (
                            logs.map((log) => (
                            <div key={log.id} className="ticket-log-item">
                                <p><strong>{log.author?.username || 'Unknown'}:</strong> {log.message} </p>
                            </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

export default TicketDetailsModal;