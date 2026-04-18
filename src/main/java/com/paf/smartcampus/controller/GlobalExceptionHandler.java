package com.paf.smartcampus.controller;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public String handleValidation(MethodArgumentNotValidException ex) {
        return ex.getBindingResult()
                 .getFieldError()
                 .getDefaultMessage();
    }

    // Handle general errors
    @ExceptionHandler(Exception.class)
    public String handleGeneral(Exception ex) {
        return "❌ Error: " + ex.getMessage();
    }
}