// User view of the dashboard
// Users will only be able to view their tickets, and anything associated with their tickets from unassigned to completed

import CreateTicketModal from './CreateTicketModal';
import TicketDetailsModal from './TicketDetailsModal';
import "./Dashboard.css";
import React, {useEffect, useState} from "react";

function UserDashboard() {
    const [tickets, setTickets] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [statusFilter, setStatusFilter] = useState()
    const username = localStorage.getItem('username');

    const fetchMyTickets = async() => {
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/user/creator/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if(!response.ok) {
                throw new Error("Failed to fetch your tickets.");
            }

            const data = await response.json();
            setTickets(data);
        } catch(error) {
            console.log("Error fetching your tickets: " + error);
        };
    };

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const formatStatus = (status) => {
        return status === "IN_PROGRESS" ? "IN PROGRESS" : status;
    }

    const filteredTickets = tickets.filter((ticket) => {
        if(statusFilter === 'All') {
            return true;
        }

        return ticket.ticketStatus === statusFilter;
    });

    return (
        <div>
            <h1>Welcome to your dashboard, {username}</h1>
            <button onClick={() => setShowCreateModal(true)}>Create Ticket</button>
            {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} onTicketCreated={fetchMyTickets} />}
            <div className="dashboard-ticket-container">
                <div className="tabs-container">
                    <div className="tab my">
                        My Tickets 
                    </div>
                    <div className="filter-container">
                        <label htmlFor="statusFilter">Filter by Status: </label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="UNASSIGNED">Unassigned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
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
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.ticketNo} onClick={() => handleTicketClick(ticket)}>
                                <td>{ticket.ticketNo}</td>
                                <td>{ticket.ticketTitle}</td>
                                <td>{formatStatus(ticket.ticketStatus)}</td>
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
                    onTicketUpdate={fetchMyTickets}
                    />
                )}
            </div>
        </div>
    )
}

export default UserDashboard;