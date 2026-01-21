<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@sistema.com',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        // Create 5 normal users
        User::factory(5)->create()->each(function ($user) {
            // Optionally create a sample resume for each user
            \App\Models\Resume::create([
                'user_id' => $user->id,
                'personal_info' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => '123456789',
                    'city' => 'Cidade',
                    'country' => 'Brasil',
                ],
                'social_links' => [
                    'https://github.com/example',
                ],
                'summary' => 'Este é um resumo de exemplo para o usuário ' . $user->name,
                'experience' => [],
                'education' => [],
                'licenses' => [],
                'skills' => ['PHP', 'Laravel', 'JavaScript'],
                'interests' => ['Open Source', 'Música'],
            ]);
        });
    }
}
