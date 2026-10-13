<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use App\Services\UserService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;
    protected $userService;

    public function __construct() {
        $this->authService = new AuthService();
        $this->userService = new UserService();
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());
        return response()->json($result, 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();
        try {
            $result = $this->authService->login(
                $validated['email'], 
                $validated['password']
            );
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ],  $e->getCode() ?: 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $this->authService->me($request->user() ? $request->user()->id : null);
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getCode() ?: 401);
        }
    }

    public function updateAvatar(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            if (!$request->hasFile('avatar')) {
                return response()->json(['message' => 'No avatar file uploaded'], 422);
            }

            $avatarFile = $request->file('avatar');
            $updatedUser = $this->userService->updateAvatar($user->id, $avatarFile);

            return response()->json([
                'message' => 'Avatar updated successfully',
                'data' => $updatedUser
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode() ?: 500);
        }
    }

    public function logout(Request $request)
    {
        $result = $this->authService->logout($request);
        return response()->json($result);
    }
}