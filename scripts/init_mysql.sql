-- Finix CNC Training - MySQL Database Schema
-- Run this script to initialize the database

CREATE DATABASE IF NOT EXISTS finix_cnc;
USE finix_cnc;

-- Admins table for authentication
CREATE TABLE IF NOT EXISTS admins (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table for blog posts
CREATE TABLE IF NOT EXISTS blogs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL DEFAULT 'Finix CNC Training',
  author_id CHAR(36),
  published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Index for faster slug lookups
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- Index for faster date sorting
CREATE INDEX idx_blogs_published_date ON blogs(published_date DESC);

-- Quick enquiry submissions (homepage)
CREATE TABLE IF NOT EXISTS enquiries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  course VARCHAR(255) NOT NULL,
  status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions (contact page)
CREATE TABLE IF NOT EXISTS contact_messages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  course VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
