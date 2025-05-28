package com.jorden.WorkScheduler.dto;

public class CreateTicketRequest {

	private String ticketTitle;
	private String ticketDescription;
	private String creatorUsername;
	private String handlerUsername;
	
	public CreateTicketRequest() {
		
	}
	
	public CreateTicketRequest(String title, String description, String creatorUsername, String handlerUsername) {
		this.ticketTitle = title;
		this.ticketDescription = description;
		this.creatorUsername = creatorUsername;
		this.handlerUsername = "N/A";
	}
	
	public void setTicketTitle(String title) {
		this.ticketTitle = title;
	}
	
	public String getTicketTitle() {
		return this.ticketTitle;
	}
	
	public void setTicketDescription(String desc) {
		this.ticketDescription = desc;
	}
	
	public String getTicketDescription() {
		return this.ticketDescription;
	}
	
	public void setCreatorUsername(String username) {
		this.creatorUsername = username;
	}
	
	public String getCreatorUsername() {
		return this.creatorUsername;
	}
	
	public void setHandlerUsername(String username) {
		this.handlerUsername = username;
	}
	
	public String getHandlerUsername() {
		return this.handlerUsername;
	}
}
