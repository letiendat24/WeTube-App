package com.wetube.backend.service;

import com.wetube.backend.model.Video;
import com.wetube.backend.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VideoService {
    private final VideoRepository repo;

    public VideoService(VideoRepository repo) { this.repo = repo; }

    public List<Video> getAll() { return repo.findAll(); }
    public Optional<Video> getById(String id) { return repo.findById(id); }
    public Video create(Video v) { return repo.save(v); }
    public Video update(String id, Video data) {
        Video v = repo.findById(id).orElseThrow();
        v.setTitle(data.getTitle());
        v.setDescription(data.getDescription());
        v.setUrl(data.getUrl());
        v.setViews(data.getViews());
        return repo.save(v);
    }
    public void delete(String id) { repo.deleteById(id); }
}
