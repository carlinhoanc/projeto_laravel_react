<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados invalidos',
                'errors' => $validator->errors(),
            ], 422, [], JSON_UNESCAPED_UNICODE);
        }

        $data = $validator->validated();

        // Force new registrations to be regular users
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'access_level' => 'user',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados invalidos',
                'errors' => $validator->errors(),
            ], 422, [], JSON_UNESCAPED_UNICODE);
        }

        $credentials = $validator->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciais invalidas'], 401, [], JSON_UNESCAPED_UNICODE);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado']);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->access_level !== 'admin') {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $users = User::query()
            ->select(['id', 'name', 'email', 'access_level', 'created_at'])
            ->orderBy('name')
            ->get();

        return response()->json(['users' => $users]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        if ($user->access_level !== 'admin') {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        $target = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($target->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'access_level' => ['sometimes', Rule::in(['admin', 'user'])],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Dados invalidos', 'errors' => $validator->errors()], 422, [], JSON_UNESCAPED_UNICODE);
        }

        $data = $validator->validated();

        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $target->update($data);

        return response()->json(['user' => $target]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        if ($user->access_level !== 'admin') {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        if ((string)$user->id === (string)$id) {
            return response()->json(['message' => 'Nao e possivel deletar voce mesmo'], 400);
        }

        $target = User::findOrFail($id);
        $target->delete();

        return response()->json(['message' => 'Usuario deletado']);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Dados invalidos', 'errors' => $validator->errors()], 422, [], JSON_UNESCAPED_UNICODE);
        }

        $data = $validator->validated();

        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json(['user' => $user]);
    }
}
