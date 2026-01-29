package com.ecohub.shop.service;

import java.util.List;
import com.ecohub.shop.dto.*;

public interface ProductService {

    ProductResponseDto create(ProductRequestDto dto);

    List<ProductResponseDto> getAll();

    ProductResponseDto getById(Long id);

    ProductResponseDto update(Long id, ProductRequestDto dto);

    void delete(Long id);
}
