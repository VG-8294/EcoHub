package com.ecohub.dailychallenges.dto;

import com.ecohub.dailychallenges.entity.DailyChallenges;

import lombok.Getter;
import lombok.Setter;

import com.ecohub.dailychallenges.entity.ChallengeCategory;

import java.time.LocalDateTime;


@Getter
@Setter
public class DailyChallengeResponseDto {

    private Long challengeId;
    private String title;
    private String description;
    private ChallengeCategory category;
    private String userDefinedType;
    private Integer rewardCoinValue;
    private Boolean isCreatedByAdmin;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // ✅ Constructor for Entity → DTO mapping
    public DailyChallengeResponseDto(DailyChallenges challenge) {
        this.challengeId = challenge.getChallengeId();
        this.title = challenge.getTitle();
        this.description = challenge.getDescription();
        this.category = challenge.getCategory();
        this.userDefinedType = challenge.getUserDefinedType();
        this.rewardCoinValue = challenge.getRewardCoinValue();
        this.isCreatedByAdmin = challenge.getIsCreatedByAdmin();
        this.isActive = challenge.getIsActive();
        this.createdAt = challenge.getCreatedAt();
    }
}
