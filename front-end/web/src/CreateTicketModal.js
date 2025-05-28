import React, {useState} from 'react';

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
            console.log("Sending to backend:", {
                ticketTitle: ticketTitle,
                ticketDescription: ticketDescription,
            });
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
                const data = await response.json(); // converts response from backend JSON to JS object and holds Ticket object
                alert(`Ticket #${data.ticketNo} created!`);
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
        <div style= {{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            zIndex: 1000,
            opacity: .95,
        }}>
            <h2>Create Ticket</h2>
            <p style= {{
                marginBottom: '1px'
            }}>Ticket Title</p>
            <input type="text"
                value={ticketTitle}
                onChange={(e) => {setTicketTitle(e.target.value)}}
                placeholder="Ticket Title"
                required
                style = {{
                    marginTop: '0px'
                }}
            />
            <br />
            <p style = {{
                marginBottom: '1px'
            }}>Ticket Description</p>
            <textarea
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Describe your issue..."
                required
                style = {{
                    marginTop: '10px'
                }}
            />
            <br />
            <button 
                type="submit" 
                onClick={handleCreateTicket}
                disabled={!ticketDescription || !ticketTitle}>
            Submit Ticket
            </button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default CreateTicketModal;