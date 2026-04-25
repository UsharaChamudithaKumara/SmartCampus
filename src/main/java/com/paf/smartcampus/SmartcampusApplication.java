package com.paf.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Smart Campus Operations Hub application.
 * This class initializes the Spring Boot application context and starts the server.
 * 
 * @author PAF Development Team
 * @version 1.0
 */
@SpringBootApplication
public class SmartcampusApplication {

	/**
	 * Main method that serves as the entry point for the application.
	 * 
	 * @param args command line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(SmartcampusApplication.class, args);
	}

}
