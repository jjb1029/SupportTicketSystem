package com.jorden.WorkScheduler.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jorden.WorkScheduler.User;
import com.jorden.WorkScheduler.repository.UserRepository;
import com.jorden.WorkScheduler.util.CustomPasswordEncoder;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Optional<User> optionalUser = userRepo.findByUsername(username);
		User user = optionalUser.orElse(null);
		if(user == null)
			throw new UsernameNotFoundException("Invalid credentials.");
		
		return user;
	}

}
