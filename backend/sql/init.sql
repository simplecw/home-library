-- ========================================
-- 家庭书籍管理系统 - 数据库初始化SQL
-- ========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS family_books CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE family_books;

-- ========================================
-- 书籍表
-- ========================================

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- 基础信息
    title VARCHAR(500) NOT NULL COMMENT '书名（必填）',
    isbn VARCHAR(20) COMMENT 'ISBN',
    location VARCHAR(100) COMMENT '位置',
    category VARCHAR(50) COMMENT '类型',
    author VARCHAR(200) COMMENT '作者',
    translator VARCHAR(200) COMMENT '译者',
    publisher VARCHAR(200) COMMENT '出版社',
    series VARCHAR(200) COMMENT '丛书',
    publish_year VARCHAR(20) COMMENT '出版年（支持YYYY/MM/DD格式）',
    
    -- 详细信息
    pages INT COMMENT '页数',
    price VARCHAR(50) COMMENT '定价',
    binding VARCHAR(50) COMMENT '装帧',
    remark TEXT COMMENT '备注',
    original_title VARCHAR(500) COMMENT '原作名',
    subtitle VARCHAR(500) COMMENT '副标题',
    unified_code VARCHAR(50) COMMENT '统一书号',
    language VARCHAR(50) COMMENT '语言类型',
    
    -- 系统字段
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除（0-否 1-是）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='书籍表';

-- ========================================
-- 索引
-- ========================================

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_is_deleted ON books(is_deleted);
CREATE INDEX idx_books_category_author ON books(category, author);
