import React, {useState, useEffect} from 'react';

const TicketDetailsModal = ({ ticket, onClose, onTicketUpdate}) => {
    const[logMessage, setLogMessage] = useState('');
    const[isSubmitting, setIsSubmitting] = useState(false);
    const[logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogsForTicket();
    }, [ticket.ticketNo]); // dependency array -> run when ticket.ticketNo changes

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
    };

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