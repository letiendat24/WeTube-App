package com.wetube.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;

    // Constructors
    public User() {}

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // Getters và Setters
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
}
