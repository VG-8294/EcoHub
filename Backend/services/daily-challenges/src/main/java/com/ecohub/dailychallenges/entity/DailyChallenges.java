package com.ecohub.dailychallenges.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

@Entity
@Table(name = "daily_challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyChallenges {
	 
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long challengeId;

	    @NotBlank
	    @Column(nullable = false)
	    private String title;

	    @NotBlank
	    @Size(min = 10, max = 500)
	    private String description;

	    
	    @Enumerated(EnumType.STRING)
	    private ChallengeCategory category;
	    
	    @Column(length = 100)
	    private String userDefinedType;


	    @NotNull
	    @Positive
	    private Integer rewardCoinValue;

	    @NotNull
	    @Column(updatable = false)
	    private Long createdByUserId;

	    private Boolean isCreatedByAdmin = false;

	    private Boolean isActive = true;

	    @CreationTimestamp
	    @Column(updatable = false)
	    private LocalDateTime createdAt;

	    @UpdateTimestamp
	    private LocalDateTime updatedAt;
}
