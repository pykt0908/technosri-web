<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteSettingController extends Controller
{
    /**
     * Get all settings (Public)
     */
    public function index()
    {
        $settings = SiteSetting::all();
        // Convert to key-value object for easy use on frontend
        $formatted = $settings->pluck('value', 'key');
        return response()->json($formatted);
    }

    /**
     * Get all settings with metadata (Admin)
     */
    public function adminIndex()
    {
        return response()->json(SiteSetting::orderBy('group')->get());
    }

    /**
     * Update settings in bulk
     */
    public function updateBulk(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|exists:site_settings,key',
            'settings.*.value' => 'nullable'
        ]);

        foreach ($data['settings'] as $item) {
            SiteSetting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Upload setting file (e.g. QR Code)
     */
    public function uploadFile(Request $request)
    {
        $request->validate([
            'key' => 'required|exists:site_settings,key',
            'file' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048'
        ]);

        $setting = SiteSetting::where('key', $request->key)->first();
        
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($setting->value) {
                Storage::disk('public')->delete($setting->value);
            }
            
            $file = $request->file('file');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $slugName = \Illuminate\Support\Str::slug($originalName);
            if (empty($slugName)) {
                $slugName = 'setting';
            }
            
            $filename = $slugName . '.webp';
            $counter = 1;

            while (Storage::disk('public')->exists('settings/' . $filename)) {
                $filename = $slugName . '-' . $counter . '.webp';
                $counter++;
            }
            $path = 'settings/' . $filename;

            // Convert to WebP using GD
            $imageInfo = getimagesize($file);
            $mime = $imageInfo['mime'];

            switch ($mime) {
                case 'image/jpeg': $image = imagecreatefromjpeg($file); break;
                case 'image/png': $image = imagecreatefrompng($file); break;
                case 'image/webp': $image = imagecreatefromwebp($file); break;
                case 'image/gif': $image = imagecreatefromgif($file); break;
                default: return response()->json(['message' => 'Unsupported image type'], 422);
            }

            // Handle transparency
            if ($mime === 'image/png' || $mime === 'image/webp') {
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
            }

            // Save as WebP to temporary path
            $tempPath = tempnam(sys_get_temp_dir(), 'webp_setting');
            imagewebp($image, $tempPath, 80);
            imagedestroy($image);

            // Upload to storage
            Storage::disk('public')->put($path, file_get_contents($tempPath));
            unlink($tempPath);

            $setting->update(['value' => $path]);
        }

        return response()->json([
            'message' => 'File uploaded successfully',
            'path' => $path
        ]);
    }
}
