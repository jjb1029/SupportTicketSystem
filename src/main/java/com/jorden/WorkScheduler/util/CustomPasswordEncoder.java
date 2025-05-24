package com.jorden.WorkScheduler.util;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomPasswordEncoder {

	private BCryptPasswordEncoder passwordEncoder;
	
	public CustomPasswordEncoder() {
		this.passwordEncoder = new BCryptPasswordEncoder();
	}
	
	@Bean
	public BCryptPasswordEncoder getPasswordEncoder() {
		return passwordEncoder;
	}
}
