package com.ecohub.dailychallenges.dto;

import com.ecohub.dailychallenges.entity.ChallengeCategory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyChallengeRequestDto {
	private String title;
    private String description;
    private ChallengeCategory category;
    private int rewardCoinValue;
    private Boolean isActive;
}
