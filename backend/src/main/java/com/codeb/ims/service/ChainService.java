package com.codeb.ims.service;

import com.codeb.ims.dto.ChainRequest;
import com.codeb.ims.dto.ChainResponse;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.entity.Group;
import com.codeb.ims.repository.ChainRepository;
import com.codeb.ims.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChainService {

    private final ChainRepository chainRepository;
    private final GroupRepository groupRepository;

    // Get all active chains
    public List<ChainResponse> getAllChains() {
        return chainRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get chains filtered by group
    public List<ChainResponse> getChainsByGroup(Long groupId) {
        return chainRepository.findAllByIsActiveTrueAndGroup_GroupId(groupId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get single chain
    public ChainResponse getChainById(Long id) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
        return toResponse(chain);
    }

    // Add new chain
    public ChainResponse addChain(ChainRequest req) {
        if (chainRepository.existsByGstnNo(req.getGstnNo().trim())) {
            throw new RuntimeException("GSTN number already exists");
        }

        Group group = groupRepository.findByGroupIdAndIsActiveTrue(req.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Chain chain = Chain.builder()
                .companyName(req.getCompanyName().trim())
                .gstnNo(req.getGstnNo().trim().toUpperCase())
                .group(group)
                .isActive(true)
                .build();

        return toResponse(chainRepository.save(chain));
    }

    // Update chain
    public ChainResponse updateChain(Long id, ChainRequest req) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        if (chainRepository.existsByGstnNoAndChainIdNot(req.getGstnNo().trim(), id)) {
            throw new RuntimeException("GSTN number already exists");
        }

        Group group = groupRepository.findByGroupIdAndIsActiveTrue(req.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        chain.setCompanyName(req.getCompanyName().trim());
        chain.setGstnNo(req.getGstnNo().trim().toUpperCase());
        chain.setGroup(group);

        return toResponse(chainRepository.save(chain));
    }

    // Soft delete — only if not linked to any brand
    public String deleteChain(Long id) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        // TODO: Add brand relationship check in Module 4
        // For now allow deletion if chain exists and is active
        chain.setIsActive(false);
        chainRepository.save(chain);
        return "Chain deactivated successfully";
    }

    // Total active chains count
    public long getTotalChains() {
        return chainRepository.countByIsActiveTrue();
    }

    // Helper
    private ChainResponse toResponse(Chain chain) {
        return ChainResponse.builder()
                .chainId(chain.getChainId())
                .companyName(chain.getCompanyName())
                .gstnNo(chain.getGstnNo())
                .groupId(chain.getGroup().getGroupId())
                .groupName(chain.getGroup().getGroupName())
                .isActive(chain.getIsActive())
                .createdAt(chain.getCreatedAt())
                .updatedAt(chain.getUpdatedAt())
                .build();
    }
}