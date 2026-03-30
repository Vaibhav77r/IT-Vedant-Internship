package com.codeb.ims.service;

import com.codeb.ims.dto.ZoneRequest;
import com.codeb.ims.dto.ZoneResponse;
import com.codeb.ims.entity.Brand;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.entity.Zone;
import com.codeb.ims.repository.BrandRepository;
import com.codeb.ims.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final BrandRepository brandRepository;

    public ZoneService(ZoneRepository zoneRepository, BrandRepository brandRepository) {
        this.zoneRepository = zoneRepository;
        this.brandRepository = brandRepository;
    }

    // ================= GET ALL =================
    public List<ZoneResponse> getAllZones() {
        return zoneRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= FILTERS =================
    public List<ZoneResponse> getZonesByBrand(Long brandId) {
        return zoneRepository.findAllByIsActiveTrueAndBrand_BrandId(brandId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ZoneResponse> getZonesByChain(Long chainId) {
        return zoneRepository.findAllByIsActiveTrueAndBrand_Chain_ChainId(chainId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ZoneResponse> getZonesByGroup(Long groupId) {
        return zoneRepository.findAllByIsActiveTrueAndBrand_Chain_Group_GroupId(groupId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public ZoneResponse getZoneById(Long id) {
        Zone zone = zoneRepository.findByZoneIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));
        return toResponse(zone);
    }

    // ================= ADD =================
    public ZoneResponse addZone(ZoneRequest req) {

        if (req.getZoneName() == null || req.getZoneName().trim().isEmpty()) {
            throw new RuntimeException("Zone name is required");
        }

        if (req.getBrandId() == null) {
            throw new RuntimeException("Brand ID is required");
        }

        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(req.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Zone zone = new Zone();
        zone.setZoneName(req.getZoneName().trim());
        zone.setBrand(brand);
        zone.setIsActive(true);

        return toResponse(zoneRepository.save(zone));
    }

    // ================= UPDATE =================
    public ZoneResponse updateZone(Long id, ZoneRequest req) {

        Zone zone = zoneRepository.findByZoneIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        if (req.getBrandId() == null) {
            throw new RuntimeException("Brand ID is required");
        }

        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(req.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        zone.setZoneName(req.getZoneName() != null ? req.getZoneName().trim() : zone.getZoneName());
        zone.setBrand(brand);

        return toResponse(zoneRepository.save(zone));
    }

    // ================= DELETE =================
    public String deleteZone(Long id) {
        Zone zone = zoneRepository.findByZoneIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        zone.setIsActive(false);
        zoneRepository.save(zone);

        return "Zone deactivated successfully";
    }

    // ================= COUNT =================
    public long getTotalZones() {
        return zoneRepository.countByIsActiveTrue();
    }

    // ================= SAFE RESPONSE =================
    private ZoneResponse toResponse(Zone zone) {

        Brand brand = zone.getBrand();
        Chain chain = (brand != null) ? brand.getChain() : null;

        return ZoneResponse.builder()
                .zoneId(zone.getZoneId())
                .zoneName(zone.getZoneName())

                // ✅ SAFE BRAND
                .brandId(brand != null ? brand.getBrandId() : null)
                .brandName(brand != null ? brand.getBrandName() : "N/A")

                // ✅ SAFE CHAIN
                .companyName(chain != null ? chain.getCompanyName() : "N/A")

                // ✅ SAFE GROUP
                .groupName(
                        chain != null && chain.getGroup() != null
                                ? chain.getGroup().getGroupName()
                                : "N/A"
                )

                .isActive(zone.getIsActive())
                .createdAt(zone.getCreatedAt())
                .updatedAt(zone.getUpdatedAt())
                .build();
    }
}