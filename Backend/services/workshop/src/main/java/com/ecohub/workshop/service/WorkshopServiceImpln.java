package com.ecohub.workshop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecohub.workshop.dto.WorkshopRequestDto;
import com.ecohub.workshop.dto.WorkshopResponseDto;
import com.ecohub.workshop.entity.Workshop;
//import com.ecohub.workshop.repository.WorkshopRepository;
import com.ecohub.workshop.repository.workshopRepository;

@Service   // 🔴 VERY IMPORTANT
public class WorkshopServiceImpln implements WorkshopService {

    private final workshopRepository repository;

    public WorkshopServiceImpln(workshopRepository repository) {
        this.repository = repository;
    }

    // ================= CREATE =================
    @Override
    public WorkshopResponseDto create(
            WorkshopRequestDto dto,
            Long userId,
            boolean isAdmin
    ) {
        Workshop workshop = new Workshop();

        workshop.setTitle(dto.getTitle());
        workshop.setDescription(dto.getDescription());
        workshop.setWorkshopDateTime(dto.getWorkshopDateTime());
        workshop.setMode(dto.getMode());
        workshop.setLocation(dto.getLocation());
        workshop.setRewardCoinValue(dto.getRewardCoinValue());

        Workshop savedWorkshop = repository.save(workshop);

        return new WorkshopResponseDto(savedWorkshop);
    }

    // ================= READ ALL =================
    @Override
    public List<WorkshopResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(WorkshopResponseDto::new)
                .toList();
    }

    // ================= READ BY ID =================
    @Override
    public WorkshopResponseDto getById(Long id) {
        Workshop workshop = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workshop not found"));

        return new WorkshopResponseDto(workshop);
    }

    // ================= UPDATE =================
    @Override
    public WorkshopResponseDto update(
            Long id,
            WorkshopRequestDto dto,
            boolean isAdmin
    ) {
        Workshop workshop = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workshop not found"));

        workshop.setTitle(dto.getTitle());
        workshop.setDescription(dto.getDescription());
        workshop.setWorkshopDateTime(dto.getWorkshopDateTime());
        workshop.setMode(dto.getMode());
        workshop.setLocation(dto.getLocation());
        workshop.setRewardCoinValue(dto.getRewardCoinValue());

        Workshop updatedWorkshop = repository.save(workshop);

        return new WorkshopResponseDto(updatedWorkshop);
    }

    // ================= DELETE =================
    @Override
    public void delete(Long id, boolean isAdmin) {
        repository.deleteById(id);
    }
}
