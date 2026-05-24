<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// Temporary Route for Shared Hosting Database Migration
Route::get('/run-migration', function () {
    try {
        $exitCode = Artisan::call('migrate', ['--force' => true]);
        return '<h2>Database Migrated Successfully!</h2><p>Exit Code: ' . $exitCode . '</p><pre>' . Artisan::output() . '</pre>';
    } catch (\Exception $e) {
        return '<h2>Error occurred:</h2><p>' . $e->getMessage() . '</p>';
    }
});
