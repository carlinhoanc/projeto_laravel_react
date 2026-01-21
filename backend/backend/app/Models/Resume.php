<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'personal_info',
        'social_links',
        'summary',
        'experience',
        'education',
        'licenses',
        'skills',
        'interests',
    ];

    protected $casts = [
        'personal_info' => 'array',
        'social_links' => 'array',
        'experience' => 'array',
        'education' => 'array',
        'licenses' => 'array',
        'skills' => 'array',
        'interests' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
