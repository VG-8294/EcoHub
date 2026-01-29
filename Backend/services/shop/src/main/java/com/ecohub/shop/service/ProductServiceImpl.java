package com.ecohub.shop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecohub.shop.dto.*;
import com.ecohub.shop.entity.Product;
import com.ecohub.shop.repository.ShopRepository;

@Service
public class ProductServiceImpl implements ProductService {

    private final ShopRepository repository;

    public ProductServiceImpl(ShopRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductResponseDto create(ProductRequestDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        return new ProductResponseDto(repository.save(product));
    }

    @Override
    public List<ProductResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(ProductResponseDto::new)
                .toList();
    }

    @Override
    public ProductResponseDto getById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return new ProductResponseDto(product);
    }

    @Override
    public ProductResponseDto update(Long id, ProductRequestDto dto) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        return new ProductResponseDto(repository.save(product));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
