<?php
/**
 * CMD Company — Contact 메일 전송 (PHPMailer + Naver SMTP)
 *
 * 카페24 업로드 위치 : 사이트 루트 (index.html 과 같은 폴더)
 * PHPMailer 업로드 위치 : /phpmailer/  폴더 안에 3개 파일
 *   - Exception.php
 *   - PHPMailer.php
 *   - SMTP.php
 * → https://github.com/PHPMailer/PHPMailer 에서 src/ 폴더의 3개 파일을 내려받으세요.
 */

// ─── PHPMailer 존재 확인 ──────────────────────────────────────
if (!file_exists(__DIR__ . '/phpmailer/PHPMailer.php')) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'phpmailer/ 폴더가 없습니다. PHPMailer 파일을 업로드하세요.']);
    exit;
}

// ─── CORS 헤더 (같은 도메인이라면 없어도 되지만 안전하게 명시) ──
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://cmdcompany.co.kr');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// ─── PHPMailer 로드 ───────────────────────────────────────────
require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ─── 요청 데이터 파싱 ─────────────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => '잘못된 요청입니다.']);
    exit;
}

function s($key, $data) {
    return isset($data[$key]) ? htmlspecialchars(trim($data[$key]), ENT_QUOTES, 'UTF-8') : '미입력';
}

$how_found = s('how_found', $data);
$need      = s('need',      $data);
$budget    = s('budget',    $data);
$revenue   = s('revenue',   $data);
$advantage = nl2br(s('advantage', $data));
$problem   = nl2br(s('problem',   $data));
$name      = s('name',      $data);
$region    = s('region',    $data);
$phone     = s('phone',     $data);
$reply_to  = s('reply_to',  $data);

// 필수 값 확인
if ($name === '미입력' || $phone === '미입력') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => '이름과 연락처는 필수입니다.']);
    exit;
}

// ─── 메일 본문 (HTML 표) ──────────────────────────────────────
$html = "
<table style='width:100%;border-collapse:collapse;font-family:sans-serif;font-size:16px;color:#222;'>
  <tr><td colspan='2' style='background:#121212;color:#fff;padding:16px 20px;font-size:20px;font-weight:700;letter-spacing:0.1em;'>CMD 문의 접수</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;width:200px;'>알게 된 경로</td>      <td style='padding:10px 16px;'>{$how_found}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>필요한 서비스</td>                  <td style='padding:10px 16px;'>{$need}</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;'>마케팅 예산</td>                   <td style='padding:10px 16px;'>{$budget}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>월 평균 매출</td>                   <td style='padding:10px 16px;'>{$revenue}</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;'>사업장 장점</td>                   <td style='padding:10px 16px;'>{$advantage}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>고민 / 문제사항</td>                <td style='padding:10px 16px;'>{$problem}</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;'>회사명 / 직책 / 이름</td>          <td style='padding:10px 16px;'>{$name}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>지역</td>                           <td style='padding:10px 16px;'>{$region}</td></tr>
  <tr style='background:#f5f5f5;'><td style='padding:10px 16px;font-weight:700;'>연락처</td>                        <td style='padding:10px 16px;'>{$phone}</td></tr>
  <tr>                            <td style='padding:10px 16px;font-weight:700;'>이메일</td>                         <td style='padding:10px 16px;'>{$reply_to}</td></tr>
</table>";

// ─── PHPMailer 전송 ───────────────────────────────────────────
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.naver.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'chinamd@naver.com';
    $mail->Password   = 'C7LV6UMGFR8C';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->Timeout    = 10;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('chinamd@naver.com', 'CMD 웹사이트');
    $mail->addAddress('chinamd@naver.com', 'CMD');

    if ($reply_to !== '미입력' && filter_var($reply_to, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($reply_to);
    }

    $mail->isHTML(true);
    $mail->Subject = "[CMD 문의] {$name} / {$phone}";
    $mail->Body    = $html;
    $mail->AltBody = "알게 된 경로: {$how_found}\n필요 서비스: {$need}\n예산: {$budget}\n매출: {$revenue}\n이름: {$name}\n지역: {$region}\n연락처: {$phone}\n이메일: {$reply_to}";

    $mail->send();

    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => '메일 전송 실패: ' . $mail->ErrorInfo]);
}
