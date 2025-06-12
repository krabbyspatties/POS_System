<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    |
    | This file contains various security settings for the POS system.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Password Policy
    |--------------------------------------------------------------------------
    */
    'password' => [
        'min_length' => 8,
        'max_length' => 15,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numeric' => true,
        'require_special_char' => true,
        'password_history' => 5, // Number of previous passwords to check against
    ],

    /*
    |--------------------------------------------------------------------------
    | Login Throttling
    |--------------------------------------------------------------------------
    */
    'login_throttling' => [
        'max_attempts' => 5,
        'decay_minutes' => 5,
    ],

    /*
    |--------------------------------------------------------------------------
    | Token Settings
    |--------------------------------------------------------------------------
    */
    'token' => [
        'expiration_hours' => 8,
        'refresh_before_expiration_minutes' => 30,
    ],

    /*
    |--------------------------------------------------------------------------
    | API Security
    |--------------------------------------------------------------------------
    */
    'api' => [
        'rate_limit' => [
            'enabled' => true,
            'max_attempts' => 60,
            'decay_minutes' => 1,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Content Security Policy
    |--------------------------------------------------------------------------
    */
    'csp' => [
        'default-src' => ["'self'"],
        'script-src' => ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src' => ["'self'", "'unsafe-inline'"],
        'img-src' => ["'self'", "data:"],
        'font-src' => ["'self'", "data:"],
        'connect-src' => ["'self'"],
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Headers
    |--------------------------------------------------------------------------
    */
    'headers' => [
        'x-content-type-options' => 'nosniff',
        'x-frame-options' => 'SAMEORIGIN',
        'x-xss-protection' => '1; mode=block',
        'referrer-policy' => 'strict-origin-when-cross-origin',
        'strict-transport-security' => 'max-age=31536000; includeSubDomains',
        'permissions-policy' => 'camera=(), microphone=(), geolocation=(), payment=()',
    ],

    /*
    |--------------------------------------------------------------------------
    | Audit Logging
    |--------------------------------------------------------------------------
    */
    'audit' => [
        'enabled' => true,
        'events' => [
            'login' => true,
            'logout' => true,
            'failed_login' => true,
            'password_reset' => true,
            'user_creation' => true,
            'user_update' => true,
            'user_deletion' => true,
            'role_change' => true,
            'order_creation' => true,
            'payment_processing' => true,
        ],
    ],
];
