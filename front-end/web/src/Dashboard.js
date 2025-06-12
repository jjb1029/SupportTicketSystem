// The Dashboard of the ticket system.
// The Dashboard will showcase tickets, their descriptions, who's working on them, who initiated them, etc.
import CreateTicketModal from "./CreateTicketModal";
import TicketDetailsModal from "./TicketDetailsModal";
import "./Dashboard.css";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentTab, setCurrentTab] = useState('open');

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

  const fetchOpenTickets = async() => {
    console.log("attempting to fetch tickets...");
    console.log("Token: " + localStorage.getItem('token'));
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

  const fetchMyTickets = async() => {
    console.log("attempting to fetch your tickets, " + localStorage.getItem('username'));
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/user/${localStorage.getItem('username')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

    if(!response.ok) {
      throw new Error("Failed to fetch your tickets");
    }

    const data = await response.json();
    setTickets(data);
    } catch(error) {
      console.log("Error fetching your tickets: " + error);
    };
  };

  const fetchAllTickets = async() => {
    console.log("attempting to fetch tickets...");
    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
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
/*
  useEffect(() => {
    fetchTickets();
  }, []);
*/

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const ticketStatus = (ticket) => {
    if(ticket.ticketStatus === "IN_PROGRESS")
      ticket.ticketStatus = "IN PROGRESS";
  }

    return (
        <div>
            <h1> Welcome to your dashboard</h1>
            <button onClick={() => setShowCreateModal(true)}>Create Ticket</button>
            {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} onTicketCreated={fetchOpenTickets} />}
            <div className="dashboard-ticket-container">
                <div className="tabs-container">
                  <div className={`tab ${currentTab === 'open' ? 'active' : ''}`} 
                    onClick={() => {
                      setCurrentTab('open');
                      fetchOpenTickets();
                    }}
                  > Open
                  </div>
                  <div className={`tab ${currentTab === 'my' ? 'active' : ''}`} 
                    onClick={() => {
                      setCurrentTab('my');
                      fetchMyTickets();
                    }}
                  > My Tickets
                  </div>
                  <div className={`tab ${currentTab === 'all' ? 'active' : ''}`} 
                    onClick={() => {
                      setCurrentTab('all')
                      fetchAllTickets();
                    }}
                  >All Tickets
                  </div>
                </div>
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket #</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Created by</th>
                            <th>Assigned to</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            ticketStatus(ticket),
                            <tr key={ticket.ticketNo} onClick={() => handleTicketClick(ticket)}>
                                <td>{ticket.ticketNo}</td>
                                <td>{ticket.ticketTitle}</td>
                                <td>{ticket.ticketStatus}</td>
                                <td>{new Date(ticket.timeCreated).toLocaleString()}</td>
                                <td>{ticket.ticketCreator.username}</td>
                                <td>{ticket.ticketHandler?.username || "Unassigned"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedTicket && (
                  <TicketDetailsModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onTicketUpdate={fetchOpenTickets}
                  />
                )}
            </div>
          </div>
    );
}

export default Dashboard;