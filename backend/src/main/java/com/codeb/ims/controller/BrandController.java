package com.codeb.ims.controller;

import com.codeb.ims.dto.BrandRequest;
import com.codeb.ims.dto.BrandResponse;
import com.codeb.ims.service.BrandService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @GetMapping("/filter/chain")
    public ResponseEntity<List<BrandResponse>> filterByChain(@RequestParam Long chainId) {
        return ResponseEntity.ok(brandService.getBrandsByChain(chainId));
    }

    @GetMapping("/filter/group")
    public ResponseEntity<List<BrandResponse>> filterByGroup(@RequestParam Long groupId) {
        return ResponseEntity.ok(brandService.getBrandsByGroup(groupId));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", brandService.getTotalBrands()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getBrand(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    @PostMapping
    public ResponseEntity<BrandResponse> addBrand(@RequestBody BrandRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brandService.addBrand(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponse> updateBrand(@PathVariable Long id, @RequestBody BrandRequest request) {
        return ResponseEntity.ok(brandService.updateBrand(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBrand(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", brandService.deleteBrand(id)));
    }
}