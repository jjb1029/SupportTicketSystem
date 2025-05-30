package com.jorden.WorkScheduler;

import java.time.LocalDateTime;
import java.util.Optional;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
public class Ticket {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int ticketNo;
	@Enumerated(EnumType.STRING)
	private TicketStatus ticketStatus; // open, in progress, closed
	@Column(name = "ticket_description")
	private String ticketDescription; // text
	@Column(name = "ticket_title")
	private String ticketTitle; // short summary
	@ManyToOne(optional=false)
	private User ticketCreator; // creator of the ticket
	@ManyToOne
	private User ticketHandler; // tech handling ticket
	
	@CreationTimestamp
	@Column(name = "time_created")
	private LocalDateTime timeCreated;
	
	public Ticket() {
		
	}
	
	public Ticket(String ticketTitle, String ticketDescription, User ticketCreator) {
		this.ticketTitle = ticketTitle;
		this.ticketStatus = TicketStatus.OPEN; // once a ticket is created, it can only be open
		this.ticketDescription = ticketDescription;
		this.ticketCreator = ticketCreator;
	}
	
	public int getTicketNo() {
		return ticketNo;
	}

	public TicketStatus getTicketStatus() {
		return ticketStatus;
	}

	public void setTicketStatus(TicketStatus ticketStatus) {
		this.ticketStatus = ticketStatus;
	}
	
	public String getTicketTitle() {
		return this.ticketTitle;
	}
	
	public void setTicketTitle(String ticketTitle) {
		this.ticketTitle = ticketTitle;
	}

	public String getTicketDescription() {
		return ticketDescription;
	}

	public void setTicketDescription(String ticketDescription) {
		this.ticketDescription = ticketDescription;
	}

	public User getTicketCreator() {
		return ticketCreator;
	}

	public void setTicketCreator(User ticketCreator) {
		this.ticketCreator = ticketCreator;
	}

	public User getTicketHandler() {
		return this.ticketHandler;
	}

	public void setTicketHandler(User ticketHandler) {
		this.ticketHandler = ticketHandler;
	}
	
	public enum TicketStatus {
		OPEN, IN_PROGRESS, CLOSED
	}
	
	public void setTimeCreated(LocalDateTime time) {
		this.timeCreated = time;
	}
	
	public LocalDateTime getTimeCreated() {
		return this.timeCreated;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Ticket Number " + ticketNo + 
				"\n" + ticketDescription);
		
		return sb.toString();
	}

}
