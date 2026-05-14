<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'sort_order'];

    public function personnel()
    {
        return $this->hasMany(Personnel::class)->orderBy('sort_order', 'asc');
    }
}
