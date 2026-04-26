package com.paf.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = System.getProperty("user.dir") + "/uploads/";
        // Ensure path uses forward slashes and starts with file:///
        String location = "file:" + uploadPath.replace("\\", "/");
        if (!location.endsWith("/")) location += "/";
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
