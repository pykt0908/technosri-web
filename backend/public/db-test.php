<?php

/**
 * Standalone Laravel Database Connection & Schema Health Tester
 * Place this file in your Laravel public/ directory.
 * Access it via: http://your-domain.com/db-test.php
 */

// Set time limit
set_time_limit(60);

echo "<!DOCTYPE html>
<html lang='th'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Database Connectivity & Schema Tester</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; color: #1e293b; padding: 40px; margin: 0; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        h1 { color: #0f172a; margin-top: 0; font-size: 26px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; font-weight: 800; }
        h2 { font-size: 18px; color: #334155; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px; }
        .card { padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #cbd5e1; }
        .success { background-color: #f0fdf4; border-color: #bbf7d0; color: #166534; }
        .warning { background-color: #fffbeb; border-color: #fde68a; color: #92400e; }
        .error { background-color: #fef2f2; border-color: #fca5a5; color: #991b1b; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #f8fafc; font-weight: bold; color: #475569; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .badge-ok { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-missing { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        pre { background-color: #0f172a; color: #38bdf8; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px; }
        .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
        .info-grid { display: grid; grid-template-cols: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .info-box { background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .info-label { font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; }
        .info-val { font-size: 15px; color: #1e293b; font-weight: bold; margin-top: 4px; word-break: break-all; }
    </style>
</head>
<body>
<div class='container'>
    <h1>Database Connection & Schema Health Tester</h1>";

try {
    // 1. Boot Laravel Application from public path
    $autoloadPath = __DIR__.'/../vendor/autoload.php';
    $appPath = __DIR__.'/../bootstrap/app.php';

    // DYNAMIC AUTODETECT: Parse index.php to locate bootstrap folder on shared hosting
    if (!file_exists($autoloadPath) || !file_exists($appPath)) {
        $indexContent = @file_get_contents(__DIR__.'/index.php');
        if ($indexContent) {
            if (preg_match("/require\s+(['\"])(.*?\/vendor\/autoload\.php)\\1/", $indexContent, $matches)) {
                $autoloadPath = str_replace('__DIR__', __DIR__, $matches[2]);
            }
            if (preg_match("/(?:require|require_once)\s*\(*\s*(['\"])(.*?\/bootstrap\/app\.php)\\1\s*\)*/i", $indexContent, $matches)) {
                $appPath = str_replace('__DIR__', __DIR__, $matches[2]);
            }
        }
    }

    if (!file_exists($autoloadPath) || !file_exists($appPath)) {
        throw new \Exception("ไม่พบไฟล์แกนหลักของ Laravel กรุณาตรวจสอบการติดตั้ง (Autoload: $autoloadPath | Bootstrap: $appPath)");
    }

    require $autoloadPath;
    $app = require_once $appPath;
    
    // Resolve Console Kernel to load configuration and database service provider
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

    // 2. Fetch Active Database Configuration (Hiding sensitive parameters)
    $dbConnection = config('database.default');
    $dbConfig = config("database.connections.$dbConnection");

    echo "<h2>1. ข้อมูลการเชื่อมต่อฐานข้อมูล (Database Configuration)</h2>";
    echo "<div class='info-grid'>
            <div class='info-box'>
                <div class='info-label'>Connection Driver</div>
                <div class='info-val'>{$dbConnection}</div>
            </div>
            <div class='info-box'>
                <div class='info-label'>Database Host</div>
                <div class='info-val'>" . ($dbConfig['host'] ?? 'N/A') . ":" . ($dbConfig['port'] ?? '3306') . "</div>
            </div>
            <div class='info-box'>
                <div class='info-label'>Database Name</div>
                <div class='info-val'>" . ($dbConfig['database'] ?? 'N/A') . "</div>
            </div>
            <div class='info-box'>
                <div class='info-label'>Username</div>
                <div class='info-val'>" . ($dbConfig['username'] ?? 'N/A') . "</div>
            </div>
          </div>";

    // 3. Perform Live Connection Test
    echo "<h2>2. ผลการทดสอบเชื่อมต่อ (Connection Test)</h2>";
    try {
        $pdo = Illuminate\Support\Facades\DB::connection()->getPdo();
        $version = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
        echo "<div class='card success'>
                <strong>สำเร็จ!</strong> เชื่อมต่อฐานข้อมูลได้สำเร็จเรียบร้อยแล้ว<br>
                <span style='font-size: 13px; opacity: 0.8;'>Database Version: {$version}</span>
              </div>";
    } catch (\Exception $dbErr) {
        echo "<div class='card error'>
                <strong>การเชื่อมต่อล้มเหลว!</strong> ไม่สามารถเข้าถึงฐานข้อมูลได้<br>
                <p style='font-size: 13px; font-weight: normal; margin-top: 10px;'>สาเหตุ: {$dbErr->getMessage()}</p>
              </div>";
        throw $dbErr; // Stop further checks if connection failed
    }

    // 4. Schema and Table Verification
    echo "<h2>3. ตรวจสอบสถานะโครงสร้างตาราง (Table Schema Health Check)</h2>";
    
    $requiredTables = [
        'users' => 'ระบบจัดการผู้ใช้งานและสิทธิ์ผู้ดูแลระบบ',
        'news' => 'ตารางข้อมูลข่าวสารประชาสัมพันธ์',
        'curricula' => 'ตารางหลักสูตรการสอน (ปวช. / ปวส.)',
        'download_categories' => 'หมวดหมู่ดาวน์โหลดเอกสาร (เพิ่มใหม่)',
        'download_documents' => 'ตารางชุดเอกสารหลัก (เพิ่มใหม่)',
        'download_files' => 'ตารางไฟล์ดาวน์โหลดทางกายภาพ (เพิ่มใหม่)',
    ];

    echo "<table>
            <thead>
                <tr>
                    <th>ชื่อตาราง (Table Name)</th>
                    <th>รายละเอียดตาราง (Description)</th>
                    <th>สถานะ (Status)</th>
                    <th>จำนวนแถวข้อมูล (Rows)</th>
                </tr>
            </thead>
            <tbody>";

    foreach ($requiredTables as $tableName => $desc) {
        $exists = Illuminate\Support\Facades\Schema::hasTable($tableName);
        $rowCount = 0;
        
        if ($exists) {
            try {
                $rowCount = Illuminate\Support\Facades\DB::table($tableName)->count();
                $statusHtml = "<span class='badge badge-ok'>พบตาราง (OK)</span>";
            } catch (\Exception $cntErr) {
                $statusHtml = "<span class='badge badge-missing'>มีปัญหาคำสั่งนับ</span>";
            }
        } else {
            $statusHtml = "<span class='badge badge-missing'>ไม่พบตาราง (MISSING)</span>";
        }

        echo "<tr>
                <td style='font-family: monospace; font-weight: bold; color: #0f172a;'>{$tableName}</td>
                <td style='font-size: 13px; color: #475569;'>{$desc}</td>
                <td>{$statusHtml}</td>
                <td>" . ($exists ? $rowCount : '-') . "</td>
              </tr>";
    }
    echo "</tbody></table>";

    // 5. Special Columns Check (Gallery system checking)
    echo "<h2>4. ตรวจสอบคอลัมน์พิเศษแกลเลอรี (Special Columns Check)</h2>";
    if (Illuminate\Support\Facades\Schema::hasTable('news')) {
        $hasGallery = Illuminate\Support\Facades\Schema::hasColumn('news', 'gallery');
        if ($hasGallery) {
            echo "<div class='card success'>
                    <strong>คอลัมน์แกลเลอรีรูปภาพ:</strong> พบฟิลด์ <code>gallery</code> ในตาราง <code>news</code> เรียบร้อยแล้ว (สามารถใช้งานระบบแกลเลอรีรูปข่าวสารประชาสัมพันธ์ได้ทันที)
                  </div>";
        } else {
            echo "<div class='card warning'>
                    <strong>คอลัมน์แกลเลอรีรูปภาพ:</strong> <span style='font-weight: bold;'>ไม่พบ</span>ฟิลด์ <code>gallery</code> ในตาราง <code>news</code><br>
                    <span style='font-size: 13px; opacity: 0.9;'>กรุณารัน Migration ล่าสุดเพิ่มเติมเพื่ออัปเดตช่องทางแกลเลอรีข่าว</span>
                  </div>";
        }
    } else {
        echo "<div class='card error'>
                <strong>ข้อพึงระวัง:</strong> ไม่พบตาราง <code>news</code> เพื่อใช้สำหรับตรวจสอบคอลัมน์แกลเลอรี
              </div>";
    }

} catch (\Exception $e) {
    echo "<h2>เกิดข้อผิดพลาดระดับระบบ (Fatal System Error)</h2>";
    echo "<div class='card error'>
            <strong>ระบบขัดข้อง:</strong> ไม่สามารถรันสคริปต์ตรวจสอบสุขภาพฐานข้อมูลจนจบได้
          </div>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "\n\nTrace:\n" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "
    <div style='margin-top: 30px; text-align: center;'>
        <a href='/backend/public/migrate.php' style='display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 15px; box-shadow: 0 4px 6px rgba(16,185,129,0.25);'>รันระบบอัปเดตฐานข้อมูล (Go to Migrate)</a>
        <a href='/' style='display: inline-block; background-color: #64748b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;'>กลับหน้าหลัก</a>
    </div>
    <div class='footer'>
        วิทยาลัยเทคโนโลยีศรีราชา (STC) - แฟ้มเครื่องมือตรวจสอบและวินิจฉัยความพร้อมระบบฐานข้อมูลประชาสัมพันธ์
    </div>
</div>
</body>
</html>";
