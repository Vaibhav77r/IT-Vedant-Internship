package com.codeb.ims.dto;

public class BrandRequest {
    private String brandName;
    private Long chainId;
    public String getBrandName() { return brandName; }
    public void setBrandName(String v) { this.brandName = v; }
    public Long getChainId() { return chainId; }
    public void setChainId(Long v) { this.chainId = v; }
}