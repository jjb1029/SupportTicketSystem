package com.jorden.WorkScheduler.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jorden.WorkScheduler.User;
import com.jorden.WorkScheduler.dto.AuthCredentialsRequest;
import com.jorden.WorkScheduler.repository.UserRepository;
import com.jorden.WorkScheduler.util.CustomPasswordEncoder;
import com.jorden.WorkScheduler.util.JwtUtil;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CustomPasswordEncoder cpe;
		
	@Autowired
	private JwtUtil jwtUtil;
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthCredentialsRequest req) {
		try {
			Authentication authenticate = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
			User user = (User) authenticate.getPrincipal();
			
			Map<String, String> responseBody = new HashMap<>();
			responseBody.put("token", jwtUtil.generateToken(user)); // in the response add the JWT
			responseBody.put("username", user.getUsername()); // add username
			responseBody.put("role", user.getRole()); // add role of user
			
			return ResponseEntity.ok(responseBody);
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
		String username = body.get("username");
		String password = body.get("password");
		String role = body.get("role");
		String firstName = body.get("firstName");
		String lastName = body.get("lastName");
		
		if(userRepository.findByUsername(username).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists.");
		}
		
		//User newUser = new User();
		User newUser = new User(firstName, lastName, null, role, username);
		//newUser.setUsername(username);
		System.out.println("Password encoded " + password + " as " + cpe.getPasswordEncoder().encode(password));
		newUser.setPassword(cpe.getPasswordEncoder().encode(password));
		//newUser.setRole(role);
		userRepository.save(newUser);
		
		return ResponseEntity.ok("User created.");
	}
	
}
