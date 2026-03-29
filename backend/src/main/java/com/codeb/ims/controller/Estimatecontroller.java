package com.codeb.ims.controller;

import com.codeb.ims.dto.EstimateRequest;
import com.codeb.ims.dto.EstimateResponse;
import com.codeb.ims.service.EstimateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estimates")
public class EstimateController {

    private final EstimateService estimateService;

    public EstimateController(EstimateService estimateService) {
        this.estimateService = estimateService;
    }

    @GetMapping
    public ResponseEntity<List<EstimateResponse>> getAllEstimates() {
        return ResponseEntity.ok(estimateService.getAllEstimates());
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", estimateService.getTotalEstimates()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstimateResponse> getEstimate(@PathVariable Long id) {
        return ResponseEntity.ok(estimateService.getEstimateById(id));
    }

    @PostMapping
    public ResponseEntity<EstimateResponse> createEstimate(@RequestBody EstimateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estimateService.createEstimate(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstimateResponse> updateEstimate(@PathVariable Long id, @RequestBody EstimateRequest request) {
        return ResponseEntity.ok(estimateService.updateEstimate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEstimate(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", estimateService.deleteEstimate(id)));
    }
}