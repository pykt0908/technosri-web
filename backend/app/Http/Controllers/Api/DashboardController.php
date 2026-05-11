<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'stats' => [
                [ 'label' => 'นักเรียนทั้งหมด', 'value' => '1,250', 'color' => 'bg-blue-500', 'icon' => 'fas fa-user-graduate' ],
                [ 'label' => 'หลักสูตรที่เปิดสอน', 'value' => '12', 'color' => 'bg-green-500', 'icon' => 'fas fa-book' ],
                [ 'label' => 'ยอดสมัครเรียนใหม่', 'value' => '45', 'color' => 'bg-purple-500', 'icon' => 'fas fa-user-plus' ],
                [ 'label' => 'ผู้เข้าชมวันนี้', 'value' => '320', 'color' => 'bg-orange-500', 'icon' => 'fas fa-eye' ],
            ],
            'recent_applications' => [
                [ 'name' => 'สมชาย รักเรียน', 'program' => 'ช่างยนต์', 'date' => '10 พ.ค. 2026', 'status' => 'รอตรวจสอบ', 'statusColor' => 'text-orange-500' ],
                [ 'name' => 'สมหญิง ขยันหมั่นเพียร', 'program' => 'ไอที', 'date' => '09 พ.ค. 2026', 'status' => 'เรียบร้อย', 'statusColor' => 'text-green-500' ],
                [ 'name' => 'มงคล มีชัย', 'program' => 'การตลาด', 'date' => '08 พ.ค. 2026', 'status' => 'รอตรวจสอบ', 'statusColor' => 'text-orange-500' ],
            ]
        ]);
    }
}
