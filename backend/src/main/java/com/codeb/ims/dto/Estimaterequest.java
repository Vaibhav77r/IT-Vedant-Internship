package com.codeb.ims.dto;

import java.time.LocalDate;

public class EstimateRequest {
    private Long chainId; private String groupName; private String brandName;
    private String zoneName; private String service; private Integer qty;
    private Float costPerUnit; private LocalDate deliveryDate; private String deliveryDetails;

    public Long getChainId() { return chainId; }
    public void setChainId(Long v) { this.chainId = v; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String v) { this.groupName = v; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String v) { this.brandName = v; }
    public String getZoneName() { return zoneName; }
    public void setZoneName(String v) { this.zoneName = v; }
    public String getService() { return service; }
    public void setService(String v) { this.service = v; }
    public Integer getQty() { return qty; }
    public void setQty(Integer v) { this.qty = v; }
    public Float getCostPerUnit() { return costPerUnit; }
    public void setCostPerUnit(Float v) { this.costPerUnit = v; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate v) { this.deliveryDate = v; }
    public String getDeliveryDetails() { return deliveryDetails; }
    public void setDeliveryDetails(String v) { this.deliveryDetails = v; }
}