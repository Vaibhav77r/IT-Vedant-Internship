package com.codeb.ims.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ChainResponse {
    private Long chainId;
    private String companyName;
    private String gstnNo;
    private Long groupId;
    private String groupName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}