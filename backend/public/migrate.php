<?php

/**
 * Standalone Laravel Database Migration Runner for Shared Hosting
 * Place this file in your Laravel public/ directory.
 * Access it via: http://your-domain.com/migrate.php
 */

// Set time limit to avoid execution timeouts
set_time_limit(300);

echo "<!DOCTYPE html>
<html lang='th'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Laravel Database Migration Runner</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 40px; margin: 0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
        h1 { color: #0f172a; margin-top: 0; font-size: 24px; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; }
        .status-success { color: #15803d; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; font-weight: bold; margin-bottom: 20px; }
        .status-failed { color: #b91c1c; background-color: #fef2f2; border: 1px solid #fca5a5; padding: 12px 16px; border-radius: 8px; font-weight: bold; margin-bottom: 20px; }
        pre { background-color: #0f172a; color: #38bdf8; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', Courier, monospace; font-size: 14px; line-height: 1.5; }
        .btn { display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; transition: background-color 0.2s; }
        .btn:hover { background-color: #1d4ed8; }
        .footer { margin-top: 30px; font-size: 12px; color: #64748b; text-align: center; }
    </style>
</head>
<body>
<div class='container'>
    <h1>Laravel Database Migration Runner (Shared Hosting)</h1>";

try {
    // 1. Boot Laravel Application from public path
    $autoloadPath = __DIR__.'/../vendor/autoload.php';
    $appPath = __DIR__.'/../bootstrap/app.php';

    // DYNAMIC AUTODETECT: If standard paths do not exist, parse adjacent index.php to discover custom paths
    if (!file_exists($autoloadPath) || !file_exists($appPath)) {
        $indexContent = @file_get_contents(__DIR__.'/index.php');
        if ($indexContent) {
            // Find autoload path
            if (preg_match("/require\s+(['\"])(.*?\/vendor\/autoload\.php)\\1/", $indexContent, $matches)) {
                $rawPath = $matches[2];
                $autoloadPath = str_replace('__DIR__', __DIR__, $rawPath);
            }
            // Find app path
            if (preg_match("/(?:require|require_once)\s*\(*\s*(['\"])(.*?\/bootstrap\/app\.php)\\1\s*\)*/i", $indexContent, $matches)) {
                $rawPath = $matches[2];
                $appPath = str_replace('__DIR__', __DIR__, $rawPath);
            }
        }
    }

    if (!file_exists($autoloadPath) || !file_exists($appPath)) {
        throw new \Exception("ไม่พบโครงสร้างระบบของ Laravel กรุณาตรวจสอบว่าคุณได้ทำการติดตั้ง vendor เรียบร้อยแล้ว (ตรวจสอบตำแหน่ง Autoload: " . $autoloadPath . " | Bootstrap: " . $appPath . ")");
    }

    require $autoloadPath;
    $app = require_once $appPath;

    // 2. Resolve Console Kernel
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    // 3. Create Buffered Output to fetch CLI feedback
    $output = new \Symfony\Component\Console\Output\BufferedOutput;

    // 4. Execute 'migrate' command with '--force' flag to bypass production prompt
    $status = $kernel->call('migrate', ['--force' => true], $output);

    $consoleLog = $output->fetch();

    if ($status === 0) {
        echo "<div class='status-success'>ดำเนินการอัปเดตฐานข้อมูล (Database Migration) เรียบร้อยแล้ว!</div>";
    } else {
        echo "<div class='status-failed'>เกิดข้อผิดพลาดระหว่างรันคำสั่ง (Exit Code: $status)</div>";
    }

    echo "<h3>ผลลัพธ์คำสั่ง (Console Output):</h3>";
    echo "<pre>" . htmlspecialchars($consoleLog ? $consoleLog : "ไม่มีความเปลี่ยนแปลงในฐานข้อมูล (Nothing to migrate)") . "</pre>";

} catch (\Exception $e) {
    echo "<div class='status-failed'>เกิดข้อผิดพลาดในการบูตระบบ Laravel:</div>";
    echo "<p style='font-weight: bold;'>ข้อความข้อผิดพลาด:</p>";
    echo "<p style='color: #b91c1c; font-family: monospace;'>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<h3>Trace:</h3>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "
    <a href='/' class='btn'>กลับสู่หน้าหลัก</a>
    <div class='footer'>
        วิทยาลัยเทคโนโลยีศรีราชา (STC) - แฟ้มสำหรับบริการจัดเตรียมฐานข้อมูลบนโฮสติ้งส่วนบุคคล
    </div>
</div>
</body>
</html>";
