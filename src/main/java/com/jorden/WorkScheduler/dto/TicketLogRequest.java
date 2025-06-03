package com.jorden.WorkScheduler.dto;

public class TicketLogRequest {

	String username;
	String message;
	
	public TicketLogRequest() {
		
	}
	
	public TicketLogRequest(String username, String message) {
		this.username = username;
		this.message = message;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
