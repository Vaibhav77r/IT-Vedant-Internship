package com.codeb.ims.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class BrandResponse {
    private Long brandId;
    private String brandName;
    private Long chainId;
    private String companyName;
    private String groupName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}