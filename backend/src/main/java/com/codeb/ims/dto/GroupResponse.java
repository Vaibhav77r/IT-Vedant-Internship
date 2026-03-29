package com.codeb.ims.dto;

import java.time.LocalDateTime;

public class GroupResponse {
    private Long groupId;
    private String groupName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GroupResponse() {}
    public GroupResponse(Long groupId, String groupName, Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.groupId = groupId; this.groupName = groupName; this.isActive = isActive;
        this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long groupId; private String groupName; private Boolean isActive;
        private LocalDateTime createdAt; private LocalDateTime updatedAt;
        public Builder groupId(Long v) { groupId = v; return this; }
        public Builder groupName(String v) { groupName = v; return this; }
        public Builder isActive(Boolean v) { isActive = v; return this; }
        public Builder createdAt(LocalDateTime v) { createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { updatedAt = v; return this; }
        public GroupResponse build() { return new GroupResponse(groupId, groupName, isActive, createdAt, updatedAt); }
    }

    public Long getGroupId() { return groupId; }
    public String getGroupName() { return groupName; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}