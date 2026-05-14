<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VisitorLog;

class AnalyticsController extends Controller
{
    public function log(Request $request)
    {
        $ua = $request->userAgent();
        $device = 'desktop';
        
        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $ua)) {
            $device = 'tablet';
        } elseif (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', $ua)) {
            $device = 'mobile';
        }

        VisitorLog::create([
            'ip_address' => $request->ip(),
            'user_agent' => $ua,
            'page_url' => $request->input('url'),
            'device_type' => $device
        ]);

        return response()->json(['status' => 'success']);
    }
}
