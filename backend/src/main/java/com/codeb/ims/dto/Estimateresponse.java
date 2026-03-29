package com.codeb.ims.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class EstimateResponse {
    private Long estimatedId;
    private Long chainId;
    private String companyName;
    private String groupName;
    private String brandName;
    private String zoneName;
    private String service;
    private Integer qty;
    private Float costPerUnit;
    private Float totalCost;
    private LocalDate deliveryDate;
    private String deliveryDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}