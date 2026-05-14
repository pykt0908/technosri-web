<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\SiteSettingController;
use App\Http\Controllers\CarouselController;
use App\Http\Controllers\Api\AnalyticsController;

// Public Routes
Route::post('/analytics/log', [AnalyticsController::class, 'log']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/settings', [SiteSettingController::class, 'index']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/v/{slug}', [NewsController::class, 'showBySlug']); 
Route::get('/carousels/active', [CarouselController::class, 'active']);

// Public Curriculum Routes
Route::get('/curricula', [CurriculumController::class, 'index']);
Route::get('/curricula/{id}', [CurriculumController::class, 'show']);
Route::get('/curricula/v/{slug}', [CurriculumController::class, 'showBySlug']);

// Public Personnel Routes
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/personnel', [PersonnelController::class, 'index']);

// Public Job Routes
Route::get('/jobs/active', [JobPostingController::class, 'active']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    Route::apiResource('users', UserController::class);
    Route::get('/admin/news', [NewsController::class, 'adminIndex']);
    Route::post('news/upload-image', [NewsController::class, 'uploadImage']);
    
    Route::apiResource('news', NewsController::class)->except(['index']);

    // Admin Curriculum Routes
    Route::get('/admin/curricula', [CurriculumController::class, 'adminIndex']);
    Route::apiResource('curricula', CurriculumController::class)->except(['index', 'show']);

    // Admin Personnel Management
    Route::post('departments/reorder', [DepartmentController::class, 'updateOrder']); // Move this up
    Route::post('departments', [DepartmentController::class, 'store']);
    Route::put('departments/{department}', [DepartmentController::class, 'update']);
    Route::delete('departments/{department}', [DepartmentController::class, 'destroy']);

    Route::post('personnel/reorder', [PersonnelController::class, 'updateOrder']); // Move this up
    Route::post('personnel', [PersonnelController::class, 'store']);
    Route::post('personnel/{personnel}', [PersonnelController::class, 'update']); 
    Route::delete('personnel/{personnel}', [PersonnelController::class, 'destroy']);

    // Admin Job Management
    Route::post('job-postings/reorder', [JobPostingController::class, 'reorder']);
    Route::apiResource('job-postings', JobPostingController::class);
    Route::patch('job-postings/{jobPosting}/toggle', [JobPostingController::class, 'toggleStatus']);

    // Admin Carousel Management
    Route::post('carousels/reorder', [CarouselController::class, 'reorder']);
    Route::apiResource('carousels', CarouselController::class);

    // Admin Site Settings
    Route::get('/admin/settings', [SiteSettingController::class, 'adminIndex']);
    Route::post('/admin/settings/bulk', [SiteSettingController::class, 'updateBulk']);
    Route::post('/admin/settings/upload', [SiteSettingController::class, 'uploadFile']);
});
