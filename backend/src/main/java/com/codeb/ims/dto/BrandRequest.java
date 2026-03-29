package com.codeb.ims.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BrandRequest {

    @NotBlank(message = "Brand name is required")
    private String brandName;

    @NotNull(message = "Company (Chain) is required")
    private Long chainId;
}