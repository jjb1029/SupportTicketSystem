import React, {useState, useEffect} from 'react';
import "./TicketDetailsModal.css"

const TicketDetailsModal = ({ ticket, onClose, onTicketUpdate}) => {
    const[logMessage, setLogMessage] = useState('');
    const[isSubmitting, setIsSubmitting] = useState(false);
    const[logs, setLogs] = useState([]);
    const[isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(ticket.ticketTitle);
    const [editedDescription, setEditedDescription] = useState(ticket.ticketDescription);
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
    };

    return (
        <div className="ticket-modal-overlay">
            <div className="ticket-modal">
                <button onClick={onClose} className="ticket-close-button">X</button>

                <h2>Ticket #{ticket.ticketNo}</h2>
                <p><strong>Title:</strong> {ticket.ticketTitle}</p>
                <p><strong>Description:</strong> {ticket.ticketDescription}</p>
                <p><strong>Status:</strong> {ticket.ticketStatus}</p>
                <p><strong>Created:</strong> {new Date(ticket.timeCreated).toLocaleString()}</p>
                <p><strong>Created by:</strong> {ticket.ticketCreator?.username}</p>
                <p><strong>Assigned to:</strong> {ticket.ticketHandler?.username || "Unassigned"}</p>
                {(userIsCreator || userIsTech) && (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
                {isEditing ? (
                    <>
                        <input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <button onClick={handleSaveChanges}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h2>{ticket.ticketTitle}</h2>
                        <p>{ticket.ticketDescription}</p>
                    </>
                )}

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
            </div>
        </div>
    );
}

export default TicketDetailsModal;