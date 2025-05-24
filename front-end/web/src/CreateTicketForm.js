import React, {useState} from 'react';

const CreateTicketForm = () => {
    const [ticketDescription, setDescription] = useState(''); // empty state

    // handleSubmit function, async so we may be using await with api calls, e is short for event - triggered when the form is submitted (click "submit")
    const handleSubmit = async (e) => {
        e.preventDefault(); // default is refreshing the page, this stops that behavior and let's us control what happens

        const token = localStorage.getItem('token'); // get token from local storage

        // if we don't find a token, we know they must be logged in
        if(!token) {
            alert("You must be logged in");
            return;
        }

        // if there is a token, try to send a POST request to the backend to create ticket
        try {
            const response = await fetch('http://localhost:8080/api/tickets', {
                method: 'POST', // used to send data to the server
                headers: { // key-value pairs that give server information about the request, important so spring boot knows how to parse the data
                    'Content-Type': 'application/json', // tells the server we're sending data in json format
                    'Authorization': `Bearer ${token}`, // securely sends a token to our back end
                },
                body: JSON.stringify({
                    description: ticketDescription, // contains the actual data, converted to json string
                }),
            });

            // if response worked out - HTTP Status code is ok, we enter
            if(response.ok) {
                const data = await response.json(); // converts response from backend JSON to JS object and holds Ticket object (TicketNo, Description, Status). asynchronous so we wait
                alert(`Ticket #${data.ticketNo} created!`); // alerts user ticket was created, uses ticketNo from object
                setDescription(''); // resets the input box after submission, if we didn't have this, description from last ticket would remain
            } else {
                alert('Failed to create ticket.'); // if response was bad (400, 401, 500), we let user know
            }
        } catch(error) { // any error caught we log and display error message
            console.error('Error:', error);
            alert('An error occurred while creating ticket');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Ticket</h2>
            <textarea
                value={ticketDescription}
                onChange={(e) => setDescription(e.target.value)}
                placeholder = "Describe your issue"
                required
            />
            <br />
            <button type="submit">Submit Ticket</button>
        </form>
    );
};

export default CreateTicketForm;