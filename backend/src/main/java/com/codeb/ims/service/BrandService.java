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

    public BrandService(BrandRepository brandRepository,
                        ChainRepository chainRepository,
                        ZoneRepository zoneRepository) {
        this.brandRepository = brandRepository;
        this.chainRepository = chainRepository;
        this.zoneRepository = zoneRepository;
    }

    // ================= GET ALL =================
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY CHAIN =================
    public List<BrandResponse> getBrandsByChain(Long chainId) {
        return brandRepository.findAllByIsActiveTrueAndChain_ChainId(chainId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY GROUP =================
    public List<BrandResponse> getBrandsByGroup(Long groupId) {
        return brandRepository.findAllByIsActiveTrueAndChain_Group_GroupId(groupId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return toResponse(brand);
    }

    // ================= ADD =================
    public BrandResponse addBrand(BrandRequest req) {

        if (req.getChainId() == null) {
            throw new RuntimeException("Chain ID is required");
        }

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Brand brand = new Brand();
        brand.setBrandName(req.getBrandName() != null ? req.getBrandName().trim() : null);
        brand.setChain(chain);
        brand.setIsActive(true);

        return toResponse(brandRepository.save(brand));
    }

    // ================= UPDATE =================
    public BrandResponse updateBrand(Long id, BrandRequest req) {

        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        if (req.getChainId() == null) {
            throw new RuntimeException("Chain ID is required");
        }

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        brand.setBrandName(req.getBrandName() != null ? req.getBrandName().trim() : null);
        brand.setChain(chain);

        return toResponse(brandRepository.save(brand));
    }

    // ================= DELETE =================
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

    // ================= COUNT =================
    public long getTotalBrands() {
        return brandRepository.countByIsActiveTrue();
    }

    // ================= SAFE RESPONSE =================
    private BrandResponse toResponse(Brand brand) {

        Chain chain = brand.getChain();

        return BrandResponse.builder()
                .brandId(brand.getBrandId())
                .brandName(brand.getBrandName())

                // ✅ SAFE CHAIN
                .chainId(chain != null ? chain.getChainId() : null)

                .companyName(
                        chain != null ? chain.getCompanyName() : "N/A"
                )

                // ✅ SAFE GROUP
                .groupName(
                        chain != null && chain.getGroup() != null
                                ? chain.getGroup().getGroupName()
                                : "N/A"
                )

                .isActive(brand.getIsActive())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .build();
    }
}