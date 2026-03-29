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

    public ChainService(ChainRepository chainRepository, GroupRepository groupRepository, BrandRepository brandRepository) {
        this.chainRepository = chainRepository;
        this.groupRepository = groupRepository;
        this.brandRepository = brandRepository;
    }

    public List<ChainResponse> getAllChains() {
        return chainRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ChainResponse> getChainsByGroup(Long groupId) {
        return chainRepository.findAllByIsActiveTrueAndGroup_GroupId(groupId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ChainResponse getChainById(Long id) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
        return toResponse(chain);
    }

    public ChainResponse addChain(ChainRequest req) {
        if (chainRepository.existsByGstnNo(req.getGstnNo().trim())) {
            throw new RuntimeException("GSTN number already exists");
        }
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(req.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Chain chain = new Chain();
        chain.setCompanyName(req.getCompanyName().trim());
        chain.setGstnNo(req.getGstnNo().trim().toUpperCase());
        chain.setGroup(group);
        chain.setIsActive(true);
        return toResponse(chainRepository.save(chain));
    }

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

    public long getTotalChains() {
        return chainRepository.countByIsActiveTrue();
    }

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