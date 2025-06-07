<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleFormService; // Changed from GoogleFormsService

class SyncGoogleFormsData extends Command
{
    protected $signature = 'forms:sync {--test : Test connection only}';
    protected $description = 'Sync data from Google Forms';

    private $googleFormService; // Changed variable name

    public function __construct(GoogleFormService $googleFormService) // Changed parameter
    {
        parent::__construct();
        $this->googleFormService = $googleFormService; // Changed assignment
    }

    public function handle()
    {
        if ($this->option('test')) {
            return $this->testConnection();
        }

        $this->info('🔄 Starting Google Forms sync...');

        try {
            $connectionTest = $this->googleFormService->testConnection(); // Updated reference
            if (!$connectionTest['success']) {
                $this->error('❌ Connection failed: ' . $connectionTest['error']);
                return 1;
            }

            $this->info('✅ Connected to: ' . $connectionTest['form_title']);

            $structureSync = $this->googleFormService->syncFormStructure(); // Updated reference
            $responseSync = $this->googleFormService->syncResponses(); // Updated reference

            if ($structureSync && $responseSync) {
                $this->info('🎉 Sync completed successfully!');
                return 0;
            } else {
                $this->error('❌ Sync failed');
                return 1;
            }

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            return 1;
        }
    }

    private function testConnection()
    {
        $this->info('🔍 Testing Google Forms connection...');

        try {
            $result = $this->googleFormService->testConnection(); // Updated reference

            if ($result['success']) {
                $this->info('✅ Connection successful!');
                $this->info('📋 Form: ' . $result['form_title']);
                return 0;
            } else {
                $this->error('❌ Connection failed: ' . $result['error']);
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('❌ Test failed: ' . $e->getMessage());
            return 1;
        }
    }
}