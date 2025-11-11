package com.wetube.backend.controller;

import com.wetube.backend.model.Video;
import com.wetube.backend.repository.VideoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoRepository repo;

    public VideoController(VideoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Video> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Video getOne(@PathVariable String id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Video create(@RequestBody Video v) {
        return repo.save(v);
    }

    @PutMapping("/{id}")
    public Video update(@PathVariable String id, @RequestBody Video body) {
        Video v = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        v.setTitle(body.getTitle());
        v.setDescription(body.getDescription());
        v.setUrl(body.getUrl());
        v.setViews(body.getViews());
        return repo.save(v);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        repo.deleteById(id);
    }
}
