package com.ecohub.workshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecohub.workshop.entity.Workshop;

public interface workshopRepository extends JpaRepository<Workshop, Long > {

}
