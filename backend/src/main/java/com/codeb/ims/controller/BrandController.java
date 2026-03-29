package com.codeb.ims.controller;

import com.codeb.ims.dto.BrandRequest;
import com.codeb.ims.dto.BrandResponse;
import com.codeb.ims.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // GET /api/brands
    @GetMapping
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    // GET /api/brands/filter/chain?chainId=1
    @GetMapping("/filter/chain")
    public ResponseEntity<List<BrandResponse>> filterByChain(@RequestParam Long chainId) {
        return ResponseEntity.ok(brandService.getBrandsByChain(chainId));
    }

    // GET /api/brands/filter/group?groupId=1
    @GetMapping("/filter/group")
    public ResponseEntity<List<BrandResponse>> filterByGroup(@RequestParam Long groupId) {
        return ResponseEntity.ok(brandService.getBrandsByGroup(groupId));
    }

    // GET /api/brands/count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", brandService.getTotalBrands()));
    }

    // GET /api/brands/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getBrand(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    // POST /api/brands
    @PostMapping
    public ResponseEntity<BrandResponse> addBrand(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(brandService.addBrand(request));
    }

    // PUT /api/brands/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BrandResponse> updateBrand(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(brandService.updateBrand(id, request));
    }

    // DELETE /api/brands/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBrand(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", brandService.deleteBrand(id)));
    }
}