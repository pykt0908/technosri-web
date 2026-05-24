<?php

/**
 * Standalone Laravel Log Viewer for Shared Hosting Diagnostics
 * Place this file in your Laravel public/ directory.
 * Access it via: http://your-domain.com/log-view.php
 */

// Set time limit
set_time_limit(60);

echo "<!DOCTYPE html>
<html lang='th'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Laravel Log Diagnostics Viewer</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 40px; margin: 0; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        h1 { color: #0f172a; margin-top: 0; font-size: 26px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; font-weight: 800; }
        h2 { font-size: 18px; color: #475569; margin-top: 25px; margin-bottom: 15px; }
        .btn { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: background-color 0.2s; border: none; cursor: pointer; }
        .btn:hover { background-color: #1d4ed8; }
        .btn-danger { background-color: #dc2626; }
        .btn-danger:hover { background-color: #b91c1c; }
        pre { background-color: #0f172a; color: #f8fafc; padding: 20px; border-radius: 10px; overflow-x: auto; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.6; max-height: 600px; overflow-y: auto; border: 1px solid #1e293b; }
        .log-entry { border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 15px; }
        .log-entry:last-child { border-bottom: none; }
        .log-time { color: #a7f3d0; font-weight: bold; }
        .log-level { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-right: 10px; }
        .level-error { background-color: #fecaca; color: #991b1b; }
        .level-info { background-color: #e0f2fe; color: #0369a1; }
        .level-debug { background-color: #f1f5f9; color: #475569; }
        .level-critical { background-color: #fca5a5; color: #7f1d1d; }
        .level-warning { background-color: #fef3c7; color: #78350f; }
        .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
        .actions { display: flex; gap: 15px; margin-bottom: 35px; }
        .message-success { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; }
    </style>
</head>
<body>
<div class='container'>
    <h1>Laravel Live Log Diagnostics Viewer</h1>";

// Action: Clear Cache
if (isset($_GET['action']) && $_GET['action'] === 'clear_cache') {
    try {
        // Boot Laravel
        $autoloadPath = __DIR__.'/../vendor/autoload.php';
        $appPath = __DIR__.'/../bootstrap/app.php';
        
        // Autodetect on Shared Hosting
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
        
        require $autoloadPath;
        $app = require_once $appPath;
        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
        
        // Execute Cache Clears
        Illuminate\Support\Facades\Artisan::call('cache:clear');
        Illuminate\Support\Facades\Artisan::call('route:clear');
        Illuminate\Support\Facades\Artisan::call('config:clear');
        Illuminate\Support\Facades\Artisan::call('view:clear');
        
        // Force OPcache reset if available
        if (function_exists('opcache_reset')) {
            @opcache_reset();
        }
        
        echo "<div class='message-success'>ล้างหน่วยความจำแคชระบบ (Cache, Route, Config, View, OPcache) สำเร็จเรียบร้อยแล้ว! โค้ดใหม่ของคุณจะได้รับการเปิดใช้งานโดยตรง</div>";
    } catch (\Exception $e) {
        echo "<div style='background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; padding: 15px; border-radius: 8px; margin-bottom: 20px;'>ไม่สามารถล้างแคชได้: " . htmlspecialchars($e->getMessage()) . "</div>";
    }
}

// Action: Clear Log
if (isset($_GET['action']) && $_GET['action'] === 'clear_log') {
    $logFile = __DIR__ . '/../storage/logs/laravel.log';
    if (file_exists($logFile)) {
        @file_put_contents($logFile, '');
        echo "<div class='message-success'>ล้างล็อกไฟล์เรียบร้อยแล้ว ล็อกใหม่จะถูกบันทึกเมื่อมีข้อผิดพลาดเกิดขึ้นใหม่</div>";
    }
}

// Action: Fix Schema
if (isset($_GET['action']) && $_GET['action'] === 'fix_schema') {
    try {
        // Boot Laravel
        $autoloadPath = __DIR__.'/../vendor/autoload.php';
        $appPath = __DIR__.'/../bootstrap/app.php';
        
        // Autodetect on Shared Hosting
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
        
        require $autoloadPath;
        $app = require_once $appPath;
        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
        
        // 1. Drop download_files table safely
        Illuminate\Support\Facades\Schema::dropIfExists('download_files');
        
        // 2. Remove migration entry from migrations table
        Illuminate\Support\Facades\DB::table('migrations')
            ->where('migration', 'like', '%create_download_files_table%')
            ->delete();
            
        // 3. Re-run migrations to create download_files fresh with correct schema
        $status = Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        
        echo "<div class='message-success'>ดำเนินการซ่อมแซมระบบตาราง <code>download_files</code> สำเร็จ! ตารางใหม่ถูกสร้างขึ้นใหม่พร้อมคอลัมน์เชื่อมโยง <code>download_document_id</code> เรียบร้อยแล้ว (Artisan code: {$status})</div>";
    } catch (\Exception $e) {
        echo "<div style='background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; padding: 15px; border-radius: 8px; margin-bottom: 20px;'>การซ่อมแซมล้มเหลว: " . htmlspecialchars($e->getMessage()) . "</div>";
    }
}

echo "<div class='actions'>
        <a href='?action=clear_cache' class='btn'>⚡ ล้างหน่วยความจำแคช (Clear Laravel & OPcache)</a>
        <a href='?action=fix_schema' class='btn' style='background-color: #d97706;'>🛠️ ซ่อมแซมระบบตาราง (Fix download_files Schema)</a>
        <a href='?action=clear_log' class='btn btn-danger'>🗑️ ล้างไฟล์ล็อกขยะ (Clear laravel.log)</a>
        <a href='/backend/public/db-test.php' class='btn' style='background-color: #64748b;'>📊 ไปที่หน้าทดสอบ DB</a>
      </div>";

// Read Log File
$logFile = __DIR__ . '/../storage/logs/laravel.log';

// Try standard relative path or detect it
if (!file_exists($logFile)) {
    // Attempt standard Laravel structure
    $logFile = __DIR__ . '/../storage/logs/laravel.log';
}

echo "<h2>รายละเอียดความผิดพลาดล่าสุดในระบบ (Laravel Logs):</h2>";

if (file_exists($logFile)) {
    $fileSize = filesize($logFile);
    if ($fileSize === 0) {
        echo "<div style='background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 20px; border-radius: 12px;'>
                <strong>ไม่มี Log บันทึกความผิดพลาด:</strong> ล็อกไฟล์ว่างเปล่า (ไม่มีความขัดข้องระบบสะสมอยู่)
              </div>";
    } else {
        // Read last 20KB of the log file to avoid loading huge logs into memory
        $readBytes = min($fileSize, 50000);
        $fp = fopen($logFile, 'r');
        fseek($fp, -$readBytes, SEEK_END);
        $rawLog = fread($fp, $readBytes);
        fclose($fp);
        
        // Parse the log blocks
        $entries = preg_split('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/i', $rawLog, -1, PREG_SPLIT_DELIM_CAPTURE);
        
        echo "<pre>";
        if (count($entries) <= 1) {
            echo htmlspecialchars($rawLog);
        } else {
            // Render parsed blocks in reverse order (most recent first)
            $logBlocks = [];
            for ($i = 1; $i < count($entries); $i += 2) {
                $time = $entries[$i];
                $content = $entries[$i + 1] ?? '';
                
                // Determine level
                $level = 'local.ERROR';
                if (preg_match('/([a-z]+)\.(debug|info|notice|warning|error|critical|alert|emergency)/i', $content, $lvlMatches)) {
                    $level = $lvlMatches[2];
                }
                
                $logBlocks[] = [
                    'time' => $time,
                    'level' => $level,
                    'content' => $content
                ];
            }
            
            // Show last 30 entries (most recent first)
            $recentBlocks = array_slice(array_reverse($logBlocks), 0, 30);
            foreach ($recentBlocks as $block) {
                $lvlClass = 'level-' . strtolower($block['level']);
                echo "<div class='log-entry'>";
                echo "[<span class='log-time'>{$block['time']}</span>] ";
                echo "<span class='log-level {$lvlClass}'>{$block['level']}</span>";
                echo htmlspecialchars($block['content']);
                echo "</div>";
            }
        }
        echo "</pre>";
    }
} else {
    echo "<div style='background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 20px; border-radius: 12px;'>
            <strong>ไม่พบไฟล์ล็อกหลัก:</strong> ไม่พบไฟล์ที่พิกัด <code>" . htmlspecialchars($logFile) . "</code><br>
            <span style='font-size: 13px; opacity: 0.9;'>เซิร์ฟเวอร์ยังไม่มีข้อความขัดข้องของ Laravel ถูกบันทึกไว้ในโฟลเดอร์เก็บข้อมูล</span>
          </div>";
}

echo "
    <div class='footer'>
        วิทยาลัยเทคโนโลยีศรีราชา (STC) - แฟ้มวิเคราะห์และอ่านประวัติข้อบกพร่องระบบหน้างานจริง
    </div>
</div>
</body>
</html>";
