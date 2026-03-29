package com.codeb.ims.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EstimateRequest {

    @NotNull(message = "Chain/Company is required")
    private Long chainId;

    @NotBlank(message = "Group name is required")
    private String groupName;

    @NotBlank(message = "Brand name is required")
    private String brandName;

    @NotBlank(message = "Zone name is required")
    private String zoneName;

    @NotBlank(message = "Service details are required")
    private String service;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer qty;

    @NotNull(message = "Cost per unit is required")
    @Min(value = 0, message = "Cost must be positive")
    private Float costPerUnit;

    @NotNull(message = "Delivery date is required")
    private LocalDate deliveryDate;

    private String deliveryDetails;
}