<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $col) {
            $col->id();
            $col->string('key')->unique();
            $col->text('value')->nullable();
            $col->string('group')->default('general'); // เพื่อจัดหมวดหมู่ เช่น recruitment, social, enrollment
            $col->string('label')->nullable(); // ชื่อที่แสดงในหน้า Admin เช่น "ลิงก์สมัครเรียน"
            $col->string('type')->default('text'); // text, textarea, file
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
