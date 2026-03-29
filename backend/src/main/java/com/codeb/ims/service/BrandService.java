package com.codeb.ims.service;

import com.codeb.ims.dto.BrandRequest;
import com.codeb.ims.dto.BrandResponse;
import com.codeb.ims.entity.Brand;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.repository.BrandRepository;
import com.codeb.ims.repository.ChainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;
    private final ChainRepository chainRepository;

    // Get all active brands
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Filter by chain/company
    public List<BrandResponse> getBrandsByChain(Long chainId) {
        return brandRepository.findAllByIsActiveTrueAndChain_ChainId(chainId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Filter by group
    public List<BrandResponse> getBrandsByGroup(Long groupId) {
        return brandRepository.findAllByIsActiveTrueAndChain_Group_GroupId(groupId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get single brand
    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return toResponse(brand);
    }

    // Add new brand
    public BrandResponse addBrand(BrandRequest req) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Brand brand = Brand.builder()
                .brandName(req.getBrandName().trim())
                .chain(chain)
                .isActive(true)
                .build();

        return toResponse(brandRepository.save(brand));
    }

    // Update brand
    public BrandResponse updateBrand(Long id, BrandRequest req) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        brand.setBrandName(req.getBrandName().trim());
        brand.setChain(chain);

        return toResponse(brandRepository.save(brand));
    }

    // Soft delete — only if not linked to any zone (SubZone check in Module 5)
    public String deleteBrand(Long id) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // TODO: Add zone relationship check in Module 5
        brand.setIsActive(false);
        brandRepository.save(brand);
        return "Brand deactivated successfully";
    }

    // Total count
    public long getTotalBrands() {
        return brandRepository.countByIsActiveTrue();
    }

    // Helper
    private BrandResponse toResponse(Brand brand) {
        return BrandResponse.builder()
                .brandId(brand.getBrandId())
                .brandName(brand.getBrandName())
                .chainId(brand.getChain().getChainId())
                .companyName(brand.getChain().getCompanyName())
                .groupName(brand.getChain().getGroup().getGroupName())
                .isActive(brand.getIsActive())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .build();
    }
}