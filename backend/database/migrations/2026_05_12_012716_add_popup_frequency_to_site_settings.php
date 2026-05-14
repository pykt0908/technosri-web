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
                'key' => 'popup_frequency',
                'value' => 'once',
                'group' => 'popup',
                'label' => 'ความถี่การแสดงผล Pop-up',
                'type' => 'select_frequency',
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
        DB::table('site_settings')->where('key', 'popup_frequency')->delete();
    }
};
