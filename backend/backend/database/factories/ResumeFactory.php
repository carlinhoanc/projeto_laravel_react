<?php

namespace Database\Factories;

use App\Models\Resume;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResumeFactory extends Factory
{
    protected $model = Resume::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'personal_info' => [
                'name' => $this->faker->name,
                'email' => $this->faker->safeEmail,
                'phone' => '123456789',
                'city' => $this->faker->city,
                'country' => $this->faker->country,
            ],
            'social_links' => [],
            'summary' => $this->faker->paragraph,
            'experience' => [],
            'education' => [],
            'licenses' => [],
            'skills' => ['PHP', 'Laravel'],
            'interests' => ['Testing'],
        ];
    }
}
