package com.codeb.ims.controller;

import com.codeb.ims.dto.ChainRequest;
import com.codeb.ims.dto.ChainResponse;
import com.codeb.ims.service.ChainService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chains")
@RequiredArgsConstructor
public class ChainController {

    private final ChainService chainService;

    // GET /api/chains - all active chains
    @GetMapping
    public ResponseEntity<List<ChainResponse>> getAllChains() {
        return ResponseEntity.ok(chainService.getAllChains());
    }

    // GET /api/chains/filter?groupId=1 - filter by group
    @GetMapping("/filter")
    public ResponseEntity<List<ChainResponse>> getByGroup(@RequestParam Long groupId) {
        return ResponseEntity.ok(chainService.getChainsByGroup(groupId));
    }

    // GET /api/chains/count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getCount() {
        return ResponseEntity.ok(Map.of("total", chainService.getTotalChains()));
    }

    // GET /api/chains/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ChainResponse> getChain(@PathVariable Long id) {
        return ResponseEntity.ok(chainService.getChainById(id));
    }

    // POST /api/chains
    @PostMapping
    public ResponseEntity<ChainResponse> addChain(@Valid @RequestBody ChainRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chainService.addChain(request));
    }

    // PUT /api/chains/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ChainResponse> updateChain(
            @PathVariable Long id,
            @Valid @RequestBody ChainRequest request) {
        return ResponseEntity.ok(chainService.updateChain(id, request));
    }

    // DELETE /api/chains/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteChain(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", chainService.deleteChain(id)));
    }
}