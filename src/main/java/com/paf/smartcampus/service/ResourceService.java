package com.paf.smartcampus.service;

import com.paf.smartcampus.model.Resource;
import com.paf.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service // Marks this as a Service component for Spring's component scanning
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    // Logic to add a new resource to the catalogue
    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    // Logic to fetch all resources
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    // Logic for the required search and filtering by type [cite: 26]
    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    // Logic to update an existing resource (e.g., changing status to OUT_OF_SERVICE) 
    public Resource updateResource(String id, Resource resourceDetails) {
        Optional<Resource> optionalResource = resourceRepository.findById(id);
        if (optionalResource.isPresent()) {
            Resource existingResource = optionalResource.get();
            existingResource.setName(resourceDetails.getName());
            existingResource.setType(resourceDetails.getType());
            existingResource.setCapacity(resourceDetails.getCapacity());
            existingResource.setLocation(resourceDetails.getLocation());
            existingResource.setStatus(resourceDetails.getStatus());
            return resourceRepository.save(existingResource);
        }
        return null;
    }

    // Logic to remove a resource from the catalogue
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}