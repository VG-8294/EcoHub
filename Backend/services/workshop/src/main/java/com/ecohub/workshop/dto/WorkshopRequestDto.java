package com.ecohub.workshop.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkshopRequestDto {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private LocalDateTime workshopDateTime;

    @NotBlank
    private String mode;   // ONLINE / OFFLINE

    private String location; // optional (null if ONLINE)

    @NotNull
    @Positive
    private Integer rewardCoinValue;
}
