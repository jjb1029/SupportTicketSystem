package com.jorden.WorkScheduler;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class TicketLog {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;
	
	@ManyToOne
	private Ticket ticket;
	@ManyToOne
	private User author; // author of message
	private String message; // message to add to log
	@Column(name = "timestamp")
	private LocalDateTime timeStamp; // time stamp of log creation
	
	public TicketLog(Ticket ticket, User author, String message) {
		this.ticket = ticket;
		this.author = author;
		this.message = message;
	}
	
	public TicketLog() {
		
	}
	
	@PrePersist
	protected void onCreate() {
		timeStamp = LocalDateTime.now();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Ticket getTicket() {
		return ticket;
	}

	public void setTicket(Ticket ticket) {
		this.ticket = ticket;
	}

	public User getAuthor() {
		return author;
	}

	public void setAuthor(User author) {
		this.author = author;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}
	
	
}
