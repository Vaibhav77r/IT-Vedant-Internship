package com.codeb.ims.controller;

import com.codeb.ims.dto.ChainRequest;
import com.codeb.ims.dto.ChainResponse;
import com.codeb.ims.service.ChainService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chains")
public class ChainController {

    private final ChainService chainService;

    public ChainController(ChainService chainService) {
        this.chainService = chainService;
    }

    @GetMapping
    public ResponseEntity<List<ChainResponse>> getAllChains() {
        return ResponseEntity.ok(chainService.getAllChains());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ChainResponse>> getByGroup(@RequestParam Long groupId) {
        return ResponseEntity.ok(chainService.getChainsByGroup(groupId));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", chainService.getTotalChains()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChainResponse> getChain(@PathVariable Long id) {
        return ResponseEntity.ok(chainService.getChainById(id));
    }

    @PostMapping
    public ResponseEntity<ChainResponse> addChain(@RequestBody ChainRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chainService.addChain(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChainResponse> updateChain(@PathVariable Long id, @RequestBody ChainRequest request) {
        return ResponseEntity.ok(chainService.updateChain(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteChain(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", chainService.deleteChain(id)));
    }
}