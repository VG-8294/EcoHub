package com.ecohub.dailychallenges.controller;

import com.ecohub.dailychallenges.dto.DailyChallengeRequestDto;
import com.ecohub.dailychallenges.dto.DailyChallengeResponseDto;
import com.ecohub.dailychallenges.service.DailyChallengeService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-challenges")
public class DailyChallengeController {

    private final DailyChallengeService service;

    public DailyChallengeController(DailyChallengeService service) {
        this.service = service;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<DailyChallengeResponseDto> createChallenge(
            @Valid @RequestBody DailyChallengeRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.create(dto)
        );
    }

    // ================= READ ALL =================
    @GetMapping
    public ResponseEntity<List<DailyChallengeResponseDto>> getAllChallenges() {
        return ResponseEntity.ok(service.getAll());
    }

    // ================= READ BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<DailyChallengeResponseDto> getChallengeById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<DailyChallengeResponseDto> updateChallenge(
            @PathVariable Long id,
            @Valid @RequestBody DailyChallengeRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.update(id, dto)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChallenge(
            @PathVariable Long id
    ) {
        service.delete(id);
        return ResponseEntity.ok("Daily Challenge deleted successfully");
    }
}
