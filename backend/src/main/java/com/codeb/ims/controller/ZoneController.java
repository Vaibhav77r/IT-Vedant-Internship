package com.codeb.ims.controller;

import com.codeb.ims.dto.ZoneRequest;
import com.codeb.ims.dto.ZoneResponse;
import com.codeb.ims.service.ZoneService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    public ResponseEntity<List<ZoneResponse>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/filter/brand")
    public ResponseEntity<List<ZoneResponse>> filterByBrand(@RequestParam Long brandId) {
        return ResponseEntity.ok(zoneService.getZonesByBrand(brandId));
    }

    @GetMapping("/filter/chain")
    public ResponseEntity<List<ZoneResponse>> filterByChain(@RequestParam Long chainId) {
        return ResponseEntity.ok(zoneService.getZonesByChain(chainId));
    }

    @GetMapping("/filter/group")
    public ResponseEntity<List<ZoneResponse>> filterByGroup(@RequestParam Long groupId) {
        return ResponseEntity.ok(zoneService.getZonesByGroup(groupId));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", zoneService.getTotalZones()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZoneResponse> getZone(@PathVariable Long id) {
        return ResponseEntity.ok(zoneService.getZoneById(id));
    }

    @PostMapping
    public ResponseEntity<ZoneResponse> addZone(@RequestBody ZoneRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(zoneService.addZone(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ZoneResponse> updateZone(@PathVariable Long id, @RequestBody ZoneRequest request) {
        return ResponseEntity.ok(zoneService.updateZone(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteZone(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", zoneService.deleteZone(id)));
    }
}