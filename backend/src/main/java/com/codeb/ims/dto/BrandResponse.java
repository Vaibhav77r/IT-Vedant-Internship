package com.codeb.ims.dto;

import java.time.LocalDateTime;

public class BrandResponse {
    private Long brandId; private String brandName; private Long chainId;
    private String companyName; private String groupName; private Boolean isActive;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long brandId; private String brandName; private Long chainId;
        private String companyName; private String groupName; private Boolean isActive;
        private LocalDateTime createdAt; private LocalDateTime updatedAt;
        public Builder brandId(Long v) { brandId=v; return this; }
        public Builder brandName(String v) { brandName=v; return this; }
        public Builder chainId(Long v) { chainId=v; return this; }
        public Builder companyName(String v) { companyName=v; return this; }
        public Builder groupName(String v) { groupName=v; return this; }
        public Builder isActive(Boolean v) { isActive=v; return this; }
        public Builder createdAt(LocalDateTime v) { createdAt=v; return this; }
        public Builder updatedAt(LocalDateTime v) { updatedAt=v; return this; }
        public BrandResponse build() {
            BrandResponse r = new BrandResponse();
            r.brandId=brandId; r.brandName=brandName; r.chainId=chainId;
            r.companyName=companyName; r.groupName=groupName; r.isActive=isActive;
            r.createdAt=createdAt; r.updatedAt=updatedAt; return r;
        }
    }
    public Long getBrandId() { return brandId; }
    public String getBrandName() { return brandName; }
    public Long getChainId() { return chainId; }
    public String getCompanyName() { return companyName; }
    public String getGroupName() { return groupName; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}