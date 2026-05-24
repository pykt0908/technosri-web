<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolStatistic extends Model
{
    use HasFactory;

    protected $table = 'school_statistics';

    protected $fillable = [
        'year',
        'students_pvc',
        'students_pvs',
        'classrooms',
        'executives',
        'teachers',
        'academic_staff',
        'other_staff',
        'as_of_date'
    ];

    protected $casts = [
        'year' => 'integer',
        'students_pvc' => 'integer',
        'students_pvs' => 'integer',
        'classrooms' => 'integer',
        'executives' => 'integer',
        'teachers' => 'integer',
        'academic_staff' => 'integer',
        'other_staff' => 'integer',
        'as_of_date' => 'date:Y-m-d'
    ];
}
