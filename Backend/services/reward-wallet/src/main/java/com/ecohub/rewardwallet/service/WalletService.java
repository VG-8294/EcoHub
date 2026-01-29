package com.ecohub.rewardwallet.service;

import com.ecohub.rewardwallet.dto.WalletResponseDto;

public interface WalletService {

    WalletResponseDto createWallet(Long userId);

    WalletResponseDto getWallet(Long userId);

    WalletResponseDto credit(Long userId, int amount);

    WalletResponseDto debit(Long userId, int amount);
}
