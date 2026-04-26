package com.paf.smartcampus.controller;

import com.paf.smartcampus.model.Resource;
import com.paf.smartcampus.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources") // Base URL for this module
@CrossOrigin(origins = "*") // Allows your React frontend to connect
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // 1. POST Endpoint: To add a new resource to the catalogue
    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.addResource(resource);
    }

    // 2. GET Endpoint: To retrieve the catalogue (supports search/filtering)
    @GetMapping
    public List<Resource> getAllResources(@RequestParam(value = "type", required = false) String type) {
        if (type != null) {
            return resourceService.getResourcesByType(type);
        }
        return resourceService.getAllResources();
    }

    // 3. PUT Endpoint: To update metadata or status (ACTIVE / OUT_OF_SERVICE)
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable("id") String id, @RequestBody Resource details) {
        Resource updatedResource = resourceService.updateResource(id, details);
        return updatedResource != null ? ResponseEntity.ok(updatedResource) : ResponseEntity.notFound().build();
    }

    // 4. DELETE Endpoint: To remove a resource from the system
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable("id") String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}