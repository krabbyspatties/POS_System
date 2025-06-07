<?php

namespace App\Services;

use Google\Client;
use Google\Service\Forms;
use App\Models\FeedbackResponse;
use App\Models\FeedbackQuestion;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GoogleFormService
{
    private $client;
    private $formsService;
    private $formId;

    public function __construct()
    {
        $this->formId = env('GOOGLE_FORM_ID');
        $this->initializeClient();
    }

    private function initializeClient()
    {
        try {
            $this->client = new Client();
            $this->client->setApplicationName('POS Feedback System');
            $this->client->setScopes([
                Forms::FORMS_RESPONSES_READONLY,
                Forms::FORMS_BODY_READONLY
            ]);

            // Updated to look for your actual JSON file name
            $credentialsPath = storage_path('app/possystemproject.json');
            if (!file_exists($credentialsPath)) {
                throw new \Exception('Google credentials file not found at: ' . $credentialsPath);
            }

            $this->client->setAuthConfig($credentialsPath);
            $this->client->setAccessType('offline');

            $this->formsService = new Forms($this->client);
        } catch (\Exception $e) {
            Log::error('Failed to initialize Google Forms client: ' . $e->getMessage());
            throw $e;
        }
    }

    public function testConnection()
    {
        try {
            if (!$this->formId) {
                throw new \Exception('GOOGLE_FORM_ID not set in environment variables');
            }

            $form = $this->formsService->forms->get($this->formId);
            return [
                'success' => true,
                'form_title' => $form->getInfo()->getTitle(),
                'form_id' => $this->formId,
                'description' => $form->getInfo()->getDescription()
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function syncFormStructure()
    {
        try {
            $form = $this->formsService->forms->get($this->formId);
            $items = $form->getItems();

            if (!$items) {
                Log::warning('No items found in Google Form');
                return false;
            }

            $orderIndex = 0;
            foreach ($items as $item) {
                if ($item->getQuestionItem()) {
                    $question = $item->getQuestionItem()->getQuestion();

                    FeedbackQuestion::updateOrCreate(
                        [
                            'form_id' => $this->formId,
                            'question_id' => $item->getItemId()
                        ],
                        [
                            'question_text' => $item->getTitle() ?: 'Untitled Question',
                            'question_type' => $this->getQuestionType($question),
                            'options' => $this->getQuestionOptions($question),
                            'order_index' => $orderIndex++
                        ]
                    );
                }
            }

            Log::info('Form structure synced successfully');
            return true;
        } catch (\Exception $e) {
            Log::error('Error syncing form structure: ' . $e->getMessage());
            return false;
        }
    }

    public function syncResponses()
    {
        try {
            $responses = $this->formsService->forms_responses->listFormsResponses($this->formId);
            $responseItems = $responses->getResponses();

            if (!$responseItems) {
                Log::info('No responses found in Google Form');
                return true;
            }

            $newResponsesCount = 0;
            foreach ($responseItems as $response) {
                $responseId = $response->getResponseId();

                $existingResponse = FeedbackResponse::where('response_id', $responseId)->first();

                if (!$existingResponse) {
                    $answers = [];

                    if ($response->getAnswers()) {
                        foreach ($response->getAnswers() as $questionId => $answer) {
                            $answers[$questionId] = $this->extractAnswerValue($answer);
                        }
                    }

                    FeedbackResponse::create([
                        'form_id' => $this->formId,
                        'response_id' => $responseId,
                        'answers' => $answers,
                        'submitted_at' => $this->parseGoogleTimestamp($response->getLastSubmittedTime())
                    ]);

                    $newResponsesCount++;
                }
            }

            Log::info("Synced {$newResponsesCount} new responses");
            return true;
        } catch (\Exception $e) {
            Log::error('Error syncing responses: ' . $e->getMessage());
            return false;
        }
    }

    private function getQuestionType($question)
    {
        if ($question->getChoiceQuestion()) {
            return 'choice';
        } elseif ($question->getScaleQuestion()) {
            return 'scale';
        } elseif ($question->getTextQuestion()) {
            return 'text';
        }
        return 'unknown';
    }

    private function getQuestionOptions($question)
    {
        if ($question->getChoiceQuestion()) {
            $options = [];
            $choiceOptions = $question->getChoiceQuestion()->getOptions();
            if ($choiceOptions) {
                foreach ($choiceOptions as $option) {
                    $options[] = $option->getValue();
                }
            }
            return $options;
        } elseif ($question->getScaleQuestion()) {
            $scale = $question->getScaleQuestion();
            return [
                'low' => $scale->getLow(),
                'high' => $scale->getHigh(),
                'low_label' => $scale->getLowLabel(),
                'high_label' => $scale->getHighLabel()
            ];
        }
        return null;
    }

    private function extractAnswerValue($answer)
    {
        if ($answer->getTextAnswers()) {
            $textAnswers = $answer->getTextAnswers()->getAnswers();
            return $textAnswers ? $textAnswers[0]->getValue() : null;
        }
        return null;
    }

    private function parseGoogleTimestamp($timestamp)
    {
        try {
            return Carbon::parse($timestamp);
        } catch (\Exception $e) {
            return Carbon::now();
        }
    }
}
