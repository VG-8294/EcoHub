package com.ecohub.rewardwallet.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="reward_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardTransaction {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // CREDIT / DEBIT

    private int amount;

    private String source; 
    // DAILY_CHALLENGE, CARBON_FOOTPRINT, WORKSHOP, REDEEM

    private String description;

    private LocalDateTime createdAt;
}
