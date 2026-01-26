package com.ecohub.dailychallenges.controller;

import com.ecohub.dailychallenges.dto.DailyChallengeRequestDto;
import com.ecohub.dailychallenges.dto.DailyChallengeResponseDto;
import com.ecohub.dailychallenges.service.DailyChallengeService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        Long userId = Long.valueOf(auth.getPrincipal().toString());

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(
                service.create(dto, userId, isAdmin)
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
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(
                service.update(id, dto, isAdmin)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChallenge(
            @PathVariable Long id
    ) {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        service.delete(id, isAdmin);

        return ResponseEntity.ok("Daily Challenge deleted successfully");
    }
}
