// Tech view of the dashboard
// techs will not be able to create tickets, just cause, the cards will have accept ticket and mark as completed?

import TicketDetailsModal from './TicketDetailsModal';
import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import "./Dashboard.css";
import SkeletonCard from "./SkeletonCard.js";
import "./Skeleton.css";

function TechDashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [counts, setCounts] = useState({ALL: 0, OPEN: 0, IN_PROGRESS: 0, CLOSED: 0});
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const fetchMyTickets = async() => {
        const loadStart = Date.now(); // start timer for skeleton card
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/status/ALL`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if(!response.ok) {
                throw new Error("Failed to fetch your tickets.");
            }

            const data = await response.json();
            const loadDuration = Date.now() - loadStart;
            const minimumLoadTime = 1000;

            // counts of each status of tickets
            setCounts({
                ALL: data.length,
                OPEN: data.filter(ticket => ticket.ticketStatus === 'OPEN').length,
                IN_PROGRESS: data.filter(ticket => ticket.ticketStatus === 'IN_PROGRESS').length,
                CLOSED: data.filter(ticket => ticket.ticketStatus === 'CLOSED').length,
            });

            if(loadDuration < minimumLoadTime) {
                // delay for skeleton cards
                setTimeout(() => {
                    setTickets(data);
                    setIsLoading(false);
                }, minimumLoadTime - loadDuration);
            } else {
                setTickets(data);
                setIsLoading(false);
            }
        } catch(error) {
            console.log("Error fetching your tickets: " + error);
        };
    };

    useEffect(() => {
        fetchMyTickets();
    }, [statusFilter]);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const filteredTickets = tickets.filter((ticket) => {
        if(statusFilter === 'ALL') {
            return true;
        }

        return ticket.ticketStatus === statusFilter;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo">🎟️ Ticket System</div>
                </div>

                <div className="header-center">
                    <span className="welcome-message">Hello, {username}</span>
                </div>

                <div className="header-right">
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className="filter-bar">
                <div className="filter-pill-bar">
                    <button
                        className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('ALL')}
                    > All <span className="badge">{counts.ALL}</span>
                    </button>
                    <button
                        className={`filter-pill ${statusFilter === 'OPEN' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('OPEN')}
                    > Unassigned <span className="badge">{counts.OPEN}</span>
                    </button>
                    <button
                        className={`filter-pill ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('IN_PROGRESS')}
                    > In Progress <span className="badge">{counts.IN_PROGRESS}</span>
                    </button>
                    <button
                        className={`filter-pill ${statusFilter === 'CLOSED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('CLOSED')}
                    > Closed <span className="badge">{counts.CLOSED}</span>
                    </button>
                </div>
            </div>

            <div className="ticket-card-grid">
                {isLoading ? (
                    [...Array(6)].map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))
                ) : (
                    filteredTickets.map(ticket => (
                        <motion.div
                            key={ticket.ticketNo}
                            className="ticket-card"
                            whileHover={{ scale: 1.04 }}
                            onClick={() => handleTicketClick(ticket)}
                        >
                            <div className="ticket-card-header">
                                <h3>{ticket.ticketTitle}</h3>
                                <span className={`status-badge ${ticket.ticketStatus.toLowerCase()}`}>
                                    {ticket.ticketStatus.replace('_', ' ')}
                                </span>
                            </div>
                            <p><strong>Ticket #: </strong> {ticket.ticketNo} </p>
                            <p><strong>Created: </strong> {new Date(ticket.timeCreated).toLocaleString()} </p>
                            <p><strong>Assigned to: </strong> {ticket.ticketHandler?.username || 'Unassigned'} </p>
                        </motion.div>
                    ))
                )}
            </div>

            {selectedTicket && (
                <TicketDetailsModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onTicketUpdate={() => fetchMyTickets()}
                />
            )}
        </div>
    );
}

export default TechDashboard;