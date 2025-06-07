<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Google\Client;
use Google\Service\Sheets;

class FeedbackController extends Controller
{
    public function getResponses()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/posSystemSheets.json')); // Your service account JSON
        $client->addScope(Sheets::SPREADSHEETS_READONLY);

        $service = new Sheets($client);
        $spreadsheetId = '1Cqk8-_HVKM1cZl_p46wPaELCz-UKZ1S6-V42682sofc'; // Your Google Sheet ID
        $range = "Form Responses 1!A1:Z1000"; // Adjust as needed

        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();

        return response()->json($values);
    }

    public function getSurveyQuestions()
    {
        return response()->json([
            'questions' => [
                [
                    'text' => 'How easy was it to complete your transaction using our POS system?',
                    'type' => 'multiple-choice',
                    'choices' => ['Very Easy', 'Easy', 'Neutral', 'Difficult', 'Very Difficult']
                ],
                [
                    'text' => 'How easy was it to navigate the POS screen or menu?',
                    'type' => 'multiple-choice',
                    'choices' => ['Very Easy', 'Easy', 'Neutral', 'Difficult', 'Very Difficult']
                ],
                [
                    'text' => 'How satisfied were you with the speed of the checkout?',
                    'type' => 'multiple-choice',
                    'choices' => ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
                ],
                [
                    'text' => 'How smooth was the payment process?',
                    'type' => 'multiple-choice',
                    'choices' => ['Excellent', 'Good', 'Neutral', 'Poor', 'Very Poor']
                ],
                [
                    'text' => 'How well did the POS system support your preferred payment method?',
                    'type' => 'multiple-choice',
                    'choices' => ['Completely', 'Mostly', 'Moderately', 'Slightly', 'Not at all']
                ],
                [
                    'text' => 'Did you experience any technical issues during the transaction?',
                    'type' => 'multiple-choice',
                    'choices' => ['Perfect experience', 'No issues', 'A few minor issues', 'Some issues', 'Many issues']
                ],
                [
                    'text' => 'How clear and understandable was the on-screen information?',
                    'type' => 'multiple-choice',
                    'choices' => ['Very clear', 'Clear', 'Neutral', 'Unclear', 'Very unclear']
                ],
                [
                    'text' => 'How confident were you in reviewing your order details before payment?',
                    'type' => 'multiple-choice',
                    'choices' => ['Completely confident', 'Very confident', 'Moderately confident', 'Slightly confident', 'Not confident at all']
                ],
                [
                    'text' => 'How accurately did the POS system display your total amount?',
                    'type' => 'multiple-choice',
                    'choices' => ['Very accurate', 'Accurate', 'Neutral', 'Inaccurate', 'Very inaccurate']
                ],
                [
                    'text' => 'How satisfied were you with the promptness and accuracy of your receipt?',
                    'type' => 'multiple-choice',
                    'choices' => ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
                ],
                [
                    'text' => 'How helpful was the customer-facing screen during checkout?',
                    'type' => 'multiple-choice',
                    'choices' => ['Extremely helpful', 'Very helpful', 'Moderately helpful', 'Slightly helpful', 'Not helpful at all']
                ],
                [
                    'text' => 'In your opinion, What possible improvements can be implemented in the system?',
                    'type' => 'open-ended'
                ]
            ]
        ]);
    }
    public function getAggregatedResponses()
    {
        $client = new Client();
        $client->setAuthConfig(storage_path('app/posSystemSheets.json'));
        $client->addScope(Sheets::SPREADSHEETS_READONLY);
        $service = new Sheets($client);
        $spreadsheetId = '1Cqk8-_HVKM1cZl_p46wPaELCz-UKZ1S6-V42682sofc';
        $range = "Form Responses 1!A1:Z1000";

        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();


        if (empty($values)) {
            return response()->json(['error' => 'No data found'], 404);
        }

        $headers = $values[0];
        $dataRows = array_slice($values, 1);

        $summary = [];

        foreach ($headers as $colIndex => $question) {
            // Skip timestamp column (usually index 0)
            if ($colIndex === 0) {
                continue;
            }

            $summary[$question] = [];
            foreach ($dataRows as $row) {
                $answer = $row[$colIndex] ?? null;
                if ($answer) {
                    if (!isset($summary[$question][$answer])) {
                        $summary[$question][$answer] = 0;
                    }
                    $summary[$question][$answer]++;
                }
            }
        }

        return response()->json($summary);
    }

}
