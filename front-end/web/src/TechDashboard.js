// Tech view of the dashboard
// techs will not be able to create tickets, just cause, the cards will have accept ticket and mark as completed?

import TicketDetailsModal from './TicketDetailsModal';
import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import "./Dashboard.css";
import SkeletonCard from "./SkeletonCard.js";
import "./Skeleton.css";

function TechDashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [counts, setCounts] = useState({ALL: 0, OPEN: 0, IN_PROGRESS: 0, CLOSED: 0});
    const [sortOption, setSortOption] = useState('Ticket Number');
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "false");
    const hamburgerRef = useRef();
    const username = localStorage.getItem('username');

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
            const minimumLoadTime = 500;

            // counts of each status of tickets
            setCounts({
                ALL: data.length,
                OPEN: data.filter(ticket => ticket.ticketStatus === 'OPEN').length,
                IN_PROGRESS: data.filter(ticket => ticket.ticketStatus === 'IN_PROGRESS' && ticket.ticketHandler?.username === username).length,
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
        setIsModalVisible(true);
    };

    // helps trigger modal fade out
    const handleCloseModal = () => {
        setIsModalVisible(false);
    }

    const filteredTickets = tickets.filter((ticket) => {
        if(statusFilter === 'ALL') {
            return true;
        }

        if(statusFilter === 'IN_PROGRESS') {
            return ticket.ticketStatus === 'IN_PROGRESS' && ticket.ticketHandler?.username === username;
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
        setMenuOpen(prev => !prev);
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if(hamburgerRef.current && ! hamburgerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        if(menuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [menuOpen]);

    
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());

        document.body.classList.toggle("dark-mode", newMode);
    }

    const handleLogout = () => {
        localStorage.clear();
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

                <div className="header-right" style={{ position: "relative" }} ref={hamburgerRef}>
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
                    > My In Progress <span className="badge">{counts.IN_PROGRESS}</span>
                    </button>
                    <button
                        className={`filter-pill ${statusFilter === 'CLOSED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('CLOSED')}
                    > Closed <span className="badge">{counts.CLOSED}</span>
                    </button>

                    <div className="sort-container">
                        <label htmlFor="sortOption">Sort by:</label>
                        <select
                            id="sortOption"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="Ticket Number">Ticket Number</option>
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
                ) : (
                    sortedTickets.map(ticket => (
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

            <AnimatePresence
                mode="wait"
                onExitComplete={() => setSelectedTicket(null)} // clears ticket after animation
            >
                {isModalVisible && selectedTicket && (
                    <TicketDetailsModal
                        ticket={selectedTicket}
                        onClose={handleCloseModal} // hides modal, the animation will clear ticket
                        onTicketUpdate={() => fetchMyTickets()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default TechDashboard;