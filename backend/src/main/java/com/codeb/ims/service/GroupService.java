package com.codeb.ims.service;

import com.codeb.ims.dto.GroupRequest;
import com.codeb.ims.dto.GroupResponse;
import com.codeb.ims.entity.Group;
import com.codeb.ims.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    // Get all active groups
    public List<GroupResponse> getAllGroups() {
        return groupRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Get group by ID
    public GroupResponse getGroupById(Long id) {
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return toResponse(group);
    }

    // Add new group
    public GroupResponse addGroup(GroupRequest request) {
        if (groupRepository.existsByGroupName(request.getGroupName().trim())) {
            throw new RuntimeException("Group Already Exists!!!");
        }

        Group group = Group.builder()
                .groupName(request.getGroupName().trim())
                .isActive(true)
                .build();

        return toResponse(groupRepository.save(group));
    }

    // Update group name
    public GroupResponse updateGroup(Long id, GroupRequest request) {
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Check if new name already exists for a different group
        if (groupRepository.existsByGroupNameAndGroupIdNot(request.getGroupName().trim(), id)) {
            throw new RuntimeException("Group name already exists");
        }

        group.setGroupName(request.getGroupName().trim());
        return toResponse(groupRepository.save(group));
    }

    // Soft delete - only if not linked to any chain
    public String deleteGroup(Long id) {
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // TODO: Add chain relationship check here in Module 3
        // For now, allow deletion if group exists
        group.setIsActive(false);
        groupRepository.save(group);
        return "Group deactivated successfully";
    }

    // Total active group count
    public long getTotalGroups() {
        return groupRepository.findAllByIsActiveTrue().size();
    }

    // Helper: convert entity to response DTO
    private GroupResponse toResponse(Group group) {
        return GroupResponse.builder()
                .groupId(group.getGroupId())
                .groupName(group.getGroupName())
                .isActive(group.getIsActive())
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }
}