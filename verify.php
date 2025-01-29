<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Your Secret Key from hCaptcha
    $secretKey = "ES_89aec60e04a34b69963632f56421ebfb";  // e.g. '0x000000000000000000000ABCDE'

    // 2. The user’s response token from hCaptcha
    //    This is automatically included in POST data when the form is submitted
    $captchaResponse = $_POST['h-captcha-response'];

    if (empty($captchaResponse)) {
        echo "Please complete the hCaptcha.";
        exit;
    }

    // 3. Send a POST request to hCaptcha’s verification endpoint
    $verifyUrl = "https://hcaptcha.com/siteverify";

    // Build the POST fields
    $data = array(
      'secret' => $secretKey,
      'response' => $captchaResponse,
      // Optionally: 'remoteip' => $_SERVER['REMOTE_ADDR']
    );

    // 4. Use cURL or file_get_contents to post the data
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $verifyUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    // 5. Decode the JSON response from hCaptcha
    $responseData = json_decode($response, true);

    // 6. Check if “success” is true
    if ($responseData && isset($responseData['success']) && $responseData['success'] === true) {
        // The hCaptcha was successfully completed
        // Redirect to the protected content, or do whatever you want
        header("Location: protected.html");
        exit;
    } else {
        // hCaptcha failed: show an error or redirect back to form
        echo "hCaptcha verification failed. Please try again.";
    }
}
?>

