package com.codeb.ims.dto;

import java.time.LocalDateTime;

public class ChainResponse {
    private Long chainId; private String companyName; private String gstnNo;
    private Long groupId; private String groupName; private Boolean isActive;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long chainId; private String companyName; private String gstnNo;
        private Long groupId; private String groupName; private Boolean isActive;
        private LocalDateTime createdAt; private LocalDateTime updatedAt;
        public Builder chainId(Long v) { chainId=v; return this; }
        public Builder companyName(String v) { companyName=v; return this; }
        public Builder gstnNo(String v) { gstnNo=v; return this; }
        public Builder groupId(Long v) { groupId=v; return this; }
        public Builder groupName(String v) { groupName=v; return this; }
        public Builder isActive(Boolean v) { isActive=v; return this; }
        public Builder createdAt(LocalDateTime v) { createdAt=v; return this; }
        public Builder updatedAt(LocalDateTime v) { updatedAt=v; return this; }
        public ChainResponse build() {
            ChainResponse r = new ChainResponse();
            r.chainId=chainId; r.companyName=companyName; r.gstnNo=gstnNo;
            r.groupId=groupId; r.groupName=groupName; r.isActive=isActive;
            r.createdAt=createdAt; r.updatedAt=updatedAt; return r;
        }
    }
    public Long getChainId() { return chainId; }
    public String getCompanyName() { return companyName; }
    public String getGstnNo() { return gstnNo; }
    public Long getGroupId() { return groupId; }
    public String getGroupName() { return groupName; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}