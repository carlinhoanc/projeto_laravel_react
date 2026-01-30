<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'photo_path',
        'photo_blob',
        'sidebar_bg_color',
        'sidebar_text_color',
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

    protected $hidden = ['photo_blob'];

    protected $appends = ['photo_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        // Se há blob, converter para data URL
        if ($this->photo_blob) {
            $mimeType = 'image/jpeg'; // Assumir JPEG por padrão
            $base64 = base64_encode($this->photo_blob);
            return "data:{$mimeType};base64,{$base64}";
        }
        // Senão, usar arquivo de storage
        return $this->photo_path ? Storage::disk('public')->url($this->photo_path) : null;
    }
}
