<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class RecieptController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'receipt_pdf' => 'required|file|mimes:pdf|max:20480',
                'email' => 'required|email',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'total' => 'required|numeric',
            ]);

            $file = $request->file('receipt_pdf');

            $fileSizeInMB = $file->getSize() / 1024 / 1024;
            \Log::info("Uploading PDF file: {$file->getClientOriginalName()}, Size: {$fileSizeInMB}MB");

            $filename = 'receipt_' . uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();

            try {
                $path = $file->storeAs('receipts', $filename, 'public');
                $pdfUrl = url(Storage::url($path));

                \Log::info("PDF stored successfully at: {$path}");
            } catch (\Exception $storageException) {
                \Log::error('File storage failed: ' . $storageException->getMessage());
                return response()->json([
                    'message' => 'Failed to store receipt file.',
                    'error' => 'Storage error: ' . $storageException->getMessage(),
                ], 500);
            }

            $makeWebhookUrl = env('MAKE_WEBHOOK_URL');
            if (!$makeWebhookUrl) {
                \Log::warning('Make.com webhook URL is not configured.');
                return response()->json([
                    'message' => 'Receipt saved successfully, but webhook URL is not configured.',
                    'url' => $pdfUrl,
                    'file_size_mb' => round($fileSizeInMB, 2),
                ], 200);
            }

            
            try {
                $response = Http::withOptions([
                    'verify' => false,
                    'timeout' => 60,
                    'connect_timeout' => 30,
                ])->post($makeWebhookUrl, [
                    'pdf_url' => $pdfUrl,
                    'email' => $request->email,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'total' => $request->total,
                    'file_size_mb' => round($fileSizeInMB, 2),
                ]);

                \Log::info('Make.com webhook response status: ' . $response->status());
                \Log::info('Make.com webhook response body: ' . $response->body());

                if ($response->failed()) {
                    \Log::error('Make.com webhook failed with status: ' . $response->status() . ', body: ' . $response->body());
                    return response()->json([
                        'message' => 'Receipt saved, but failed to send to Make.com.',
                        'url' => $pdfUrl,
                        'file_size_mb' => round($fileSizeInMB, 2),
                        'webhook_status' => $response->status(),
                        'webhook_response' => $response->body(),
                    ], 200);
                }

                \Log::info('Make.com webhook sent successfully');
                return response()->json([
                    'message' => 'Receipt saved and sent to customer successfully.',
                    'url' => $pdfUrl,
                    'file_size_mb' => round($fileSizeInMB, 2),
                ]);
            } catch (\Exception $webhookException) {
                \Log::error('Make.com webhook exception: ' . $webhookException->getMessage());
                return response()->json([
                    'message' => 'Receipt saved, but failed to send to Make.com.',
                    'url' => $pdfUrl,
                    'file_size_mb' => round($fileSizeInMB, 2),
                    'error' => $webhookException->getMessage(),
                ], 200);
            }
        } catch (ValidationException $e) {
            \Log::error('Validation failed: ' . json_encode($e->errors()));

            if (isset($e->errors()['receipt_pdf'])) {
                foreach ($e->errors()['receipt_pdf'] as $error) {
                    if (strpos($error, 'greater than') !== false) {
                        return response()->json([
                            'message' => 'File size too large. Maximum allowed size is 20MB.',
                            'error' => 'Please compress your PDF or use a smaller file.',
                            'max_size_mb' => 20,
                        ], 422);
                    }
                }
            }

            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Receipt saving failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to save receipt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
