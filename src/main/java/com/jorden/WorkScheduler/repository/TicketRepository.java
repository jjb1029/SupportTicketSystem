package com.jorden.WorkScheduler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jorden.WorkScheduler.Ticket;
import com.jorden.WorkScheduler.Ticket.TicketStatus;

public interface TicketRepository extends JpaRepository<Ticket, Long>{

	List<Ticket> findByTicketStatus(TicketStatus status);

}
