package com.wetube.backend.service;

import com.wetube.backend.model.User;
import com.wetube.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    public Optional<User> getById(String id) {
        return repo.findById(id);
    }

    public User create(User user) {
        return repo.save(user);
    }

    public User update(String id, User data) {
        User u = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        u.setUsername(data.getUsername());
        u.setEmail(data.getEmail());
        return repo.save(u);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
