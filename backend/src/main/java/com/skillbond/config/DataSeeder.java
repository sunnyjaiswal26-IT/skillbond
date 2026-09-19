package com.skillbond.config;

import com.skillbond.model.*;
import com.skillbond.repository.*;
import com.skillbond.service.AiRiskScoringService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final InvestorRepository investorRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final AiRiskScoringService aiRiskScoringService;

    @Value("${skillbond.app.seedDemoData:false}")
    private boolean seedDemoData;

    @Value("${skillbond.app.initialAdminEmail:admin@skillbond.com}")
    private String initialAdminEmail;

    @Value("${skillbond.app.initialAdminPassword:admin123Password!}")
    private String initialAdminPassword;

    @Override
    public void run(String... args) {
        // 1. Production Mode: Seed ONLY the initial system Admin if database is completely empty
        if (userRepository.count() == 0) {
            seedInitialAdmin();
            
            // Seed sample dummy students ONLY if seedDemoData is explicitly set to true (e.g., in local DEV environment)
            if (seedDemoData) {
                log.info("Development Mode: Seeding sample demo student & investor profiles...");
                seedDemoStudentAndInvestorData();
            } else {
                log.info("Production Mode: Database initialized with clean Admin account. Sample demo data seeding skipped.");
            }
        }

        // 2. Compute dynamic AI risk scores for any existing requests
        List<FundingRequest> existingRequests = fundingRequestRepository.findAll();
        for (FundingRequest req : existingRequests) {
            if (req.getAiRiskScore() == null) {
                aiRiskScoringService.evaluateAndScoreRequest(req);
                fundingRequestRepository.save(req);
            }
        }
    }

    private void seedInitialAdmin() {
        if (!userRepository.existsByEmail(initialAdminEmail)) {
            User admin = User.builder()
                    .email(initialAdminEmail)
                    .password(passwordEncoder.encode(initialAdminPassword))
                    .fullName("Platform Administrator")
                    .roles(Set.of(Role.ROLE_ADMIN))
                    .enabled(true)
                    .verified(true)
                    .approved(true)
                    .build();
            userRepository.save(admin);
            log.info("Initial System Admin account created: {}", initialAdminEmail);
        }
    }

    private void seedDemoStudentAndInvestorData() {
        // Seed Student 1 (Aarav Deshmukh - COEP Pune CS)
        User studentUser1 = User.builder()
                .email("student@skillbond.com")
                .password(passwordEncoder.encode("student123Password!"))
                .fullName("Aarav Deshmukh")
                .phoneNumber("+91 98765 43210")
                .roles(Set.of(Role.ROLE_STUDENT))
                .enabled(true)
                .verified(true)
                .approved(true)
                .build();
        studentUser1 = userRepository.save(studentUser1);

        Student studentProfile1 = Student.builder()
                .userId(studentUser1.getId())
                .collegeName("COEP Technological University, Pune")
                .universityName("Autonomous (Govt. of Maharashtra)")
                .degree("B.Tech")
                .branch("Computer Engineering")
                .currentYear("Third Year (TE)")
                .expectedGraduationYear(2027)
                .tenthPercentage(94.8)
                .twelfthPercentage(92.4)
                .mhtCetPercentile(99.65)
                .jeeMainPercentile(98.80)
                .jeeAdvancedPercentile(94.20)
                .currentCgpa(9.12)
                .collegeAveragePackage(1250000.0)
                .expectedSalary(1500000.0)
                .placementStatus("STUDYING")
                .bio("Final-year CS undergrad at COEP Pune specializing in High-Performance Distributed Systems & Cloud Security.")
                .skills(List.of("Java", "Spring Boot", "React", "Python", "Docker", "Kubernetes", "MongoDB"))
                .build();
        studentProfile1 = studentRepository.save(studentProfile1);

        FundingRequest request1 = FundingRequest.builder()
                .studentId(studentProfile1.getId())
                .userId(studentUser1.getId())
                .studentName("Aarav Deshmukh")
                .requestedAmount(150000.0)
                .isaPercentage(7.5)
                .durationMonths(36)
                .reason("Final Year B.Tech tuition fee support & Cloud Infrastructure Capstone Lab hardware.")
                .collegeName("COEP Technological University, Pune")
                .universityName("Autonomous")
                .degree("B.Tech")
                .branch("Computer Engineering")
                .currentYear("Third Year (TE)")
                .currentCgpa(9.12)
                .mhtCetPercentile(99.65)
                .jeeMainPercentile(98.80)
                .tenthPercentage(94.8)
                .twelfthPercentage(92.4)
                .collegeAveragePackage(1250000.0)
                .expectedGraduationYear(2027)
                .status("APPROVED")
                .build();
        aiRiskScoringService.evaluateAndScoreRequest(request1);
        fundingRequestRepository.save(request1);

        // Seed Student 2 (Ananya Patil - VJTI Mumbai IT)
        User studentUser2 = User.builder()
                .email("ananya.patil@skillbond.com")
                .password(passwordEncoder.encode("student123Password!"))
                .fullName("Ananya Patil")
                .phoneNumber("+91 91234 56789")
                .roles(Set.of(Role.ROLE_STUDENT))
                .enabled(true)
                .verified(true)
                .approved(true)
                .build();
        studentUser2 = userRepository.save(studentUser2);

        Student studentProfile2 = Student.builder()
                .userId(studentUser2.getId())
                .collegeName("Veermata Jijabai Technological Institute (VJTI), Mumbai")
                .universityName("Mumbai University")
                .degree("B.Tech")
                .branch("Information Technology")
                .currentYear("Final Year (BE/B.Tech)")
                .expectedGraduationYear(2026)
                .tenthPercentage(96.2)
                .twelfthPercentage(94.1)
                .mhtCetPercentile(99.82)
                .jeeMainPercentile(99.10)
                .currentCgpa(9.45)
                .collegeAveragePackage(1400000.0)
                .expectedSalary(1800000.0)
                .placementStatus("INTERNSHIP")
                .bio("Top ranker in VJTI IT department building AI-powered Fintech & Machine Learning models.")
                .skills(List.of("Python", "PyTorch", "React", "TypeScript", "FastAPI", "PostgreSQL"))
                .build();
        studentProfile2 = studentRepository.save(studentProfile2);

        FundingRequest request2 = FundingRequest.builder()
                .studentId(studentProfile2.getId())
                .userId(studentUser2.getId())
                .studentName("Ananya Patil")
                .requestedAmount(200000.0)
                .isaPercentage(8.0)
                .durationMonths(36)
                .reason("Full semester college fee & AI/ML GPU Workstation setup for Final Year thesis.")
                .collegeName("Veermata Jijabai Technological Institute (VJTI), Mumbai")
                .universityName("Mumbai University")
                .degree("B.Tech")
                .branch("Information Technology")
                .currentYear("Final Year (BE/B.Tech)")
                .currentCgpa(9.45)
                .mhtCetPercentile(99.82)
                .jeeMainPercentile(99.10)
                .tenthPercentage(96.2)
                .twelfthPercentage(94.1)
                .collegeAveragePackage(1400000.0)
                .expectedGraduationYear(2026)
                .status("APPROVED")
                .build();
        aiRiskScoringService.evaluateAndScoreRequest(request2);
        fundingRequestRepository.save(request2);

        // Seed Investor User
        User investorUser = User.builder()
                .email("investor@skillbond.com")
                .password(passwordEncoder.encode("investor123Password!"))
                .fullName("Vikramaditya Shinde")
                .phoneNumber("+91 99887 76655")
                .roles(Set.of(Role.ROLE_INVESTOR))
                .enabled(true)
                .verified(true)
                .approved(true)
                .build();
        investorUser = userRepository.save(investorUser);

        Investor investorProfile = Investor.builder()
                .userId(investorUser.getId())
                .organizationName("Maharashtra STEM Angel Fund")
                .investorType("ANGEL")
                .totalCapitalBudget(2500000.0)
                .totalCapitalInvested(0.0)
                .expectedMinReturnRate(10.0)
                .bio("Angel investor and Tech VP backing Maharashtra's brightest engineering talent.")
                .website("https://mahastemfund.example.com")
                .build();
        investorRepository.save(investorProfile);
    }
}
