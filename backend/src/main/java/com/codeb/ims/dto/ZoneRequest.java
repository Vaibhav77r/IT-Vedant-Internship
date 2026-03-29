package com.codeb.ims.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ZoneRequest {

    @NotBlank(message = "Zone name is required")
    private String zoneName;

    @NotNull(message = "Brand is required")
    private Long brandId;
}