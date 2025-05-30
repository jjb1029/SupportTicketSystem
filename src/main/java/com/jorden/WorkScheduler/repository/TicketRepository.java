package com.jorden.WorkScheduler.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jorden.WorkScheduler.Ticket;
import com.jorden.WorkScheduler.Ticket.TicketStatus;
import com.jorden.WorkScheduler.User;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

	List<Ticket> findByTicketStatus(TicketStatus status);
	List<Ticket> findByTicketCreator(Optional<User> user);

}
