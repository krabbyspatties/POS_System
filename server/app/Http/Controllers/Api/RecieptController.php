<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class RecieptController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'receipt_pdf' => 'required|file|mimes:pdf|max:5120',
                'email' => 'required|email',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'total' => 'required|numeric',
            ]);

            // Save the file first
            $file = $request->file('receipt_pdf');
            $filename = 'receipt_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('receipts', $filename, 'public');
            $pdfUrl = url(Storage::url($path));

            // Return early if Make webhook is not configured
            $makeWebhookUrl = env('MAKE_WEBHOOK_URL');
            if (!$makeWebhookUrl) {
                \Log::warning('Make.com webhook URL is not configured.');
                return response()->json([
                    'message' => 'Receipt saved successfully, but webhook URL is not configured.',
                    'url' => $pdfUrl,
                ], 200);
            }

            // Try to send to Make.com with SSL verification disabled
            try {
                $response = Http::withOptions([
                    'verify' => false, // Disable SSL verification
                    'timeout' => 30,
                ])->post($makeWebhookUrl, [
                            'pdf_url' => $pdfUrl,
                            'email' => $request->email,
                            'first_name' => $request->first_name,
                            'last_name' => $request->last_name,
                            'total' => $request->total,
                        ]);

                \Log::info('Make.com webhook response status: ' . $response->status());
                \Log::info('Make.com webhook response body: ' . $response->body());

                if ($response->failed()) {
                    \Log::error('Make.com webhook failed with status: ' . $response->status() . ', body: ' . $response->body());
                    return response()->json([
                        'message' => 'Receipt saved, but failed to send to Make.com.',
                        'url' => $pdfUrl,
                        'webhook_status' => $response->status(),
                        'webhook_response' => $response->body(),
                    ], 200);
                }

                \Log::info('Make.com webhook sent successfully');
                return response()->json([
                    'message' => 'Receipt saved and sent to customer.',
                    'url' => $pdfUrl,
                ]);
            } catch (\Exception $e) {
                \Log::error('Make.com webhook exception: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Receipt saved, but failed to send to Make.com.',
                    'url' => $pdfUrl,
                    'error' => $e->getMessage(),
                ], 200);
            }
        } catch (\Exception $e) {
            \Log::error('Receipt saving failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to save receipt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}