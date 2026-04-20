#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
将 book - 数据.CSV 转换为 SQL INSERT 语句
"""
import csv
import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
CSV_FILE = os.path.join(PROJECT_DIR, 'book - 数据.CSV')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'import_books.sql')


def escape_sql_string(s):
    if s is None or s == '':
        return 'NULL'
    s = str(s).replace('\\', '\\\\').replace("'", "\\'")
    return f"'{s}'"


def parse_csv_to_sql():
    if not os.path.exists(CSV_FILE):
        print(f"错误: 找不到CSV文件 {CSV_FILE}")
        return 0
    
    sql_statements = []
    sql_statements.append("-- 家庭书籍管理系统 - 书籍数据导入SQL")
    sql_statements.append("-- 从 book - 数据.CSV 自动生成")
    sql_statements.append("")
    sql_statements.append("USE family_books;")
    sql_statements.append("")
    
    fields = ['title', 'location', 'category', 'author', 'translator',
              'original_title', 'publisher', 'subtitle', 'series', 'publish_year',
              'price', 'unified_code', 'pages', 'binding', 'isbn', 'remark', 'language']
    
    count = 0
    
    try:
        with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            next(reader)  # 跳过表头
            
            for row in reader:
                if not row or len(row) < 1 or not row[0].strip():
                    continue
                
                count += 1
                while len(row) < 17:
                    row.append('')
                
                values = []
                for i in range(len(fields)):
                    if i < len(row):
                        val = row[i].strip() if row[i] else ''
                        if i == 12 and val:
                            pages_str = re.sub(r'[^\d]', '', val)
                            val = pages_str if pages_str else ''
                        values.append(escape_sql_string(val))
                    else:
                        values.append('NULL')
                
                sql = f"INSERT INTO books ({', '.join(fields)}) VALUES ({', '.join(values)});"
                sql_statements.append(sql)
        
        print(f"共处理 {count} 条记录")
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sql_statements))
        
        print(f"SQL文件已生成: {OUTPUT_FILE}")
        return count
        
    except Exception as e:
        print(f"处理错误: {e}")
        return 0


if __name__ == '__main__':
    print("CSV转SQL工具")
    count = parse_csv_to_sql()
    if count > 0:
        print(f"\n成功! 请执行: mysql -h 192.168.1.108 -u chenwei -p < {OUTPUT_FILE}")
