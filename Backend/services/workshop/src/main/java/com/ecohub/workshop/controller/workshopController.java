package com.ecohub.workshop.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecohub.workshop.dto.WorkshopRequestDto;
import com.ecohub.workshop.dto.WorkshopResponseDto;
import com.ecohub.workshop.service.WorkshopService;

@RestController
@RequestMapping("/api/workshops")
public class workshopController {

    private final WorkshopService service;

    public workshopController(WorkshopService service) {
        this.service = service;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<WorkshopResponseDto> createWorkshop(
            @Valid @RequestBody WorkshopRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.create(dto)
        );
    }

    // ================= READ ALL =================
    @GetMapping
    public ResponseEntity<List<WorkshopResponseDto>> getAllWorkshops() {
        return ResponseEntity.ok(service.getAll());
    }

    // ================= READ BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponseDto> getWorkshopById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<WorkshopResponseDto> updateWorkshop(
            @PathVariable Long id,
            @Valid @RequestBody WorkshopRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.update(id, dto)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkshop(
            @PathVariable Long id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
