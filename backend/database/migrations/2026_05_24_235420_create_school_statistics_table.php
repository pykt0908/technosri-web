<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_statistics', function (Blueprint $table) {
            $table->id();
            $table->integer('year')->unique(); // ปีการศึกษา พ.ศ. (เช่น 2569)
            $table->integer('students_pvc')->default(0); // นักเรียน ปวช.
            $table->integer('students_pvs')->default(0); // นักศึกษา ปวส.
            $table->integer('classrooms')->default(0); // ห้องเรียน
            $table->integer('executives')->default(0); // ผู้บริหาร
            $table->integer('teachers')->default(0); // ครู
            $table->integer('academic_staff')->default(0); // บุคลากรทางการศึกษา
            $table->integer('other_staff')->default(0); // บุคลากรอื่นๆ
            $table->date('as_of_date'); // ข้อมูล ณ วันที่
            $table->timestamps();
        });

        // Seed the initial data for 2569 matching the user's screenshot
        DB::table('school_statistics')->insert([
            'year' => 2569,
            'students_pvc' => 420,
            'students_pvs' => 486,
            'classrooms' => 56,
            'executives' => 1,
            'teachers' => 33,
            'academic_staff' => 1,
            'other_staff' => 7,
            'as_of_date' => '2026-05-24', // 24 พ.ค. 69
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_statistics');
    }
};
