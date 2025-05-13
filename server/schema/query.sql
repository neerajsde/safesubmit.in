CREATE DATABASE IF NOT EXISTS safesubmit;
USE safesubmit;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_img VARCHAR(255),
    country_code VARCHAR(10),
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    approve BOOLEAN DEFAULT TRUE,
    api_key VARCHAR(255),
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    UNIQUE INDEX (email),
    INDEX (api_key),
    INDEX (phone)
) ENGINE=InnoDB;

CREATE TABLE forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyId VARCHAR(255),
    userId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    form_schema TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (userId) REFERENCES users(id),
    INDEX (userId)
) ENGINE=InnoDB;

CREATE TABLE form_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formId INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (formId) REFERENCES forms(id),
    UNIQUE INDEX (formId, email),
    INDEX (email)
) ENGINE=InnoDB;

CREATE TABLE form_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    submitted_data TEXT NOT NULL,
    message TEXT,
    created_date DATE DEFAULT (CURRENT_DATE),
    created_time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    INDEX (form_id)
) ENGINE=InnoDB;

CREATE TABLE form_data_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formDataId INT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (formDataId) REFERENCES form_data(id),
    INDEX (formDataId)
) ENGINE=InnoDB;

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    INDEX (email)
) ENGINE=InnoDB;