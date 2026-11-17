// Generates dist/api/contact.php at build time so the recipient address and
// site name come from src/config/site.json like everything else.
import type { APIRoute } from 'astro';
import { SITE } from '../../lib/site';

const host = new URL(SITE.url).host;
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export const GET: APIRoute = () => {
  const php = `<?php
/**
 * Contact form mailer for ${esc(SITE.brandName)} (Hostinger / PHP mail()).
 * Returns JSON. Spam protection: honeypot field, minimum fill time, length limits.
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function out($code, $data) { http_response_code($code); echo json_encode($data); exit; }
function clean($v, $max) {
  $v = trim((string)$v);
  $v = str_replace(array("\\r", "\\n", "%0a", "%0d"), ' ', $v);
  return mb_substr(strip_tags($v), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { out(405, array('ok' => false, 'error' => 'Method not allowed.')); }

$to = '${esc(SITE.email)}';
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
  // Recipient address has not been configured in src/config/site.json yet.
  out(500, array('ok' => false, 'error' => 'The form is not set up yet. Please call instead.'));
}

// Honeypot: real visitors never fill this. Pretend success so bots move on.
if (!empty($_POST['company'])) { out(200, array('ok' => true)); }

// Time trap: forms sent in under 3 seconds are almost always bots.
$started = isset($_POST['started']) ? (float)$_POST['started'] : 0;
if ($started > 0 && (microtime(true) * 1000 - $started) < 3000) { out(200, array('ok' => true)); }

$name = clean(isset($_POST['name']) ? $_POST['name'] : '', 80);
$phone = clean(isset($_POST['phone']) ? $_POST['phone'] : '', 30);
$zip = clean(isset($_POST['zip']) ? $_POST['zip'] : '', 5);
$type = clean(isset($_POST['damage_type']) ? $_POST['damage_type'] : '', 60);
$message = trim(mb_substr(strip_tags(isset($_POST['message']) ? (string)$_POST['message'] : ''), 0, 1500));

if ($name === '' || $message === '' || $type === '') { out(422, array('ok' => false, 'error' => 'Please fill in every field.')); }
if (!preg_match('/^[0-9+().\\\\-\\\\s]{7,30}$/', $phone)) { out(422, array('ok' => false, 'error' => 'Please enter a valid phone number.')); }
if (!preg_match('/^[0-9]{5}$/', $zip)) { out(422, array('ok' => false, 'error' => 'Please enter a 5 digit ZIP code.')); }
if (preg_match_all('/https?:\\\\/\\\\//i', $message) > 2) { out(422, array('ok' => false, 'error' => 'Please remove the links from your message.')); }

$subject = 'Website message: ' . $type . ' (' . $zip . ')';
$body = "New message from the ${esc(host)} contact form\\n\\n"
  . "Name: $name\\nPhone: $phone\\nZIP: $zip\\nType of damage: $type\\n\\nMessage:\\n$message\\n\\n"
  . "Sent: " . date('Y-m-d H:i:s T') . "\\n";
$headers = "From: ${esc(SITE.brandName)} <no-reply@${esc(host)}>\\r\\n"
  . "Content-Type: text/plain; charset=utf-8\\r\\n"
  . "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subject, $body, $headers, '-f no-reply@${esc(host)}');
if ($sent) { out(200, array('ok' => true)); }
out(500, array('ok' => false, 'error' => 'Your message could not be sent. Please call instead.'));
`;
  return new Response(php, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
