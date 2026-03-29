package com.codeb.ims.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ZoneResponse {
    private Long zoneId;
    private String zoneName;
    private Long brandId;
    private String brandName;
    private String companyName;
    private String groupName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}