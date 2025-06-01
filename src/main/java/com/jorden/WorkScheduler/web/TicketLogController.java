package com.jorden.WorkScheduler.web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jorden.WorkScheduler.Ticket;
import com.jorden.WorkScheduler.TicketLog;
import com.jorden.WorkScheduler.repository.TicketLogRepository;
import com.jorden.WorkScheduler.repository.TicketRepository;

@RestController
@RequestMapping("/api/ticketlogs")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketLogController {

	@Autowired
	TicketLogRepository ticketLogRepository;
	
	@Autowired
	TicketRepository ticketRepository;
	
	//get all logs for a ticket
	@GetMapping("/ticket/{ticketId}")
	public List<TicketLog> getLogsForTicket(@PathVariable long ticketId) {
		// look up the passed in ticket id in the repository
		Optional<Ticket> ticket = ticketRepository.findById(ticketId);
		
		// if ticket doesn't exist, return empty list
		if(ticket.isEmpty())
			return List.of();
		
		// if found, return all logs for that ticket
		return ticketLogRepository.findByTicket(ticket.get());
	}
	
	@PostMapping("/ticket/{ticketId}")
	public TicketLog addTicketLog(@PathVariable long ticketId, @RequestBody LogRequest request) {
		
	}
}
