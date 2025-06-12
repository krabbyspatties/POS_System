<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class SecurityAuditService
{
    /**
     * Log a security event
     *
     * @param string $event The event name
     * @param array $data Additional data to log
     * @param Request|null $request The request object
     * @return void
     */
    public static function log(string $event, array $data = [], Request $request = null)
    {
        if (!config('security.audit.enabled')) {
            return;
        }

        // Skip if this event type is not enabled for auditing
        if (isset(config('security.audit.events')[$event]) && !config('security.audit.events')[$event]) {
            return;
        }

        $request = $request ?? request();

        $logData = array_merge([
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => $request->user() ? $request->user()->user_id : null,
        ], $data);

        Log::channel('security')->info($event, $logData);
    }

    /**
     * Log a security warning
     *
     * @param string $event The event name
     * @param array $data Additional data to log
     * @param Request|null $request The request object
     * @return void
     */
    public static function warning(string $event, array $data = [], Request $request = null)
    {
        $request = $request ?? request();

        $logData = array_merge([
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => $request->user() ? $request->user()->user_id : null,
        ], $data);

        Log::channel('security')->warning($event, $logData);
    }

    /**
     * Log a security error
     *
     * @param string $event The event name
     * @param array $data Additional data to log
     * @param Request|null $request The request object
     * @return void
     */
    public static function error(string $event, array $data = [], Request $request = null)
    {
        $request = $request ?? request();

        $logData = array_merge([
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => $request->user() ? $request->user()->user_id : null,
        ], $data);

        Log::channel('security')->error($event, $logData);
    }
}
