<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;


// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Requires Laravel Sanctum Token)
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Todo API Resource Routes (Index, Store, Show, Update, Destroy)
    Route::apiResource('todos', TodoController::class);
});
