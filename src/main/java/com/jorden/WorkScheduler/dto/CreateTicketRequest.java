package com.jorden.WorkScheduler.dto;

public class CreateTicketRequest {

	private String description;
	private String creatorUsername;
	private String handlerUsername;
	
	public CreateTicketRequest() {
		
	}
	
	public CreateTicketRequest(String description, String creatorUsername, String handlerUsername) {
		this.description = description;
		this.creatorUsername = creatorUsername;
		this.handlerUsername = "N/A";
	}
	
	public void setDescription(String desc) {
		this.description = desc;
	}
	
	public String getDescription() {
		return this.description;
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
