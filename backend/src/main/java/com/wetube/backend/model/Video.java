package com.wetube.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "videos")
public class Video {
    @Id
    private String id;
    private String title;
    private String description;
    private String url;
    private int views;

    public Video() {}

    public Video(String title, String description, String url) {
        this.title = title;
        this.description = description;
        this.url = url;
        this.views = 0;
    }

    // getters / setters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getUrl() { return url; }
    public int getViews() { return views; }
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setUrl(String url) { this.url = url; }
    public void setViews(int views) { this.views = views; }
}
