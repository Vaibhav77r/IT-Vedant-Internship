package com.codeb.ims.dto;

import java.time.LocalDateTime;

public class ZoneResponse {
    private Long zoneId; private String zoneName; private Long brandId;
    private String brandName; private String companyName; private String groupName;
    private Boolean isActive; private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long zoneId; private String zoneName; private Long brandId;
        private String brandName; private String companyName; private String groupName;
        private Boolean isActive; private LocalDateTime createdAt; private LocalDateTime updatedAt;
        public Builder zoneId(Long v) { zoneId=v; return this; }
        public Builder zoneName(String v) { zoneName=v; return this; }
        public Builder brandId(Long v) { brandId=v; return this; }
        public Builder brandName(String v) { brandName=v; return this; }
        public Builder companyName(String v) { companyName=v; return this; }
        public Builder groupName(String v) { groupName=v; return this; }
        public Builder isActive(Boolean v) { isActive=v; return this; }
        public Builder createdAt(LocalDateTime v) { createdAt=v; return this; }
        public Builder updatedAt(LocalDateTime v) { updatedAt=v; return this; }
        public ZoneResponse build() {
            ZoneResponse r = new ZoneResponse();
            r.zoneId=zoneId; r.zoneName=zoneName; r.brandId=brandId;
            r.brandName=brandName; r.companyName=companyName; r.groupName=groupName;
            r.isActive=isActive; r.createdAt=createdAt; r.updatedAt=updatedAt; return r;
        }
    }
    public Long getZoneId() { return zoneId; }
    public String getZoneName() { return zoneName; }
    public Long getBrandId() { return brandId; }
    public String getBrandName() { return brandName; }
    public String getCompanyName() { return companyName; }
    public String getGroupName() { return groupName; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}