package com.ecohub.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecohub.shop.entity.Product;

public interface ShopRepository extends JpaRepository<Product, Long> {

}
