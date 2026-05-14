<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'amount',
        'education_level',
        'qualifications',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
