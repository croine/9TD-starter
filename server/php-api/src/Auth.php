<?php
require_once __DIR__.'/Database.php';
class Auth {
  private $db;
  public function __construct() { $this->db = (new Database())->pdo(); }

  public function register($username, $email, $password) {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $this->db->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$username, $email, $hash]);
    return ['ok' => true];
  }

  public function login($usernameOrEmail, $password) {
    $stmt = $this->db->prepare('SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ? LIMIT 1');
    $stmt->execute([$usernameOrEmail, $usernameOrEmail]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u || !password_verify($password, $u['password_hash'])) {
      http_response_code(401);
      return ['error' => 'Invalid credentials'];
    }
    $token = bin2hex(random_bytes(32));
    $this->db->prepare('INSERT INTO tokens (user_id, token, created_at) VALUES (?, ?, NOW())')->execute([$u['id'], $token]);
    return ['token' => $token, 'user' => ['id' => $u['id'], 'username' => $u['username'], 'email' => $u['email'], 'role' => $u['role']]];
  }

  public static function authUser($db, $headers) {
    if (!isset($headers['Authorization'])) { http_response_code(401); die(json_encode(['error'=>'No token'])); }
    $token = trim(str_replace('Bearer', '', $headers['Authorization']));
    $stmt = $db->prepare('SELECT users.id, users.username, users.role FROM tokens JOIN users ON users.id = tokens.user_id WHERE token = ? LIMIT 1');
    $stmt->execute([$token]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$u) { http_response_code(401); die(json_encode(['error'=>'Bad token'])); }
    return $u;
  }
}
