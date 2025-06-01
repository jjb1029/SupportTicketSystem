package com.jorden.WorkScheduler.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jorden.WorkScheduler.Ticket;
import com.jorden.WorkScheduler.TicketLog;

public interface TicketLogRepository extends JpaRepository<TicketLog, Long>{

	List<TicketLog> findByTicket(Ticket ticket);
}
