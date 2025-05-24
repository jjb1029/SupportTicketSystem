// The Dashboard of the ticket system.
// The Dashboard will showcase tickets, their descriptions, who's working on them, who initiated them, etc.
import CreateTicketForm from "./CreateTicketForm";
import CreateTicketModal from "./CreateTicketModal";
import "./Dashboard.css";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

    return (
        <div>
            <h1> Welcome to your dashboard</h1>
            <button onClick={() => setShowCreateModal(true)}>Create Ticket</button>
            {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} />}
            <div className="dashboard-ticket-container">
                <h2>Open Tickets</h2>
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket #</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Created by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.ticketNo}>
                                <td>{ticket.ticketNo}</td>
                                <td>{ticket.ticketDescription}</td>
                                <td>{ticket.ticketStatus}</td>
                                <td>{new Date(ticket.timeCreated).toLocaleString()}</td>
                                <td>{ticket.ticketCreator.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;