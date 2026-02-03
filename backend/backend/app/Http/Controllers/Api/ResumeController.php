<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResumeRequest;
use App\Http\Requests\UpdateResumeRequest;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $page = $request->get('page', 1);

        // Set cache headers for API responses (5 minutes)
        $cacheMinutes = 5;

        if ($user->isAdmin()) {
            $resumes = Resume::with('user')->paginate(20);
        } else {
            $resumes = Resume::where('user_id', $user->id)->with('user')->paginate(20);
        }

        return response()->json($resumes)
            ->header('Cache-Control', "private, max-age=" . ($cacheMinutes * 60));
    }

    public function store(StoreResumeRequest $request)
    {
        Log::info('Store request all inputs', ['all_inputs' => $request->all()]);

        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        // Remover campos que não devem ser salvos no banco
        unset($data['photo_path']);
        unset($data['photo_url']);

        Log::info('Creating resume', ['data_keys' => array_keys($data), 'user_id' => $data['user_id'], 'data' => $data]);

        if ($request->hasFile('photo')) {
            // Salvar como blob no banco
            $file = $request->file('photo');
            $photoData = file_get_contents($file->getRealPath());
            $data['photo_blob'] = $photoData;
            Log::info('Photo stored as blob', ['size' => strlen($photoData)]);
        }

        $resume = Resume::create($data);
        Log::info('Resume created', ['resume_id' => $resume->id]);

        return response()->json($resume->fresh(), 201);
    }

    public function show(Resume $resume)
    {
        $this->authorize('view', $resume);
        return response()->json($resume->load('user'))
            ->header('Cache-Control', 'private, max-age=300'); // 5 minutes
    }

    public function update(UpdateResumeRequest $request, Resume $resume)
    {
        $this->authorize('update', $resume);

        Log::info('ResumeController::update() entry', [
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'has_files' => count($_FILES) > 0,
            'post_vars_count' => count($_POST),
        ]);

        $validated = $request->validated();

        Log::info('After validation', ['validated_keys' => array_keys($validated)]);

        // Apenas admin pode alterar o user_id
        if (isset($validated['user_id'])) {
            if (Auth::user()->access_level !== 'admin') {
                unset($validated['user_id']);
                Log::warning('Non-admin tried to change user_id');
            } else {
                Log::info('Admin changing resume owner', ['new_user_id' => $validated['user_id']]);
            }
        }

        // Remover campos que não devem ser salvos no banco
        unset($validated['photo_path']);
        unset($validated['photo_url']);

        if ($request->hasFile('photo')) {
            if ($resume->photo_path) {
                Storage::disk('public')->delete($resume->photo_path);
            }
            // Salvar como blob no banco
            $file = $request->file('photo');
            $photoData = file_get_contents($file->getRealPath());
            $validated['photo_blob'] = $photoData;
            Log::info('Photo saved as blob', ['size' => strlen($photoData)]);
        }

        $resume->update($validated);
        Log::info('Resume updated', ['resume_id' => $resume->id, 'updated_fields' => array_keys($validated)]);
        return response()->json($resume->fresh());
    }

    public function destroy(Request $request, Resume $resume)
    {
        $this->authorize('delete', $resume);
        $resume->delete();
        return response()->noContent();
    }
}
