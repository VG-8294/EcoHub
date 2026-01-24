package com.ecohub.dailychallenges.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecohub.dailychallenges.entity.DailyChallenges;

public interface DailyChallengeRepository extends JpaRepository<DailyChallenges, Long > {

}
