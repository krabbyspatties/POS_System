<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IncreaseUploadLimits
{
    public function handle(Request $request, Closure $next)
    {
        // Increase limits for receipt upload routes
        if ($request->is('api/saveReceipt')) {
            ini_set('upload_max_filesize', '25M');
            ini_set('post_max_size', '25M');
            ini_set('max_execution_time', '300');
            ini_set('memory_limit', '256M');
        }

        return $next($request);
    }
}
