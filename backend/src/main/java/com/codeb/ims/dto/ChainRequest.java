package com.codeb.ims.dto;

public class ChainRequest {
    private String companyName;
    private String gstnNo;
    private Long groupId;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String v) { this.companyName = v; }
    public String getGstnNo() { return gstnNo; }
    public void setGstnNo(String v) { this.gstnNo = v; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long v) { this.groupId = v; }
}