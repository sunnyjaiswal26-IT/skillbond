package com.skillbond.repository;

import com.skillbond.model.Investor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvestorRepository extends MongoRepository<Investor, String> {
    Optional<Investor> findByUserId(String userId);
}
