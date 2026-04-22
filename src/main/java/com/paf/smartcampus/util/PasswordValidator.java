package com.paf.smartcampus.util;

import java.util.regex.Pattern;

public class PasswordValidator {
    
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])"        // At least one lowercase letter
      + "(?=.*[A-Z])"         // At least one uppercase letter
      + "(?=.*\\d)"           // At least one digit
      + "(?=.*[@$!%*?&])"     // At least one special character
      + ".{8,}$";             // At least 8 characters
    
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
    
    public static boolean isStrong(String password) {
        if (password == null) return false;
        return pattern.matcher(password).matches();
    }
    
    public static String getPasswordRequirements() {
        return "Password must have at least 8 characters, " +
               "include uppercase, lowercase, a digit, and a special character (@$!%*?&)";
    }
}
