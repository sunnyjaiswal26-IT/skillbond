package com.skillbond.repository;

import com.skillbond.model.Investment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends MongoRepository<Investment, String> {
    List<Investment> findByInvestorUserId(String investorUserId);
    List<Investment> findByStudentUserId(String studentUserId);
    List<Investment> findByFundingRequestId(String fundingRequestId);
}
