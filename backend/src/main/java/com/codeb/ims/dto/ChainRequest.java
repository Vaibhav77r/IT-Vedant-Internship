package com.codeb.ims.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ChainRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "GSTN number is required")
    @Size(min = 15, max = 15, message = "GSTN must be exactly 15 characters")
    private String gstnNo;

    @NotNull(message = "Group is required")
    private Long groupId;
}