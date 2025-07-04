package com.jorden.WorkScheduler.web;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.pulsar.PulsarProperties.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
		System.out.println("ticket title: " + dto.getTicketTitle());
		
		
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
		System.out.println("Description of ticket: " + dto.getTicketDescription());
		Ticket ticket = new Ticket(dto. getTicketTitle(), dto.getTicketDescription(), creator.get());
		ticketRepository.save(ticket);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
		
	}
	
	@GetMapping("/test")
	public ResponseEntity<?> testEndpoint(Authentication authentication) {
		System.out.println("Authenticated as: " + authentication.getPluginClassName());
		return ResponseEntity.ok("Authenticated");
	}
	
	// GET /api/tickets
	@GetMapping("/status/ALL")
	public List<Ticket> getAllTickets() {
		return ticketRepository.findAll();
		
	}
	
	// get ticket by ID
	@GetMapping("/{id}")
	public Ticket getTicketById(@PathVariable long id) {
		return ticketRepository.findById(id).orElse(null);
	}
	
	// delete ticket by ID
	@PreAuthorize("hasAuthority('tech')")
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
	
	// get tickets that are handled by the user
	@GetMapping("/user/{username}")
	public List<Ticket> getTicketsByUser(@PathVariable String username) {
		Optional<User> user = userRepository.findByUsername(username);
		if(user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
		}
		
		return ticketRepository.findByTicketHandler(user);
	}
	
	// get tickets that are created by a user
	@GetMapping("/user/creator/{username}")
	public List<Ticket> getTicketsCreatedByUser(@PathVariable String username) {
		Optional<User> user = userRepository.findByUsername(username);
		if(user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}
		
		return ticketRepository.findByTicketCreator(user);
	}
	
	// assigning a ticket to a user
	@PutMapping("/{ticketNo}/assign")
	public ResponseEntity<?> assignTicketToUser(@PathVariable Long ticketNo, @RequestBody Map<String, String> body) {
		String username = body.get("username"); // get username from json response
		
		Optional<User> userOpt = userRepository.findByUsername(username);
		Optional<Ticket> ticketOpt = ticketRepository.findById(ticketNo);
		
		if(ticketOpt.get().getTicketHandler() != null)
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Ticket is already assigned.");
		
		if(userOpt.isEmpty() || ticketOpt.isEmpty())
			return ResponseEntity.notFound().build();
		
		Ticket ticket = ticketOpt.get();
		User user = userOpt.get();
		
		ticket.setTicketHandler(user);
		ticket.setTicketStatus(TicketStatus.IN_PROGRESS);
		ticketRepository.save(ticket);
		
		return ResponseEntity.ok("Ticket assigned to " + username);
	}
	
	// updating a ticket
	@PutMapping("/{ticketNo}/update")
	@PreAuthorize("hasRole('tech') or @ticketSecurity.isCreator(authentication, #ticketNo)")
	public ResponseEntity<?> updateTicketDetails(@PathVariable long ticketNo, @RequestBody Ticket updatedTicketData, Principal principal) {
		Ticket ticket = ticketRepository.findById(ticketNo).orElse(null);
		User loggedIn = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		if(ticket == null) {
			return ResponseEntity.notFound().build();
		}
		
		String loggedInUsername = principal.getName();
		
		// extra security. theoretically, a user should not be able to see another users tickets
		if(!ticket.getTicketCreator().getUsername().equals(loggedInUsername) && loggedIn.getRole() != "tech") {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to edit this ticket.");
		}
		
		ticket.setTicketTitle(updatedTicketData.getTicketTitle());
		ticket.setTicketDescription(updatedTicketData.getTicketDescription());
		ticketRepository.save(ticket);
		
		return ResponseEntity.ok(ticket);
	}
}
