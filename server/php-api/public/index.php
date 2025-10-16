<?php
header('Content-Type: application/json');
require_once __DIR__.'/../src/Auth.php';
require_once __DIR__.'/../src/Tasks.php';
require_once __DIR__.'/../src/Messages.php';
require_once __DIR__.'/../src/Logs.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$headers = getallheaders();
$path = parse_url($uri, PHP_URL_PATH);

function body() { return json_decode(file_get_contents('php://input'), true) ?? []; }

if ($path === '/api/auth/register' && $method === 'POST') {
  $b = body();
  echo json_encode((new Auth())->register($b['username'], $b['email'], $b['password']));
  exit;
}
if ($path === '/api/auth/login' && $method === 'POST') {
  $b = body();
  echo json_encode((new Auth())->login($b['usernameOrEmail'], $b['password']));
  exit;
}

$db = (new Database())->pdo();
$user = Auth::authUser($db, $headers);

if ($path === '/api/tasks' && $method === 'GET') {
  echo json_encode((new Tasks())->list($user['id'])); exit;
}
if ($path === '/api/tasks' && $method === 'POST') {
  echo json_encode((new Tasks())->create($user['id'], body())); exit;
}
if (preg_match('#^/api/tasks/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];
  if ($method === 'PUT') { echo json_encode((new Tasks())->update($user['id'], $id, body())); exit; }
  if ($method === 'DELETE') { echo json_encode((new Tasks())->delete($user['id'], $id)); exit; }
}

if ($path === '/api/messages' && $method === 'GET') { echo json_encode((new Messages())->list($user['id'])); exit; }
if ($path === '/api/messages' && $method === 'POST') {
  $b = body(); echo json_encode((new Messages())->send($user['id'], $b['recipientId'], $b['body'])); exit;
}

if ($path === '/api/logs' && $method === 'GET') { echo json_encode((new Logs())->list($user['id'])); exit; }
if ($path === '/api/logs' && $method === 'POST') {
  $b = body(); echo json_encode((new Logs())->write($user['id'], $b['action'], $b['target'])); exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
