<?php

namespace App\Http\Controllers;

use App\Helpers\VerificationEncryption;
use App\Services\UserService;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    protected $userService;

    public function __construct() {
        $this->userService = new UserService();
    }

    public function verify(Request $request)
    {
        $token = $request->query('token');
        if (!$token) {
            return response()->json(['error' => 'Token is required'], 400);
        }

        try {
            $data = VerificationEncryption::decrypt($token);
            $verify = $this->userService->verifyEmail($data);

            return redirect()->away('http://localhost:5173/login');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}
