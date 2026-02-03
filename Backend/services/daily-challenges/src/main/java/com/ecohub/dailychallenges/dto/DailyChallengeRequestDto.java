package com.ecohub.dailychallenges.dto;

import com.ecohub.dailychallenges.entity.ChallengeCategory;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyChallengeRequestDto {
	@NotBlank(message = "Title cannot be blank")
	private String title;
	
	@NotBlank(message = "Description cannot be blank")
	@Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
	private String description;
	
	@NotNull(message = "Category cannot be null")
	private ChallengeCategory category;
	
	@NotNull(message = "Reward coin value cannot be null")
	@Positive(message = "Reward coin value must be positive")
	private Integer rewardCoinValue;
	
	private Boolean isActive = true;
}
