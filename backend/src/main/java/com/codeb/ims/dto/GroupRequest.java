package com.codeb.ims.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class GroupRequest {

    @NotBlank(message = "Group name is required")
    private String groupName;
}