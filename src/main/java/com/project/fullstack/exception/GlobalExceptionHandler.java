package com.project.fullstack.exception;

import com.project.fullstack.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    StringBuilder errors = new StringBuilder();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ");
    }
    ErrorResponse errorResponse = new ErrorResponse(errors.toString(), HttpStatus.BAD_REQUEST);
    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }
}
