package com.codeb.ims.service;

import com.codeb.ims.dto.EstimateRequest;
import com.codeb.ims.dto.EstimateResponse;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.entity.Estimate;
import com.codeb.ims.repository.ChainRepository;
import com.codeb.ims.repository.EstimateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final ChainRepository chainRepository;

    public EstimateService(EstimateRepository estimateRepository,
                           ChainRepository chainRepository) {
        this.estimateRepository = estimateRepository;
        this.chainRepository = chainRepository;
    }

    // ================= GET ALL =================
    public List<EstimateResponse> getAllEstimates() {
        return estimateRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public EstimateResponse getEstimateById(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));
        return toResponse(estimate);
    }

    // ================= CREATE =================
    public EstimateResponse createEstimate(EstimateRequest req) {

        if (req.getChainId() == null) {
            throw new RuntimeException("Chain ID is required");
        }

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (req.getQty() == null || req.getCostPerUnit() == null) {
            throw new RuntimeException("Quantity and cost are required");
        }

        float totalCost = req.getQty() * req.getCostPerUnit();

        Estimate estimate = new Estimate();
        estimate.setChain(chain);

        // ✅ SAFE STRINGS
        estimate.setGroupName(req.getGroupName() != null ? req.getGroupName().trim() : "");
        estimate.setBrandName(req.getBrandName() != null ? req.getBrandName().trim() : "");
        estimate.setZoneName(req.getZoneName() != null ? req.getZoneName().trim() : "");
        estimate.setService(req.getService() != null ? req.getService().trim() : "");

        estimate.setQty(req.getQty());
        estimate.setCostPerUnit(req.getCostPerUnit());
        estimate.setTotalCost(totalCost);
        estimate.setDeliveryDate(req.getDeliveryDate());
        estimate.setDeliveryDetails(req.getDeliveryDetails());

        return toResponse(estimateRepository.save(estimate));
    }

    // ================= UPDATE =================
    public EstimateResponse updateEstimate(Long id, EstimateRequest req) {

        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        if (req.getChainId() == null) {
            throw new RuntimeException("Chain ID is required");
        }

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (req.getQty() == null || req.getCostPerUnit() == null) {
            throw new RuntimeException("Quantity and cost are required");
        }

        float totalCost = req.getQty() * req.getCostPerUnit();

        estimate.setChain(chain);

        estimate.setGroupName(req.getGroupName() != null ? req.getGroupName().trim() : estimate.getGroupName());
        estimate.setBrandName(req.getBrandName() != null ? req.getBrandName().trim() : estimate.getBrandName());
        estimate.setZoneName(req.getZoneName() != null ? req.getZoneName().trim() : estimate.getZoneName());
        estimate.setService(req.getService() != null ? req.getService().trim() : estimate.getService());

        estimate.setQty(req.getQty());
        estimate.setCostPerUnit(req.getCostPerUnit());
        estimate.setTotalCost(totalCost);
        estimate.setDeliveryDate(req.getDeliveryDate());
        estimate.setDeliveryDetails(req.getDeliveryDetails());

        return toResponse(estimateRepository.save(estimate));
    }

    // ================= DELETE =================
    public String deleteEstimate(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        estimateRepository.delete(estimate);
        return "Estimate deleted successfully";
    }

    // ================= COUNT =================
    public long getTotalEstimates() {
        return estimateRepository.count();
    }

    // ================= SAFE RESPONSE =================
    private EstimateResponse toResponse(Estimate e) {

        Chain chain = e.getChain();

        return EstimateResponse.builder()
                .estimatedId(e.getEstimatedId())

                // ✅ SAFE CHAIN
                .chainId(chain != null ? chain.getChainId() : null)
                .companyName(chain != null ? chain.getCompanyName() : "N/A")

                .groupName(e.getGroupName())
                .brandName(e.getBrandName())
                .zoneName(e.getZoneName())
                .service(e.getService())

                .qty(e.getQty())
                .costPerUnit(e.getCostPerUnit())
                .totalCost(e.getTotalCost())

                .deliveryDate(e.getDeliveryDate())
                .deliveryDetails(e.getDeliveryDetails())

                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}