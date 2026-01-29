package com.ecohub.rewardwallet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecohub.rewardwallet.entity.RewardTransaction;

public interface RewardTransactionRepository
        extends JpaRepository<RewardTransaction, Long> {

    List<RewardTransaction> findByUserId(Long userId);
}
