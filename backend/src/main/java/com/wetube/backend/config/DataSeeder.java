package com.wetube.backend.config;

import com.wetube.backend.model.User;
import com.wetube.backend.model.Video;
import com.wetube.backend.repository.UserRepository;
import com.wetube.backend.repository.VideoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner init(UserRepository userRepo, VideoRepository videoRepo) {
        return args -> {
            if (userRepo.count() == 0) {
                userRepo.save(new User("admin", "admin@wetube.com"));
                userRepo.save(new User("duyet","duyet@example.com"));
            }
            if (videoRepo.count() == 0) {
                videoRepo.save(new Video("Intro to WeTube", "Demo video", "https://example.com/video1"));
                videoRepo.save(new Video("Spring Boot guide", "Spring Boot tutorial", "https://example.com/video2"));
            }

        };
    }
}
