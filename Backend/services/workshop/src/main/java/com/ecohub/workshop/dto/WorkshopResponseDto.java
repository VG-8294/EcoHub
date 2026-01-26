package com.ecohub.workshop.dto;

import java.time.LocalDateTime;

import com.ecohub.workshop.entity.Workshop;
import lombok.Getter;

@Getter
public class WorkshopResponseDto {

    private Long workshopId;
    private String title;
    private String description;
    private LocalDateTime workshopDateTime;
    private String mode;
    private String location;
    private Integer rewardCoinValue;

    // Convert ENTITY → DTO
    public WorkshopResponseDto(Workshop workshop) {
        this.workshopId = workshop.getWorkshopId();
        this.title = workshop.getTitle();
        this.description = workshop.getDescription();
        this.workshopDateTime = workshop.getWorkshopDateTime();
        this.mode = workshop.getMode();
        this.location = workshop.getLocation();
        this.rewardCoinValue = workshop.getRewardCoinValue();
    }
}
