package com.skillbond.repository;

import com.skillbond.model.FundingRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundingRequestRepository extends MongoRepository<FundingRequest, String> {
    List<FundingRequest> findByUserId(String userId);
    List<FundingRequest> findByStudentId(String studentId);
    List<FundingRequest> findByStatus(String status);
}
