package com.codeb.ims.service;

import com.codeb.ims.dto.EstimateRequest;
import com.codeb.ims.dto.EstimateResponse;
import com.codeb.ims.entity.Chain;
import com.codeb.ims.entity.Estimate;
import com.codeb.ims.repository.ChainRepository;
import com.codeb.ims.repository.EstimateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final ChainRepository chainRepository;

    // Get all estimates
    public List<EstimateResponse> getAllEstimates() {
        return estimateRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get single estimate
    public EstimateResponse getEstimateById(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));
        return toResponse(estimate);
    }

    // Create estimate — auto calculate total cost
    public EstimateResponse createEstimate(EstimateRequest req) {
        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        float totalCost = req.getQty() * req.getCostPerUnit();

        Estimate estimate = Estimate.builder()
                .chain(chain)
                .groupName(req.getGroupName().trim())
                .brandName(req.getBrandName().trim())
                .zoneName(req.getZoneName().trim())
                .service(req.getService().trim())
                .qty(req.getQty())
                .costPerUnit(req.getCostPerUnit())
                .totalCost(totalCost)
                .deliveryDate(req.getDeliveryDate())
                .deliveryDetails(req.getDeliveryDetails())
                .build();

        return toResponse(estimateRepository.save(estimate));
    }

    // Update estimate
    public EstimateResponse updateEstimate(Long id, EstimateRequest req) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        Chain chain = chainRepository.findByChainIdAndIsActiveTrue(req.getChainId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        float totalCost = req.getQty() * req.getCostPerUnit();

        estimate.setChain(chain);
        estimate.setGroupName(req.getGroupName().trim());
        estimate.setBrandName(req.getBrandName().trim());
        estimate.setZoneName(req.getZoneName().trim());
        estimate.setService(req.getService().trim());
        estimate.setQty(req.getQty());
        estimate.setCostPerUnit(req.getCostPerUnit());
        estimate.setTotalCost(totalCost);
        estimate.setDeliveryDate(req.getDeliveryDate());
        estimate.setDeliveryDetails(req.getDeliveryDetails());

        return toResponse(estimateRepository.save(estimate));
    }

    // Delete estimate
    public String deleteEstimate(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));
        estimateRepository.delete(estimate);
        return "Estimate deleted successfully";
    }

    // Total count
    public long getTotalEstimates() {
        return estimateRepository.count();
    }

    // Helper
    private EstimateResponse toResponse(Estimate e) {
        return EstimateResponse.builder()
                .estimatedId(e.getEstimatedId())
                .chainId(e.getChain().getChainId())
                .companyName(e.getChain().getCompanyName())
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