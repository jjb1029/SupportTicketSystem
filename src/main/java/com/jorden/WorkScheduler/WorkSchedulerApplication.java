package com.jorden.WorkScheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WorkSchedulerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkSchedulerApplication.class, args);
		
/*		
		User user1 = new User("Jorden", "Burchick", "jordenburchick@gmail.com", "technician", "jburch");
		User user2 = new User("Mike", "Harper", "m.harper@gmail.com", "other", "mharp");
		System.out.println(user1);
		System.out.println(user2);
		String ticketDescription = "Monitor keeps flashing on and off randomly.";
		
		Ticket ticket1 = new Ticket(12, ticketDescription, user2, user1);
		System.out.println(ticket1.toString());
		System.out.println(ticket1.getTicketHandler());
*/
		

	}

}
