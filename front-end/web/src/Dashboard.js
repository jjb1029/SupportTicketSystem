// The Dashboard of the ticket system.
// The Dashboard will showcase tickets, their descriptions, who's working on them, who initiated them, etc.
import CreateTicketForm from "./CreateTicketForm";
import CreateTicketModal from "./CreateTicketModal";
import TicketDetailsModal from "./TicketDetailsModal";
import "./Dashboard.css";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets/status/OPEN", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  const fetchTickets = async() => {
    console.log("attempting to fetch tickets...");
    try {
      const response = await fetch('http://localhost:8080/api/tickets/status/OPEN', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if(!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch(error) {
      console.log("Error fetching tickets: " + error);
    };
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

    return (
        <div>
            <h1> Welcome to your dashboard</h1>
            <button onClick={() => setShowCreateModal(true)}>Create Ticket</button>
            {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} onTicketCreated={fetchTickets} />}
            <div className="dashboard-ticket-container">
                <h2>Open Tickets</h2>
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket #</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Created by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.ticketNo} onClick={() => handleTicketClick(ticket)}>
                                <td>{ticket.ticketNo}</td>
                                <td>{ticket.ticketTitle}</td>
                                <td>{ticket.ticketStatus}</td>
                                <td>{new Date(ticket.timeCreated).toLocaleString()}</td>
                                <td>{ticket.ticketCreator.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedTicket && (
                  <TicketDetailsModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                  />
                )}
            </div>
        </div>
    );
}

export default Dashboard;