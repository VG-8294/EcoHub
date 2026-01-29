package com.ecohub.rewardwallet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecohub.rewardwallet.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
}
