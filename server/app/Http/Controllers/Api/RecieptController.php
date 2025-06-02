<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class RecieptController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'receipt_pdf' => 'required|file|mimes:pdf|max:5120',
        ]);

        $file = $request->file('receipt_pdf');
        $filename = 'receipt_' . time() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs('public/receipts', $filename);

        return response()->json([
            'message' => 'Receipt saved successfully',
            'path' => Storage::url($path),
        ]);
    }
}
