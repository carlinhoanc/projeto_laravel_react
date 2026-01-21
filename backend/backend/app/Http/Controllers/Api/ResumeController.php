<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResumeRequest;
use App\Http\Requests\UpdateResumeRequest;
use App\Models\Resume;
use Illuminate\Http\Request;

class ResumeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return Resume::with('user')->paginate(20);
        }

        return Resume::where('user_id', $user->id)->with('user')->paginate(20);
    }

    public function store(StoreResumeRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $resume = Resume::create($data);

        return response()->json($resume, 201);
    }

    public function show(Resume $resume)
    {
        $this->authorize('view', $resume);
        return $resume->load('user');
    }

    public function update(UpdateResumeRequest $request, Resume $resume)
    {
        $this->authorize('update', $resume);
        $resume->update($request->validated());
        return $resume;
    }

    public function destroy(Request $request, Resume $resume)
    {
        $this->authorize('delete', $resume);
        $resume->delete();
        return response()->noContent();
    }
}
