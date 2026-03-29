package com.codeb.ims.controller;

import com.codeb.ims.dto.ZoneRequest;
import com.codeb.ims.dto.ZoneResponse;
import com.codeb.ims.service.ZoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
@RequiredArgsConstructor
public class ZoneController {

    private final ZoneService zoneService;

    // GET /api/zones
    @GetMapping
    public ResponseEntity<List<ZoneResponse>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    // GET /api/zones/filter/brand?brandId=1
    @GetMapping("/filter/brand")
    public ResponseEntity<List<ZoneResponse>> filterByBrand(@RequestParam Long brandId) {
        return ResponseEntity.ok(zoneService.getZonesByBrand(brandId));
    }

    // GET /api/zones/filter/chain?chainId=1
    @GetMapping("/filter/chain")
    public ResponseEntity<List<ZoneResponse>> filterByChain(@RequestParam Long chainId) {
        return ResponseEntity.ok(zoneService.getZonesByChain(chainId));
    }

    // GET /api/zones/filter/group?groupId=1
    @GetMapping("/filter/group")
    public ResponseEntity<List<ZoneResponse>> filterByGroup(@RequestParam Long groupId) {
        return ResponseEntity.ok(zoneService.getZonesByGroup(groupId));
    }

    // GET /api/zones/count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", zoneService.getTotalZones()));
    }

    // GET /api/zones/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ZoneResponse> getZone(@PathVariable Long id) {
        return ResponseEntity.ok(zoneService.getZoneById(id));
    }

    // POST /api/zones
    @PostMapping
    public ResponseEntity<ZoneResponse> addZone(@Valid @RequestBody ZoneRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(zoneService.addZone(request));
    }

    // PUT /api/zones/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ZoneResponse> updateZone(
            @PathVariable Long id,
            @Valid @RequestBody ZoneRequest request) {
        return ResponseEntity.ok(zoneService.updateZone(id, request));
    }

    // DELETE /api/zones/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteZone(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", zoneService.deleteZone(id)));
    }
}