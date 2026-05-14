<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('site_settings')->insert([
            [
                'key' => 'popup_image',
                'value' => null,
                'group' => 'popup',
                'label' => 'รูปภาพ Pop-up หน้าแรก',
                'type' => 'file',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'popup_link',
                'value' => null,
                'group' => 'popup',
                'label' => 'ลิงก์ของ Pop-up',
                'type' => 'text',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'popup_active',
                'value' => '0',
                'group' => 'popup',
                'label' => 'สถานะการแสดงผล Pop-up',
                'type' => 'boolean',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', ['popup_image', 'popup_link', 'popup_active'])->delete();
    }
};
