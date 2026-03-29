package com.codeb.ims.service;

import com.codeb.ims.dto.BrandRequest;
import com.codeb.ims.dto.BrandResponse;
import com.codeb.ims.entity.Brand;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.repository.BrandRepository;
import com.codeb.ims.repository.ChainRepository;
import com.codeb.ims.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    private final BrandRepository brandRepository;
    private final ChainRepository chainRepository;
    private final ZoneRepository zoneRepository;

    public BrandService(BrandRepository brandRepository, ChainRepository chainRepository, ZoneRepository zoneRepository) {
        this.brandRepository = brandRepository;
        this.chainRepository = chainRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BrandResponse> getBrandsByChain(Long chainId) {
        return brandRepository.findAllByIsActiveTrueAndChain_ChainId(chainId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BrandResponse> getBrandsByGroup(Long groupId) {
        return brandRepository.findAllByIsActiveTrueAndChain_Group_GroupId(groupId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return toResponse(brand);
    }

    public BrandResponse addBrand(BrandRequest req) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Brand brand = new Brand();
        brand.setBrandName(req.getBrandName().trim());
        brand.setChain(chain);
        brand.setIsActive(true);
        return toResponse(brandRepository.save(brand));
    }

    public BrandResponse updateBrand(Long id, BrandRequest req) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        brand.setBrandName(req.getBrandName().trim());
        brand.setChain(chain);
        return toResponse(brandRepository.save(brand));
    }

    public String deleteBrand(Long id) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        if (zoneRepository.existsByBrand_BrandIdAndIsActiveTrue(id)) {
            throw new RuntimeException("Cannot delete: This brand has active zones linked to it");
        }
        brand.setIsActive(false);
        brandRepository.save(brand);
        return "Brand deactivated successfully";
    }

    public long getTotalBrands() {
        return brandRepository.countByIsActiveTrue();
    }

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