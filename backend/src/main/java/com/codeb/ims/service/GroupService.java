package com.codeb.ims.service;

import com.codeb.ims.dto.GroupRequest;
import com.codeb.ims.dto.GroupResponse;
import com.codeb.ims.entity.Group;
import com.codeb.ims.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<GroupResponse> getAllGroups() {
        return groupRepository.findAllByIsActiveTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public GroupResponse getGroupById(Long id) {
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return toResponse(group);
    }

    public GroupResponse addGroup(GroupRequest request) {
        if (groupRepository.existsByGroupName(request.getGroupName().trim())) {
            throw new RuntimeException("Group Already Exists!!!");
        }
        Group group = new Group();
        group.setGroupName(request.getGroupName().trim());
        group.setIsActive(true);
        return toResponse(groupRepository.save(group));
    }

    public GroupResponse updateGroup(Long id, GroupRequest request) {
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        if (groupRepository.existsByGroupNameAndGroupIdNot(request.getGroupName().trim(), id)) {
            throw new RuntimeException("Group name already exists");
        }
        group.setGroupName(request.getGroupName().trim());
        return toResponse(groupRepository.save(group));
    }

    public String deleteGroup(Long id) {
        Group group = groupRepository.findByGroupIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setIsActive(false);
        groupRepository.save(group);
        return "Group deactivated successfully";
    }

    public long getTotalGroups() {
        return groupRepository.findAllByIsActiveTrue().size();
    }

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