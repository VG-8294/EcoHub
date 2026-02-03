package com.ecohub.shop.service;

import java.time.LocalDateTime;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ecohub.shop.dto.WalletAmountRequestDto;
import com.ecohub.shop.entity.Order;
import com.ecohub.shop.entity.Product;
import com.ecohub.shop.repository.OrderRepository;
import com.ecohub.shop.repository.ShopRepository;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final ShopRepository productRepository;
    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public PurchaseServiceImpl(
            ShopRepository productRepository,
            OrderRepository orderRepository,
            RestTemplate restTemplate
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public void purchaseProduct(Long productId, Long userId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WalletAmountRequestDto request = new WalletAmountRequestDto();
        request.setAmount(product.getPrice());

        try {
            restTemplate.postForEntity(
                "http://localhost:8084/wallet/" + userId + "/debit",
                request,
                Void.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Wallet service failed: " + e.getMessage());
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setProductId(productId);
        order.setPricePaid(product.getPrice());
        order.setPurchasedAt(LocalDateTime.now());

        orderRepository.save(order);
    }
}