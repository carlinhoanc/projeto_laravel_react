<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'index']);

    // User management
    Route::put('/users/{id}', [AuthController::class, 'update']);
    Route::patch('/users/{id}', [AuthController::class, 'update']);
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);

    // Profile update
    Route::patch('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Resume resource routes
    Route::apiResource('resumes', \App\Http\Controllers\Api\ResumeController::class);
    // Allow POST with _method=PUT for FormData updates
    Route::post('/resumes/{resume}', [\App\Http\Controllers\Api\ResumeController::class, 'update']);
});
