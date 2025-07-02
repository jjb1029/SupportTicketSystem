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
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const fetchMyTickets = async() => {
        const loadStart = Date.now(); // start timer for skeleton card
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/user/${username}`, {
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
    }, []);

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    const filteredTickets = tickets.filter((ticket) => {
        if(statusFilter === 'All') {
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
        </div>
    )
}

export default TechDashboard;