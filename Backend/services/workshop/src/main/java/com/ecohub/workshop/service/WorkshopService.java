package com.ecohub.workshop.service;

import java.util.List;

import com.ecohub.workshop.dto.WorkshopRequestDto;
import com.ecohub.workshop.dto.WorkshopResponseDto;

public interface WorkshopService {

    WorkshopResponseDto create(WorkshopRequestDto dto);

    List<WorkshopResponseDto> getAll();

    WorkshopResponseDto getById(Long id);

    WorkshopResponseDto update(Long id, WorkshopRequestDto dto);

    void delete(Long id);
}
