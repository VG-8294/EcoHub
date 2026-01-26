package com.ecohub.workshop.service;

import java.util.List;

import com.ecohub.workshop.dto.WorkshopRequestDto;
import com.ecohub.workshop.dto.WorkshopResponseDto;

public interface WorkshopService {
	WorkshopResponseDto create(
            WorkshopRequestDto dto,
            Long userId,
            boolean isAdmin
    );

    List<WorkshopResponseDto> getAll();

    WorkshopResponseDto getById(Long id);

    WorkshopResponseDto update(
            Long id,
            WorkshopRequestDto dto,
            boolean isAdmin
    );

    void delete(Long id, boolean isAdmin);
}
