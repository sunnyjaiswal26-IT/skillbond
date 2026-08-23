package com.skillbond.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "documents")
public class DocumentEntity {

    @Id
    private String id;

    private String userId;

    private String name;

    private String fileType;

    private String fileUrl;

    private Long size;

    @CreatedDate
    private Instant createdAt;
}
