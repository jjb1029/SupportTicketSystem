package com.jorden.WorkScheduler.web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.pulsar.PulsarProperties.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.jorden.WorkScheduler.Ticket;
import com.jorden.WorkScheduler.Ticket.TicketStatus;
import com.jorden.WorkScheduler.dto.CreateTicketRequest;
import com.jorden.WorkScheduler.repository.TicketRepository;
import com.jorden.WorkScheduler.repository.UserRepository;
import com.jorden.WorkScheduler.User;

@RestController // tells spring that this class handles HTTP requests and returns data
@RequestMapping("/api/tickets") // sets base URL path for all endpoints in controller
@CrossOrigin(origins = "http://localhost:3000") // allows port 3000 to talk with Spring (react app is running on port 3000)
public class TicketController {

	@Autowired // Spring will automatically inject(provide) an instance of TicketRepository here
	private TicketRepository ticketRepository;
	@Autowired // Spring will automatically inject an instance of UserRepository here
	private UserRepository userRepository;
	
	/* Our ticket creator prior to using the DTO
	// POST /api/tickets
	@PostMapping
	public Ticket createTicket(@RequestBody CreateTicketRequest ticket) {
		Ticket tick = new Ticket(ticket.getDescription(), , ticket.getHandlerUsername());
		return ticketRepository.save(ticket);
	} */
	// POST /api/tickets
	@PostMapping
	public ResponseEntity<Ticket> createTicket(@RequestBody CreateTicketRequest dto, @AuthenticationPrincipal UserDetails userDetails) {
		
		// debug dto values
		System.out.println("DTO: " + dto);
		System.out.println("creatorUsername: " + dto.getCreatorUsername());
		System.out.println("handlerUsername: " + dto.getHandlerUsername());
		
		
		System.out.println("Attempting to create ticket");
		Optional<User> creator = userRepository.findByUsername(userDetails.getUsername());
		//Optional<User> handler = userRepository.findByUsername(dto.getHandlerUsername());
		System.out.println("Optional<User> creator = " + creator);
		
		// bad request if creator or handler is null
		if(creator.isEmpty()) {
			System.out.println("Bad request.");
			return ResponseEntity.badRequest().build();
		}
		
		// build ticket based on DTO info and save it to the repository
		System.out.println("Description of ticket: " + dto.getDescription());
		Ticket ticket = new Ticket(dto.getDescription(), creator.get());
		ticketRepository.save(ticket);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
		
	}
	
	@GetMapping("/test")
	public ResponseEntity<?> testEndpoint(Authentication authentication) {
		System.out.println("Authenticated as: " + authentication.getPluginClassName());
		return ResponseEntity.ok("Authenticated");
	}
	
	// GET /api/tickets
	@GetMapping
	public List<Ticket> getAllTickets() {
		return ticketRepository.findAll();
	}
	
	// get ticket by ID
	@GetMapping("/{id}")
	public Ticket getTicketById(@PathVariable long id) {
		return ticketRepository.findById(id).orElse(null);
	}
	
	// delete ticket by ID
	@DeleteMapping("/{id}")
	public void deleteTicket(@PathVariable long id) {
		ticketRepository.deleteById(id);
	}
	
	// update ticket status
	@PutMapping("/{id}/status")
	public Ticket updateTicketStatus(@PathVariable long id, @RequestBody TicketStatus newStatus) {
		Ticket ticket = ticketRepository.findById(id).orElse(null);
		if(ticket != null) {
			ticket.setTicketStatus(newStatus);
			return ticketRepository.save(ticket);
		}
		
		return null;
	}
	
	// get tickets with a certain status (open, in progress, closed)
	@GetMapping("/status/{status}")
	public List<Ticket> getTicketsByStatus(@PathVariable TicketStatus status) {
		return ticketRepository.findByTicketStatus(status);
	}
/*	
	// get ticket with a certain ID
	// GET api/tickets/{id}
	@GetMapping("/{id}")
	public ResponseEntity<Ticket> getTickedById(@PathVariable long id) {
		Optional<Ticket> ticket = ticketRepository.findById(id);
		return ticket.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build()); 
	} */
}
