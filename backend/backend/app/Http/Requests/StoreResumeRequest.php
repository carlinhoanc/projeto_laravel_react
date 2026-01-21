<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'personal_info' => 'nullable|array',
            'personal_info.name' => 'nullable|string|max:255',
            'personal_info.email' => 'nullable|email',
            'personal_info.phone' => 'nullable|string|max:50',
            'personal_info.city' => 'nullable|string|max:255',
            'personal_info.country' => 'nullable|string|max:255',
            'social_links' => 'nullable|array',
            'social_links.*' => 'nullable|url',
            'summary' => 'nullable|string',
            'experience' => 'nullable|array',
            'experience.*.company' => 'nullable|string|max:255',
            'experience.*.period_start' => 'nullable|date',
            'experience.*.period_end' => 'nullable|date',
            'experience.*.location' => 'nullable|string|max:255',
            'experience.*.description' => 'nullable|string',
            'education' => 'nullable|array',
            'education.*.institution' => 'nullable|string|max:255',
            'education.*.diploma' => 'nullable|string|max:255',
            'education.*.area' => 'nullable|string|max:255',
            'education.*.period' => 'nullable|string|max:255',
            'licenses' => 'nullable|array',
            'licenses.*.name' => 'nullable|string|max:255',
            'licenses.*.issuer' => 'nullable|string|max:255',
            'licenses.*.issued_at' => 'nullable|date',
            'licenses.*.url' => 'nullable|url',
            'skills' => 'nullable|array',
            'skills.*' => 'nullable|string|max:100',
            'interests' => 'nullable|array',
            'interests.*' => 'nullable|string|max:100',
        ];
    }
}
