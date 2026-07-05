package com.interviewos.backend.controller;

import com.interviewos.backend.dto.LinkProfileRequest;
import com.interviewos.backend.dto.ProfileSnapshotResponse;
import com.interviewos.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/link")
    public ResponseEntity<ProfileSnapshotResponse> linkProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LinkProfileRequest request) {

        ProfileSnapshotResponse response = profileService.linkProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}