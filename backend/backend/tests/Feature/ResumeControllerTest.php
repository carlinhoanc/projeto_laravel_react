<?php

namespace Tests\Feature;

use App\Models\Resume;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResumeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_all_resumes()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        Resume::factory()->create(['user_id' => $user->id]);
        Resume::factory()->create(['user_id' => $user->id]);

        $this->actingAs($admin, 'sanctum');
        $res = $this->getJson('/api/resumes');
        $res->assertStatus(200);
        $this->assertGreaterThanOrEqual(2, count($res->json('data')));
    }

    public function test_user_sees_only_their_resumes()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Resume::factory()->create(['user_id' => $user->id]);
        Resume::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user, 'sanctum');
        $res = $this->getJson('/api/resumes');
        $res->assertStatus(200);
        $data = $res->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($user->id, $data[0]['user_id']);
    }
}
