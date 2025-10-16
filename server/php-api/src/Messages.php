<?php
require_once __DIR__.'/Database.php';
class Messages {
  private $db;
  public function __construct() { $this->db = (new Database())->pdo(); }

  public function list($userId) {
    $stmt = $this->db->prepare('SELECT * FROM messages WHERE sender_id = ? OR recipient_id = ? ORDER BY created_at DESC');
    $stmt->execute([$userId, $userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function send($senderId, $recipientId, $body) {
    $stmt = $this->db->prepare('INSERT INTO messages (sender_id, recipient_id, body, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$senderId, $recipientId, $body]);
    return ['ok'=>true];
  }
}
