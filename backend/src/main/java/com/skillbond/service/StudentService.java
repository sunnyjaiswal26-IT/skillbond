package com.skillbond.service;

import com.skillbond.model.FundingRequest;
import com.skillbond.model.Investment;
import com.skillbond.model.Repayment;
import com.skillbond.model.Student;
import com.skillbond.repository.FundingRequestRepository;
import com.skillbond.repository.InvestmentRepository;
import com.skillbond.repository.RepaymentRepository;
import com.skillbond.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final InvestmentRepository investmentRepository;
    private final RepaymentRepository repaymentRepository;

    public Student getStudentByUserId(String userId) {
        return studentRepository.findByUserId(userId)
                .orElseGet(() -> studentRepository.save(Student.builder().userId(userId).build()));
    }

    public Student updateStudentProfile(String userId, Student updatedData) {
        Student student = getStudentByUserId(userId);

        if (updatedData.getCollegeName() != null) student.setCollegeName(updatedData.getCollegeName());
        if (updatedData.getUniversityName() != null) student.setUniversityName(updatedData.getUniversityName());
        if (updatedData.getDegree() != null) student.setDegree(updatedData.getDegree());
        if (updatedData.getBranch() != null) student.setBranch(updatedData.getBranch());
        if (updatedData.getCurrentYear() != null) student.setCurrentYear(updatedData.getCurrentYear());
        if (updatedData.getExpectedGraduationYear() != null) student.setExpectedGraduationYear(updatedData.getExpectedGraduationYear());
        
        // Academic Percentiles & Marks
        if (updatedData.getTenthPercentage() != null) student.setTenthPercentage(updatedData.getTenthPercentage());
        if (updatedData.getTwelfthPercentage() != null) student.setTwelfthPercentage(updatedData.getTwelfthPercentage());
        if (updatedData.getMhtCetPercentile() != null) student.setMhtCetPercentile(updatedData.getMhtCetPercentile());
        if (updatedData.getJeeMainPercentile() != null) student.setJeeMainPercentile(updatedData.getJeeMainPercentile());
        if (updatedData.getJeeAdvancedPercentile() != null) student.setJeeAdvancedPercentile(updatedData.getJeeAdvancedPercentile());
        if (updatedData.getCurrentCgpa() != null) student.setCurrentCgpa(updatedData.getCurrentCgpa());
        
        // Placement & Financial Metrics (in Rupees)
        if (updatedData.getCollegeAveragePackage() != null) student.setCollegeAveragePackage(updatedData.getCollegeAveragePackage());
        if (updatedData.getPlacementStatus() != null) student.setPlacementStatus(updatedData.getPlacementStatus());
        if (updatedData.getCurrentSalary() != null) student.setCurrentSalary(updatedData.getCurrentSalary());
        if (updatedData.getExpectedSalary() != null) student.setExpectedSalary(updatedData.getExpectedSalary());
        
        if (updatedData.getBio() != null) student.setBio(updatedData.getBio());
        if (updatedData.getSkills() != null) student.setSkills(updatedData.getSkills());
        if (updatedData.getProjects() != null) student.setProjects(updatedData.getProjects());
        if (updatedData.getResumeUrl() != null) student.setResumeUrl(updatedData.getResumeUrl());
        
        return studentRepository.save(student);
    }

    public List<Student> getAllPublicStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }

    public FundingRequest createFundingRequest(String userId, String userName, FundingRequest request) {
        Student student = getStudentByUserId(userId);
        
        request.setStudentId(student.getId());
        request.setUserId(userId);
        request.setStudentName(userName);
        
        // Auto-fill academic scores from student profile to request
        if (request.getCollegeName() == null) request.setCollegeName(student.getCollegeName());
        if (request.getUniversityName() == null) request.setUniversityName(student.getUniversityName());
        if (request.getBranch() == null) request.setBranch(student.getBranch());
        if (request.getDegree() == null) request.setDegree(student.getDegree());
        if (request.getCurrentYear() == null) request.setCurrentYear(student.getCurrentYear());
        if (request.getCurrentCgpa() == null) request.setCurrentCgpa(student.getCurrentCgpa());
        if (request.getMhtCetPercentile() == null) request.setMhtCetPercentile(student.getMhtCetPercentile());
        if (request.getJeeMainPercentile() == null) request.setJeeMainPercentile(student.getJeeMainPercentile());
        if (request.getTenthPercentage() == null) request.setTenthPercentage(student.getTenthPercentage());
        if (request.getTwelfthPercentage() == null) request.setTwelfthPercentage(student.getTwelfthPercentage());
        if (request.getCollegeAveragePackage() == null) request.setCollegeAveragePackage(student.getCollegeAveragePackage());

        request.setStatus("PENDING");
        return fundingRequestRepository.save(request);
    }

    public List<FundingRequest> getMyFundingRequests(String userId) {
        return fundingRequestRepository.findByUserId(userId);
    }

    public List<Investment> getMyAcceptedInvestments(String userId) {
        return investmentRepository.findByStudentUserId(userId);
    }

    public List<Repayment> getMyRepayments(String userId) {
        return repaymentRepository.findByStudentUserId(userId);
    }
}
