package com.paf.smartcampus.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.core.convert.converter.Converter;

import com.paf.smartcampus.model.Comment;

/**
 * Register custom converters so legacy string comments can be converted to Comment objects.
 */
@Configuration
public class MongoConfig {

    static class StringToCommentConverter implements Converter<String, Comment> {
        @Override
        public Comment convert(String source) {
            Comment c = new Comment();
            c.setId(null);
            c.setAuthorId(null);
            c.setAuthorName(null);
            c.setText(source);
            return c;
        }
    }

    @Bean
    public MongoCustomConversions customConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new StringToCommentConverter());
        return new MongoCustomConversions(converters);
    }
}
