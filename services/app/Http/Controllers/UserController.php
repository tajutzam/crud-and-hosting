<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Get user profile with addresses and transaction history
     */
    public function profile(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Get user addresses
            $addresses = UserAddress::where('user_id', $user->id)
                ->orderBy('label', 'desc')
                ->get(['id', 'recipient_name', 'phone', 'label', 'address_line', 'city', 'province', 'district', 'sub_district', 'postal_code'])
                ->map(function ($address) {
                    return [
                        'id' => $address->id,
                        'name' => $address->recipient_name,
                        'label' => $address->label,
                        'phone' => $address->phone,
                        'street' => $address->address_line,
                        'city' => $address->city,
                        'province' => $address->province,
                        'district' => $address->district,
                        'subDistrict' => $address->sub_district,
                        'postalCode' => $address->postal_code,
                        'isPrimary' => $address->label === 'primary',
                        'fullAddress' => $address->address_line . ', ' . $address->district . ', ' . $address->city . ', ' . $address->province . ' ' . $address->postal_code
                    ];
                });

            // Get user orders (transaction history)
            $orders = Order::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(10) // Limit to last 10 transactions
                ->get(['id', 'transaction_id', 'total_amount', 'status', 'created_at'])
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'transactionId' => $order->transaction_id,
                        'amount' => (int)$order->total_amount,
                        'status' => $this->mapStatus($order->status),
                        'date' => $order->created_at->format('d M Y'),
                        'fullDate' => $order->created_at->format('d M Y, H:i')
                    ];
                });

            // Calculate total spent
            $totalSpent = Order::where('user_id', $user->id)
                ->where('status', 'completed')
                ->sum('total_amount');

            // Get order counts by status
            $orderStats = [
                'total' => Order::where('user_id', $user->id)->count(),
                'completed' => Order::where('user_id', $user->id)->where('status', 'completed')->count(),
                'processing' => Order::where('user_id', $user->id)->where('status', 'processing')->count(),
                'pending' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
            ];

            // Format response
            $response = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profilePicture' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'dateOfBirth' => $user->date_of_birth ? date('d F Y', strtotime($user->date_of_birth)) : null,
                'phone' => $user->phone,
                'memberSince' => $user->created_at->format('d F Y'),
                'totalSpent' => (int)$totalSpent,
                'orderStats' => $orderStats,
                'addresses' => $addresses,
                'transactions' => $orders,
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load profile data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'date_of_birth' => 'sometimes|date',
            ]);

            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }
            
            if (isset($validated['phone'])) {
                $user->phone = $validated['phone'];
            }
            
            if (isset($validated['date_of_birth'])) {
                $user->date_of_birth = $validated['date_of_birth'];
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'dateOfBirth' => $user->date_of_birth ? date('d F Y', strtotime($user->date_of_birth)) : null,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Map database status to frontend status
     */
    private function mapStatus($status)
    {
        $statusMap = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];

        return $statusMap[$status] ?? $status;
    }
}