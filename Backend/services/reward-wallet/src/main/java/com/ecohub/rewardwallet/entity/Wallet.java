package com.ecohub.rewardwallet.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name="wallet")
public class Wallet {
	@Id
    private Long userId;   // SAME userId from auth-service

    @Column(nullable = false)
    private int balance;

    private LocalDateTime updatedAt;
}
