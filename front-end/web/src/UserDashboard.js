// User view of the dashboard
// Users will only be able to view their tickets, and anything associated with their tickets from unassigned to completed

import CreateTicketModal from './CreateTicketModal';
import TicketDetailsModal from './TicketDetailsModal';
import React, {useEffect, useState, useRef} from "react";
import {AnimatePresence, motion} from 'framer-motion';
import "./Dashboard.css";
import SkeletonCard from "./SkeletonCard.js";
import "./Skeleton.css";

function UserDashboard() {
    const [tickets, setTickets] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [counts, setCounts] = useState({ALL: 0, OPEN: 0, IN_PROGRESS: 0, CLOSED: 0});
    const [sortOption, setSortOption] = useState('Ticket Number');
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "false");
    const username = localStorage.getItem('username');

    const fetchMyTickets = async() => {
        const loadStart = Date.now();
        setIsLoading(true);
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
            const loadDuration = Date.now() - loadStart;
            const minimumLoadTime = 500;

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

    const formatStatus = (status) => {
        return status === "IN_PROGRESS" ? "IN PROGRESS" : status;
    }

    const filteredTickets = tickets.filter((ticket) => {
        if(statusFilter === 'ALL') {
            return true;
        }

        return ticket.ticketStatus === statusFilter;
    });

    let sortedTickets = [...filteredTickets];

    if(sortOption === 'Ticket Number') {
        sortedTickets.sort((a, b) => a.ticketNo - b.ticketNo);
    } else if (sortOption === 'Newest') {
        sortedTickets.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
    } else if (sortOption === 'Oldest') {
        sortedTickets.sort((a, b) => new Date(a.timeCreated) - new Date(b.timeCreated));
    } else if (sortOption === 'Tech A-Z') {
        sortedTickets.sort((a, b) => {
            const techA = a.ticketHandler?.username || '';
            const techB = b.ticketHandler?.username || '';
            return techA.localeCompare(techB);
        });
    } else if (sortOption === 'Tech Z-A') {
        sortedTickets.sort((a, b) => {
            const techA = a.ticketHandler?.username || '';
            const techB = b.ticketHandler?.username || '';
            return techB.localeCompare(techA);
        });
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());

        document.body.classList.toggle("dark-mode", newMode);
    }

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'; // login
    }

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo">🎟️ Ticket System</div>
                    <button className="create-ticket-button" onClick={() => setShowCreateModal(true)}>+ Create Ticket</button>
                </div>

                <div className="header-center">
                    <span className="welcome-message">Hello, {username}</span>
                </div>

                <div className="header-right" style={{ position: "relative" }}>
                    <div className="hamburger" onClick={toggleMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={toggleDarkMode}>
                                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            </button>
                            <button onClick={handleLogout}>🚪 Logout</button>
                        </div>
                    )}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {showCreateModal && (
                    <CreateTicketModal onClose={() => setShowCreateModal(false)} onTicketCreated={fetchMyTickets} />
                )}
            </AnimatePresence>

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

                    <div className="sort-container">
                        <label htmlFor="sortOption">Sort by:</label>
                        <select
                            className="sort-option-active"
                            id="sortOption"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option className="sort-option" value="Ticket Number">Ticket Number</option>
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="Tech A-Z">Tech A-Z</option>
                            <option value="Tech Z-A">Tech Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="ticket-card-grid">
                {isLoading ? (
                    [...Array(6)].map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))
                ) : sortedTickets.length === 0 ? (
                    <div className="empty-state">
                        <p> ✨ No tickets to show right now. Time to relax! ✨ </p>
                    </div>
                ) : (
                    sortedTickets.map(ticket => (
                        <motion.div
                            key={ticket.ticketNo}
                            className="ticket-card"
                            whileHover={{ scale: 1.02 }}
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
            
            <AnimatePresence
                mode="wait"
                onExitComplete={() => setSelectedTicket(null)}
            >
                {selectedTicket && (
                    <TicketDetailsModal
                        ticket={selectedTicket}
                        onClose={() => setSelectedTicket(null)}
                        onTicketUpdate={fetchMyTickets}
                    />
                )}
            </AnimatePresence>
        </div>
    );
/*
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
    )*/
}

export default UserDashboard;