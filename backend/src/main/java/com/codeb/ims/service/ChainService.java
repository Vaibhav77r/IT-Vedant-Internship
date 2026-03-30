package com.codeb.ims.service;

import com.codeb.ims.dto.ChainRequest;
import com.codeb.ims.dto.ChainResponse;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.entity.Group;
import com.codeb.ims.repository.BrandRepository;
import com.codeb.ims.repository.ChainRepository;
import com.codeb.ims.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChainService {

    private final ChainRepository chainRepository;
    private final GroupRepository groupRepository;
    private final BrandRepository brandRepository;

    public ChainService(ChainRepository chainRepository,
                        GroupRepository groupRepository,
                        BrandRepository brandRepository) {
        this.chainRepository = chainRepository;
        this.groupRepository = groupRepository;
        this.brandRepository = brandRepository;
    }

    // ✅ GET ALL CHAINS
    public List<ChainResponse> getAllChains() {
        return chainRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ GET CHAINS BY GROUP
    public List<ChainResponse> getChainsByGroup(Long groupId) {
        return chainRepository.findAllByIsActiveTrueAndGroup_GroupId(groupId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ GET BY ID
    public ChainResponse getChainById(Long id) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
        return toResponse(chain);
    }

    // ✅ ADD CHAIN
    public ChainResponse addChain(ChainRequest req) {

        if (req.getGstnNo() != null &&
                chainRepository.existsByGstnNo(req.getGstnNo().trim().toUpperCase())) {
            throw new RuntimeException("GSTN number already exists");
        }

        Group group = groupRepository.findByGroupIdAndIsActiveTrue(req.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Chain chain = new Chain();
        chain.setCompanyName(req.getCompanyName() != null ? req.getCompanyName().trim() : null);
        chain.setGstnNo(req.getGstnNo() != null ? req.getGstnNo().trim().toUpperCase() : null);
        chain.setGroup(group);
        chain.setIsActive(true);

        return toResponse(chainRepository.save(chain));
    }

    // ✅ UPDATE CHAIN
    public ChainResponse updateChain(Long id, ChainRequest req) {

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        if (req.getGstnNo() != null &&
                chainRepository.existsByGstnNoAndChainIdNot(req.getGstnNo().trim(), id)) {
            throw new RuntimeException("GSTN number already exists");
        }

        Group group = groupRepository.findByGroupIdAndIsActiveTrue(req.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        chain.setCompanyName(req.getCompanyName() != null ? req.getCompanyName().trim() : null);
        chain.setGstnNo(req.getGstnNo() != null ? req.getGstnNo().trim().toUpperCase() : null);
        chain.setGroup(group);

        return toResponse(chainRepository.save(chain));
    }

    // ✅ DELETE (SOFT DELETE)
    public String deleteChain(Long id) {

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        if (brandRepository.existsByChain_ChainIdAndIsActiveTrue(id)) {
            throw new RuntimeException("Cannot delete: This company has active brands linked to it");
        }

        chain.setIsActive(false);
        chainRepository.save(chain);

        return "Chain deactivated successfully";
    }

    // ✅ COUNT
    public long getTotalChains() {
        return chainRepository.countByIsActiveTrue();
    }

    // ✅ SAFE RESPONSE MAPPER (FIXED 🚀)
    private ChainResponse toResponse(Chain chain) {

        return ChainResponse.builder()
                .chainId(chain.getChainId())
                .companyName(chain.getCompanyName())
                .gstnNo(chain.getGstnNo())

                // 🔥 FIX: Null-safe group handling
                .groupId(chain.getGroup() != null ? chain.getGroup().getGroupId() : null)
                .groupName(chain.getGroup() != null ? chain.getGroup().getGroupName() : "N/A")

                .isActive(chain.getIsActive())
                .createdAt(chain.getCreatedAt())
                .updatedAt(chain.getUpdatedAt())
                .build();
    }
}