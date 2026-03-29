package com.codeb.ims.service;

import com.codeb.ims.dto.ZoneRequest;
import com.codeb.ims.dto.ZoneResponse;
import com.codeb.ims.entity.Brand;
import com.codeb.ims.entity.Zone;
import com.codeb.ims.repository.BrandRepository;
import com.codeb.ims.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final BrandRepository brandRepository;

    // Get all active zones
    public List<ZoneResponse> getAllZones() {
        return zoneRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Filter by brand
    public List<ZoneResponse> getZonesByBrand(Long brandId) {
        return zoneRepository.findAllByIsActiveTrueAndBrand_BrandId(brandId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Filter by company/chain
    public List<ZoneResponse> getZonesByChain(Long chainId) {
        return zoneRepository.findAllByIsActiveTrueAndBrand_Chain_ChainId(chainId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Filter by group
    public List<ZoneResponse> getZonesByGroup(Long groupId) {
        return zoneRepository.findAllByIsActiveTrueAndBrand_Chain_Group_GroupId(groupId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get single zone
    public ZoneResponse getZoneById(Long id) {
        Zone zone = zoneRepository.findByZoneIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));
        return toResponse(zone);
    }

    // Add new zone
    public ZoneResponse addZone(ZoneRequest req) {
        if (req.getZoneName().trim().isEmpty()) {
            throw new RuntimeException("Zone name is required");
        }

        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(req.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Zone zone = Zone.builder()
                .zoneName(req.getZoneName().trim())
                .brand(brand)
                .isActive(true)
                .build();

        return toResponse(zoneRepository.save(zone));
    }

    // Update zone
    public ZoneResponse updateZone(Long id, ZoneRequest req) {
        Zone zone = zoneRepository.findByZoneIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        Brand brand = brandRepository.findByBrandIdAndIsActiveTrue(req.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        zone.setZoneName(req.getZoneName().trim());
        zone.setBrand(brand);

        return toResponse(zoneRepository.save(zone));
    }

    // Soft delete
    public String deleteZone(Long id) {
        Zone zone = zoneRepository.findByZoneIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        zone.setIsActive(false);
        zoneRepository.save(zone);
        return "Zone deactivated successfully";
    }

    // Total count
    public long getTotalZones() {
        return zoneRepository.countByIsActiveTrue();
    }

    // Helper
    private ZoneResponse toResponse(Zone zone) {
        return ZoneResponse.builder()
                .zoneId(zone.getZoneId())
                .zoneName(zone.getZoneName())
                .brandId(zone.getBrand().getBrandId())
                .brandName(zone.getBrand().getBrandName())
                .companyName(zone.getBrand().getChain().getCompanyName())
                .groupName(zone.getBrand().getChain().getGroup().getGroupName())
                .isActive(zone.getIsActive())
                .createdAt(zone.getCreatedAt())
                .updatedAt(zone.getUpdatedAt())
                .build();
    }
}