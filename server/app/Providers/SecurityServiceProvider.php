<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;

class SecurityServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if (App::environment('production')) {
            URL::forceScheme('https');
        }

        // Set default string length for MySQL older than 5.7.7
        Schema::defaultStringLength(191);

        // Configure database to prevent SQL injection
        DB::listen(function ($query) {
            // Log potentially dangerous queries (for monitoring)
            $sql = $query->sql;
            if (
                stripos($sql, 'DELETE FROM') !== false ||
                stripos($sql, 'DROP TABLE') !== false ||
                stripos($sql, 'TRUNCATE') !== false
            ) {
                \Illuminate\Support\Facades\Log::warning('Potentially dangerous query detected', [
                    'sql' => $sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time,
                ]);
            }
        });

        // Configure session security
        config([
            'session.secure' => App::environment('production'),
            'session.http_only' => true,
            'session.same_site' => 'lax',
            'session.encrypt' => true,
        ]);

        // Configure cookie security
        config([
            'session.cookie' => 'pos_session',
            'session.lifetime' => 120, // 2 hours
        ]);
    }
}
