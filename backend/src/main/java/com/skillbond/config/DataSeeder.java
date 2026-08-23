package com.skillbond.config;

import com.skillbond.model.*;
import com.skillbond.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final InvestorRepository investorRepository;
    private final FundingRequestRepository fundingRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // 1. Seed Admin User
            User admin = User.builder()
                    .email("admin@skillbond.com")
                    .password(passwordEncoder.encode("admin123Password!"))
                    .fullName("Platform Administrator")
                    .roles(Set.of(Role.ROLE_ADMIN))
                    .enabled(true)
                    .verified(true)
                    .approved(true)
                    .build();
            userRepository.save(admin);

            // 2. Seed Student User 1 (Aarav Deshmukh - COEP Pune B.Tech CS)
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
                    .collegeAveragePackage(1250000.0) // ₹ 12.5 LPA
                    .expectedSalary(1500000.0) // ₹ 15 LPA
                    .placementStatus("STUDYING")
                    .bio("Final-year CS undergrad at COEP Pune specializing in High-Performance Distributed Systems & Cloud Security.")
                    .skills(List.of("Java", "Spring Boot", "React", "Python", "Docker", "Kubernetes", "MongoDB"))
                    .projects(List.of(
                            Student.Project.builder()
                                    .title("MahaTelemetry Engine")
                                    .description("Real-time distributed traffic anomaly monitoring for Pune Smart City.")
                                    .githubUrl("https://github.com/example/mahatelemetry")
                                    .build()
                    ))
                    .build();
            studentProfile1 = studentRepository.save(studentProfile1);

            // Seed Funding Request for Student 1 (Approved by Admin so Investor can see it)
            FundingRequest request1 = FundingRequest.builder()
                    .studentId(studentProfile1.getId())
                    .userId(studentUser1.getId())
                    .studentName("Aarav Deshmukh")
                    .requestedAmount(150000.0) // ₹ 1,50,000 INR
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
            fundingRequestRepository.save(request1);

            // 3. Seed Student User 2 (Ananya Patil - VJTI Mumbai IT)
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
                    .collegeAveragePackage(1400000.0) // ₹ 14 LPA
                    .expectedSalary(1800000.0) // ₹ 18 LPA
                    .placementStatus("INTERNSHIP")
                    .bio("Top ranker in VJTI IT department building AI-powered Fintech & Machine Learning models.")
                    .skills(List.of("Python", "PyTorch", "React", "TypeScript", "FastAPI", "PostgreSQL"))
                    .projects(List.of(
                            Student.Project.builder()
                                    .title("RupeeFlow AI Engine")
                                    .description("Automated fraud detection engine for UPI micropayments.")
                                    .githubUrl("https://github.com/example/rupeeflow")
                                    .build()
                    ))
                    .build();
            studentProfile2 = studentRepository.save(studentProfile2);

            FundingRequest request2 = FundingRequest.builder()
                    .studentId(studentProfile2.getId())
                    .userId(studentUser2.getId())
                    .studentName("Ananya Patil")
                    .requestedAmount(200000.0) // ₹ 2,00,000 INR
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
            fundingRequestRepository.save(request2);

            // 4. Seed Investor User
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
                    .totalCapitalBudget(2500000.0) // ₹ 25,00,000 INR (₹ 25 Lakhs)
                    .totalCapitalInvested(0.0)
                    .expectedMinReturnRate(10.0)
                    .bio("Angel investor and Tech VP backing Maharashtra's brightest engineering talent.")
                    .website("https://mahastemfund.example.com")
                    .build();
            investorRepository.save(investorProfile);
        }
    }
}
