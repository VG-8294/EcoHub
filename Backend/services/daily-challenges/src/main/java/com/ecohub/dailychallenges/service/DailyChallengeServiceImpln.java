package com.ecohub.dailychallenges.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ecohub.dailychallenges.dto.DailyChallengeRequestDto;
import com.ecohub.dailychallenges.dto.DailyChallengeResponseDto;
import com.ecohub.dailychallenges.entity.DailyChallenges;
import com.ecohub.dailychallenges.repository.DailyChallengeRepository;

@Service
public class DailyChallengeServiceImpln implements DailyChallengeService {

    private final DailyChallengeRepository repository;

    public DailyChallengeServiceImpln(DailyChallengeRepository repository) {
        this.repository = repository;
    }

    @Override
    public DailyChallengeResponseDto create(DailyChallengeRequestDto dto) {
        DailyChallenges challenge = new DailyChallenges();
        challenge.setTitle(dto.getTitle());
        challenge.setDescription(dto.getDescription());
        challenge.setCategory(dto.getCategory());
        challenge.setRewardCoinValue(dto.getRewardCoinValue());
        challenge.setIsActive(true);

        // Set a default user ID (0L for system/admin creation)
        challenge.setIsCreatedByAdmin(true);
        challenge.setCreatedByUserId(0L);

        challenge.setCreatedAt(LocalDateTime.now());

        return new DailyChallengeResponseDto(repository.save(challenge));
    }

    @Override
    public List<DailyChallengeResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(DailyChallengeResponseDto::new)
                .toList();
    }

    @Override
    public DailyChallengeResponseDto getById(Long id) {
        DailyChallenges challenge = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        return new DailyChallengeResponseDto(challenge);
    }

    @Override
    public DailyChallengeResponseDto update(Long id, DailyChallengeRequestDto dto) {
        DailyChallenges challenge = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        challenge.setTitle(dto.getTitle());
        challenge.setDescription(dto.getDescription());
        challenge.setCategory(dto.getCategory());
        challenge.setRewardCoinValue(dto.getRewardCoinValue());
        challenge.setIsActive(dto.getIsActive());
        challenge.setUpdatedAt(LocalDateTime.now());

        return new DailyChallengeResponseDto(repository.save(challenge));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Challenge not found");
        }
        repository.deleteById(id);
    }
}
