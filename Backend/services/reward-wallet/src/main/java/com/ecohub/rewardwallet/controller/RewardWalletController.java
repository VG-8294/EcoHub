package com.ecohub.rewardwallet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecohub.rewardwallet.dto.WalletAmountRequestDto;
import com.ecohub.rewardwallet.dto.WalletResponseDto;
import com.ecohub.rewardwallet.service.WalletService;

@RestController
// @RequestMapping("/wallet") - Removed to allow API Gateway to map straight to
// methods
public class RewardWalletController {

    private final WalletService walletService;

    public RewardWalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<WalletResponseDto> createWallet(
            @PathVariable Long userId) {
        return ResponseEntity.ok(walletService.createWallet(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<WalletResponseDto> getWallet(
            @PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getWallet(userId));
    }

    @PostMapping("/{userId}/credit")
    public ResponseEntity<WalletResponseDto> credit(
            @PathVariable Long userId,
            @RequestBody WalletAmountRequestDto dto) {
        return ResponseEntity.ok(
                walletService.credit(userId, dto.getAmount()));
    }

    @PostMapping("/{userId}/debit")
    public ResponseEntity<WalletResponseDto> debit(
            @PathVariable Long userId,
            @RequestBody WalletAmountRequestDto dto) {
        return ResponseEntity.ok(
                walletService.debit(userId, dto.getAmount()));

    }

}
