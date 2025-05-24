package com.jorden.WorkScheduler.filter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jorden.WorkScheduler.User;
import com.jorden.WorkScheduler.repository.UserRepository;
import com.jorden.WorkScheduler.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		
		System.out.println("Jwtfilter invoked for URI: " + request.getRequestURI());
		
		// authorization header and validate
		final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		System.out.println("Authorization Header: " + header);
		if (!StringUtils.hasText(header) || (StringUtils.hasText(header) && !header.startsWith("Bearer "))) {
			chain.doFilter(request, response);
			return;
		}
		
		
		
		System.out.println("Authorization Header: " + header);
		
		// get token
		final String token = header.split(" ")[1].trim();
		
		// get user identity and set it on the spring security context
		String username = jwtUtil.getUsernameFromToken(token);
		Optional<User> userOptional = userRepo.findByUsername(username);
		User user = userOptional.orElse(null);
				
		// validate token
		if (user == null) {
			System.out.println("No user found for username: " + username);
			chain.doFilter(request, response);
			return;
		}
		
		if (!jwtUtil.validateToken(token, user)) {
			System.out.println("Invalid token for user: " + token);
			chain.doFilter(request, response);
			return;
		}
		
		
		System.out.println("Extracted username from token: " + username);
		
		
		UserDetails userDetails = user;
		UsernamePasswordAuthenticationToken
		authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails == null ? List.of() : userDetails.getAuthorities());
		
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		
		// authentication
		SecurityContextHolder.getContext().setAuthentication(authentication);
		chain.doFilter(request, response);
	}
	
	
}
