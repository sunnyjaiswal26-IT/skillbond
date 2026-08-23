package com.skillbond.repository;

import com.skillbond.model.Repayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentRepository extends MongoRepository<Repayment, String> {
    List<Repayment> findByStudentUserId(String studentUserId);
    List<Repayment> findByInvestorUserId(String investorUserId);
    List<Repayment> findByInvestmentId(String investmentId);
}
