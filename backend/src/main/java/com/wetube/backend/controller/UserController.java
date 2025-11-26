package com.wetube.backend.controller;

import com.wetube.backend.model.User;
import com.wetube.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
//Thao tác full với mã. (CHỈNH SAU)
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //READ ALL(Lấy tất cả Users) GET /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //CREATE(Thêm mới một User) POST /api/users
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)//Trả về HTTP 201 Created khi thành công
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    //READ ONE(Lấy User theo ID) GET /api/users/{id}
    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy User với ID: " + id));
    }

    //UPDATE(Cập nhật User theo ID) PUT /api/users/{id}
    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User userDetails) {

        //Tìm User cũ trong DB
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy User để cập nhật với ID: " + id));

        //Cập nhật thông tin (Chỉ cập nhật username và email)
        //Không được đổi ID
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());

        //Lưu+trả về User đã cập nhật
        return userRepository.save(user);
    }

    //DELETE(Xóa User theo ID) DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Trả về HTTP 204 No Content khi xóa thành công
    public void deleteUser(@PathVariable String id) {
        //Kiểm tra xem User có tồn tại không trước khi xóa
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy User để xóa với ID: " + id);
        }
        userRepository.deleteById(id);
    }
}