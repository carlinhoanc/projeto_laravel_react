<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UpdateResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function all($keys = null)
    {
        $all = parent::all($keys);

        // Log raw request data
        Log::info('UpdateResumeRequest::all()', [
            'method' => $this->method(),
            'content_type' => $this->header('Content-Type'),
            'all_count' => count($all),
            'post_vars' => count($_POST),
            'files_count' => count($_FILES),
            'has_method_field' => isset($_POST['_method']),
            'input_keys' => array_keys($all),
        ]);

        return $all;
    }

    protected function prepareForValidation(): void
    {
        // Debug $_FILES
        Log::info('$_FILES content', ['files' => $_FILES]);

        // Log photo file info
        if ($this->hasFile('photo')) {
            $file = $this->file('photo');
            Log::info('Photo file received', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'is_valid' => $file->isValid(),
                'error' => $file->getError(),
                'error_code' => $file->getError(),
            ]);
        } else {
            Log::warning('hasFile(photo) returned false', [
                'has_photo_input' => $this->has('photo'),
                'photo_value' => $this->input('photo'),
            ]);
        }

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
            if (is_string($value) && !empty($value)) {
                try {
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $toMerge[$field] = $decoded;
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to decode JSON field', ['field' => $field, 'error' => $e->getMessage()]);
                }
            }
        }

        if (!empty($toMerge)) {
            $this->merge($toMerge);
            Log::info('Merged JSON fields', ['fields' => array_keys($toMerge)]);
        }
    }

    public function rules(): array
    {
        return [
            'personal_info' => 'nullable|array',
            'personal_info.name' => 'nullable|string|max:255',
            'personal_info.email' => 'nullable|email:rfc',
            'personal_info.phone' => 'nullable|string|max:50',
            'personal_info.city' => 'nullable|string|max:255',
            'personal_info.country' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
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
