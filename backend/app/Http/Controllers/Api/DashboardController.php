<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\VisitorLog;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = now()->startOfDay();
        $last7Days = now()->subDays(6)->startOfDay();

        // Overview
        $totalViews = VisitorLog::count();
        $todayViews = VisitorLog::where('created_at', '>=', $today)->count();
        $uniqueVisitors = VisitorLog::distinct('ip_address')->count('ip_address');
        
        // Chart Data (Last 7 Days)
        $chartCategories = [];
        $visitorsData = [];
        $pageViewsData = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $chartCategories[] = $date->format('D');
            
            $dayStart = $date->copy()->startOfDay();
            $dayEnd = $date->copy()->endOfDay();
            
            $pageViewsData[] = VisitorLog::whereBetween('created_at', [$dayStart, $dayEnd])->count();
            $visitorsData[] = VisitorLog::whereBetween('created_at', [$dayStart, $dayEnd])->distinct('ip_address')->count('ip_address');
        }

        // Devices
        $devices = VisitorLog::selectRaw('device_type, count(*) as count')
            ->groupBy('device_type')
            ->get();
        
        $deviceLabels = [];
        $deviceSeries = [];
        foreach ($devices as $d) {
            $deviceLabels[] = ucfirst($d->device_type);
            $deviceSeries[] = $d->count;
        }

        $pagesPerVisit = $uniqueVisitors > 0 ? round($totalViews / $uniqueVisitors, 1) : 0;

        return response()->json([
            'overview' => [
                [ 'label' => 'ยอดเข้าชมทั้งหมด', 'value' => number_format($totalViews), 'trend' => '+'.number_format($todayViews).' วันนี้', 'icon' => 'fas fa-eye', 'color' => 'bg-blue-500' ],
                [ 'label' => 'จำนวนผู้เข้าชม', 'value' => number_format($uniqueVisitors), 'trend' => 'IP Tracking', 'icon' => 'fas fa-user-shield', 'color' => 'bg-green-500' ],
                [ 'label' => 'ยอดวิววันนี้', 'value' => number_format($todayViews), 'trend' => 'Live', 'icon' => 'fas fa-bolt', 'color' => 'bg-purple-500' ],
                [ 'label' => 'ยอดวิวเฉลี่ยต่อคน', 'value' => $pagesPerVisit, 'trend' => 'Pages/Visit', 'icon' => 'fas fa-file-alt', 'color' => 'bg-orange-500' ],
            ],
            'chart_data' => [
                'categories' => $chartCategories,
                'visitors' => $visitorsData,
                'pageviews' => $pageViewsData,
            ],
            'devices' => [
                'labels' => !empty($deviceLabels) ? $deviceLabels : ['Desktop'],
                'series' => !empty($deviceSeries) ? $deviceSeries : [100]
            ],
            'top_pages' => VisitorLog::select('page_url')
                ->selectRaw('count(*) as count')
                ->groupBy('page_url')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get()
        ]);
    }
}
