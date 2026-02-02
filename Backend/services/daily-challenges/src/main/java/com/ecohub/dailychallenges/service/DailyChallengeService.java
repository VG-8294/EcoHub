package com.ecohub.dailychallenges.service;

import java.util.List;

import com.ecohub.dailychallenges.dto.DailyChallengeRequestDto;
import com.ecohub.dailychallenges.dto.DailyChallengeResponseDto;

public interface DailyChallengeService {

    DailyChallengeResponseDto create(DailyChallengeRequestDto dto);

    List<DailyChallengeResponseDto> getAll();

    DailyChallengeResponseDto getById(Long id);

    DailyChallengeResponseDto update(Long id, DailyChallengeRequestDto dto);

    void delete(Long id);
}
