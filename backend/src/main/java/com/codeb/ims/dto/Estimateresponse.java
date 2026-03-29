package com.codeb.ims.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EstimateResponse {
    private Long estimatedId; private Long chainId; private String companyName;
    private String groupName; private String brandName; private String zoneName;
    private String service; private Integer qty; private Float costPerUnit;
    private Float totalCost; private LocalDate deliveryDate; private String deliveryDetails;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long estimatedId; private Long chainId; private String companyName;
        private String groupName; private String brandName; private String zoneName;
        private String service; private Integer qty; private Float costPerUnit;
        private Float totalCost; private LocalDate deliveryDate; private String deliveryDetails;
        private LocalDateTime createdAt; private LocalDateTime updatedAt;
        public Builder estimatedId(Long v) { estimatedId=v; return this; }
        public Builder chainId(Long v) { chainId=v; return this; }
        public Builder companyName(String v) { companyName=v; return this; }
        public Builder groupName(String v) { groupName=v; return this; }
        public Builder brandName(String v) { brandName=v; return this; }
        public Builder zoneName(String v) { zoneName=v; return this; }
        public Builder service(String v) { service=v; return this; }
        public Builder qty(Integer v) { qty=v; return this; }
        public Builder costPerUnit(Float v) { costPerUnit=v; return this; }
        public Builder totalCost(Float v) { totalCost=v; return this; }
        public Builder deliveryDate(LocalDate v) { deliveryDate=v; return this; }
        public Builder deliveryDetails(String v) { deliveryDetails=v; return this; }
        public Builder createdAt(LocalDateTime v) { createdAt=v; return this; }
        public Builder updatedAt(LocalDateTime v) { updatedAt=v; return this; }
        public EstimateResponse build() {
            EstimateResponse r = new EstimateResponse();
            r.estimatedId=estimatedId; r.chainId=chainId; r.companyName=companyName;
            r.groupName=groupName; r.brandName=brandName; r.zoneName=zoneName;
            r.service=service; r.qty=qty; r.costPerUnit=costPerUnit; r.totalCost=totalCost;
            r.deliveryDate=deliveryDate; r.deliveryDetails=deliveryDetails;
            r.createdAt=createdAt; r.updatedAt=updatedAt; return r;
        }
    }
    public Long getEstimatedId() { return estimatedId; }
    public Long getChainId() { return chainId; }
    public String getCompanyName() { return companyName; }
    public String getGroupName() { return groupName; }
    public String getBrandName() { return brandName; }
    public String getZoneName() { return zoneName; }
    public String getService() { return service; }
    public Integer getQty() { return qty; }
    public Float getCostPerUnit() { return costPerUnit; }
    public Float getTotalCost() { return totalCost; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public String getDeliveryDetails() { return deliveryDetails; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}