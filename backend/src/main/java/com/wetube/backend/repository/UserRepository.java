package com.wetube.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.wetube.backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    // Spring Data sẽ tự động cung cấp các phương thức CRUD cơ bản: save, findAll, findById, deleteById, v.v.
}
