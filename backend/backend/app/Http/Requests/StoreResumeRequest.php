<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class StoreResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function all($keys = null)
    {
        $all = parent::all($keys);
        Log::info('StoreResumeRequest::all() called', ['all_data' => $all, 'method' => $this->method()]);
        return $all;
    }

    protected function prepareForValidation(): void
    {
        // Log photo file info
        if ($this->hasFile('photo')) {
            $file = $this->file('photo');
            Log::info('Photo file received on store', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'is_valid' => $file->isValid(),
                'error' => $file->getError(),
            ]);
        }

        Log::info('StoreResumeRequest::prepareForValidation() - input before', ['input' => $this->input()]);

        $jsonFields = [
            'personal_info',
            'social_links',
            'experience',
            'education',
            'licenses',
            'skills',
            'interests',
        ];

        $toMerge = [];
        foreach ($jsonFields as $field) {
            $value = $this->input($field);
            Log::info('Checking field', ['field' => $field, 'value' => $value, 'is_string' => is_string($value)]);
            if (is_string($value) && !empty($value)) {
                try {
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $toMerge[$field] = $decoded;
                    }
                } catch (\Exception $e) {
                    // Se não conseguir desserializar, deixa como está
                    Log::error('Failed to decode JSON field', ['field' => $field, 'error' => $e->getMessage()]);
                }
            }
        }

        if (!empty($toMerge)) {
            $this->merge($toMerge);
            Log::info('Merged JSON fields', ['fields' => array_keys($toMerge)]);
        }

        Log::info('StoreResumeRequest::prepareForValidation() - after merge', ['merged_data' => $this->all()]);
    }

    public function rules(): array
    {
        return [
            'personal_info' => 'nullable|array',
            'personal_info.name' => 'nullable|string|max:255',
            'personal_info.email' => 'nullable|email:rfc,dns',
            'personal_info.phone' => 'nullable|string|max:50',
            'personal_info.city' => 'nullable|string|max:255',
            'personal_info.country' => 'nullable|string|max:255',
            'photo' => 'nullable|file|max:20480',
            'social_links' => 'nullable|array',
            'social_links.*' => 'nullable|string',
            'summary' => 'nullable|string',
            'experience' => 'nullable|array',
            'experience.*.company' => 'nullable|string|max:255',
            'experience.*.period_start' => 'nullable|string',
            'experience.*.period_end' => 'nullable|string',
            'experience.*.location' => 'nullable|string|max:255',
            'experience.*.description' => 'nullable|string',
            'education' => 'nullable|array',
            'education.*.institution' => 'nullable|string|max:255',
            'education.*.diploma' => 'nullable|string|max:255',
            'education.*.area' => 'nullable|string|max:255',
            'education.*.period' => 'nullable|string|max:255',
            'sidebar_bg_color' => 'nullable|string|max:20',
            'sidebar_text_color' => 'nullable|string|max:20',
            'licenses' => 'nullable|array',
            'licenses.*.name' => 'nullable|string|max:255',
            'licenses.*.issuer' => 'nullable|string|max:255',
            'licenses.*.issued_at' => 'nullable|string',
            'licenses.*.url' => 'nullable|string',
            'skills' => 'nullable|array',
            'skills.*' => 'nullable|string|max:100',
            'interests' => 'nullable|array',
            'interests.*' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'photo.file' => 'The photo must be a file.',
            'photo.max' => 'The photo may not be greater than 20 MB.',
        ];
    }
}
