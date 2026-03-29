package com.codeb.ims.controller;

import com.codeb.ims.dto.EstimateRequest;
import com.codeb.ims.dto.EstimateResponse;
import com.codeb.ims.service.EstimateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
public class EstimateController {

    private final EstimateService estimateService;

    // GET /api/estimates
    @GetMapping
    public ResponseEntity<List<EstimateResponse>> getAllEstimates() {
        return ResponseEntity.ok(estimateService.getAllEstimates());
    }

    // GET /api/estimates/count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", estimateService.getTotalEstimates()));
    }

    // GET /api/estimates/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EstimateResponse> getEstimate(@PathVariable Long id) {
        return ResponseEntity.ok(estimateService.getEstimateById(id));
    }

    // POST /api/estimates
    @PostMapping
    public ResponseEntity<EstimateResponse> createEstimate(@Valid @RequestBody EstimateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estimateService.createEstimate(request));
    }

    // PUT /api/estimates/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EstimateResponse> updateEstimate(
            @PathVariable Long id,
            @Valid @RequestBody EstimateRequest request) {
        return ResponseEntity.ok(estimateService.updateEstimate(id, request));
    }

    // DELETE /api/estimates/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEstimate(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", estimateService.deleteEstimate(id)));
    }
}