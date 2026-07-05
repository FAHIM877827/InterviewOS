package com.interviewos.backend.repository;

import com.interviewos.backend.model.ProfileSnapshot;
import com.interviewos.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfileSnapshotRepository extends JpaRepository<ProfileSnapshot, UUID> {
    Optional<ProfileSnapshot> findTopByUserOrderByFetchedAtDesc(User user);
    List<ProfileSnapshot> findByUserOrderByFetchedAtDesc(User user);
}