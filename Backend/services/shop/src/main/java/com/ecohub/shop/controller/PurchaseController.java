package com.ecohub.shop.controller;

import org.springframework.web.bind.annotation.*;

import com.ecohub.shop.service.PurchaseService;

@RestController	
@RequestMapping("/api/purchase")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/{productId}")
    public void purchase(
            @PathVariable Long productId,
            @RequestParam Long userId
    ) {
        purchaseService.purchaseProduct(productId, userId);
    }
}
