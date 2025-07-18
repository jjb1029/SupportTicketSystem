import React, {useState, useEffect} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import "./TicketDetailsModal.css";
import { toast } from 'react-toastify';
import EditTicketSection from "./EditTicketSection.js";

const TicketDetailsModal = ({ ticket, onClose, onTicketUpdate}) => {
    const [currentTicket, setCurrentTicket] = useState(ticket);
    const [logMessage, setLogMessage] = useState('');
    const [logs, setLogs] = useState([]);
    const [showEditSection, setShowEditSection] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [acceptSuccess, setAcceptSuccess] = useState(false);
    const [isMarkingDone, setIsMarkingDone] = useState(false); 
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const userIsCreator = ticket.ticketCreator.username === localStorage.getItem('username');
    const userIsTech = localStorage.getItem('role') === 'tech';

    useEffect(() => {
        fetchLogsForTicket();
    }, [ticket.ticketNo]); // dependency array -> run when ticket.ticketNo changes

    // see if we have token/authorization to view tickets
    if(!token) {
        toast.error('You must be logged in to view tickets.');
        return;
    }

    const handleAcceptTicket = async(e) => {
        e.preventDefault();
        setIsAccepting(true); // visual feedback, spinner start

        // check for ticket in local storage
        const token = localStorage.getItem('token');
        if(!token) {
            toast.error("You need to be logged in to accept a ticket.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticket.ticketNo}/assign`, {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                },
            });
            
            // conflict response - comes from accepting an already assigned ticket
            if(response.status === 409) {
                toast.error("Ticket is already assigned.");
                throw new Error("Cannot reassign ticket.");
            }

            // bad response
            if(!response.ok) {
                throw new Error("Failed to assign ticket.");
            }

            // spinner done, show checkmark
            setIsAccepting(false);
            setAcceptSuccess(true);

            // leave checkmark for 1 second
            setTimeout(() => {
                setAcceptSuccess(false)
                onTicketUpdate(); // refresh tickets
                onClose(); // close modal
            }, 2000);
        } catch(error) {
            console.log("Error: " + error.message);
            setIsAccepting(false);
        }
    }

    const handleSubmitLog = async(e) => {
        e.preventDefault();

        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        if(!token) {
            toast.error("You need to be logged in to view ticket.");
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
                toast.success(`Log added to the ticket log.`);
                setLogMessage(''); // clear form
                fetchLogsForTicket();
                onTicketUpdate();
            } else {
                toast.error(`Failed to submit log`);
            }
        } catch(error) {
            console.log('error: ' + error);
            toast.error('An error occured while submitting log');
        }
        finally {
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

    const handleMarkAsCompleted = async () => {
        setIsMarkingDone(true);
        
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticket.ticketNo}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify("CLOSED"),
            });

            if(!response.ok) {
                throw new Error("Failed to update status");
            }

            toast.success(`Ticket #${ticket.ticketNo} marked as completed.`);
            onTicketUpdate();
            onClose();
        } catch (err) {
            toast.error("Error updating ticket status.");
            console.log(err);
        } finally {
            setIsMarkingDone(false);
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
                    <div className="ticket-action-buttons">
                        {((userIsCreator || userIsTech) && (showEditSection === false) && !(isAnimating)) && 
                                ticket.ticketStatus !== 'CLOSED' && (
                            <button onClick={() => setShowEditSection(true)} className="edit-button">Edit</button>
                        )}

                                            
                        {(userIsTech && !ticket.ticketHandler) && (
                            <>
                                {(!isAccepting && !acceptSuccess) && (
                                    <button
                                        className="accept-ticket-button"
                                        onClick={handleAcceptTicket}
                                    >
                                        Accept Ticket
                                    </button>
                                )}

                                {isAccepting && (
                                    <span className="spinner"></span>
                                )}

                                {acceptSuccess && (
                                    <span className="checkmark">✔</span>
                                )}
                            </>
                        )}

                        {(userIsTech && ticket.ticketHandler?.username === username && ticket.ticketStatus !== 'CLOSED') && (
                            <>
                                <button
                                    className="complete-ticket-button"
                                    onClick={handleMarkAsCompleted}
                                    disabled={isMarkingDone}
                                >
                                    {isMarkingDone ? "Updating..." : "Mark as Completed"}
                                </button>
                            </>
                        )}
                            
                    </div>

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