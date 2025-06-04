package com.jorden.WorkScheduler.web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jorden.WorkScheduler.Ticket;
import com.jorden.WorkScheduler.TicketLog;
import com.jorden.WorkScheduler.User;
import com.jorden.WorkScheduler.dto.TicketLogRequest;
import com.jorden.WorkScheduler.repository.TicketLogRepository;
import com.jorden.WorkScheduler.repository.TicketRepository;
import com.jorden.WorkScheduler.repository.UserRepository;

@RestController
@RequestMapping("/api/ticketlogs")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketLogController {

	@Autowired
	TicketLogRepository ticketLogRepository;
	
	@Autowired
	TicketRepository ticketRepository;
	
	@Autowired
	UserRepository userRepository;
	
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
	public ResponseEntity<?> addTicketLog(@PathVariable long ticketId, @RequestBody TicketLogRequest request) {
		String username = request.getUsername();
		String message = request.getMessage();
		
		Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
		Optional<User> userOpt = userRepository.findByUsername(username);
		
		if(ticketOpt.isEmpty() || userOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		Ticket ticket = ticketOpt.get();
		User user = userOpt.get();
		
		TicketLog ticketLog = new TicketLog(ticket, user, message);
		
		ticketLogRepository.save(ticketLog);
		
		return ResponseEntity.ok(ticketLog);
	}
}
