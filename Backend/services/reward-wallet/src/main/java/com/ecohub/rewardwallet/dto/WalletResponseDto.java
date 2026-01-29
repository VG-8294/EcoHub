package com.ecohub.rewardwallet.dto;

import com.ecohub.rewardwallet.entity.Wallet;

public class WalletResponseDto {

    private Long userId;
    private int balance;

    public WalletResponseDto(Wallet wallet) {
        this.userId = wallet.getUserId();
        this.balance = wallet.getBalance();
    }

    public Long getUserId() {
        return userId;
    }

    public int getBalance() {
        return balance;
    }
}

