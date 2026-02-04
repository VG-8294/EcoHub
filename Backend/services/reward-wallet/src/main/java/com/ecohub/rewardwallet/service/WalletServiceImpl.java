package com.ecohub.rewardwallet.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ecohub.rewardwallet.dto.WalletResponseDto;
import com.ecohub.rewardwallet.entity.Wallet;
import com.ecohub.rewardwallet.repository.WalletRepository;

@Service
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;

    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @Override
    public WalletResponseDto createWallet(Long userId) {
        System.out.println("Creating wallet for user: " + userId + " with balance 200");
        Wallet wallet = new Wallet();
        wallet.setUserId(userId);
        wallet.setBalance(200);
        wallet.setUpdatedAt(LocalDateTime.now());

        return new WalletResponseDto(walletRepository.save(wallet));
    }

    @Override
    public WalletResponseDto getWallet(Long userId) {
        Wallet wallet = walletRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        return new WalletResponseDto(wallet);
    }

    @Override
    public WalletResponseDto credit(Long userId, int amount) {
        Wallet wallet = walletRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setBalance(wallet.getBalance() + amount);
        wallet.setUpdatedAt(LocalDateTime.now());

        return new WalletResponseDto(walletRepository.save(wallet));
    }

    @Override
    public WalletResponseDto debit(Long userId, int amount) {
        Wallet wallet = walletRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setUpdatedAt(LocalDateTime.now());

        return new WalletResponseDto(walletRepository.save(wallet));
    }
}
