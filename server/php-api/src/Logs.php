<?php
require_once __DIR__.'/Database.php';
class Logs {
  private $db;
  public function __construct() { $this->db = (new Database())->pdo(); }

  public function write($userId, $action, $target) {
    $stmt = $this->db->prepare('INSERT INTO logs (user_id, action, target, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$userId, $action, $target]);
    return ['ok'=>true];
  }

  public function list($userId) {
    $stmt = $this->db->prepare('SELECT * FROM logs WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
