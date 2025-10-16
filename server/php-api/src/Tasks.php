<?php
require_once __DIR__.'/Database.php';
class Tasks {
  private $db;
  public function __construct() { $this->db = (new Database())->pdo(); }

  public function list($userId) {
    $stmt = $this->db->prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function create($userId, $payload) {
    $stmt = $this->db->prepare('INSERT INTO tasks (user_id, title, description, status, priority, due_date, tags_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([$userId, $payload['title'], $payload['description'] ?? '', $payload['status'] ?? 'open', $payload['priority'] ?? 'medium', $payload['dueDate'] ?? null, json_encode($payload['tags'] ?? [])]);
    return ['ok'=>true];
  }

  public function update($userId, $id, $payload) {
    $stmt = $this->db->prepare('UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=?, tags_json=?, updated_at=NOW() WHERE id=? AND user_id=?');
    $stmt->execute([$payload['title'], $payload['description'] ?? '', $payload['status'] ?? 'open', $payload['priority'] ?? 'medium', $payload['dueDate'] ?? null, json_encode($payload['tags'] ?? []), $id, $userId]);
    return ['ok'=>true];
  }

  public function delete($userId, $id) {
    $stmt = $this->db->prepare('DELETE FROM tasks WHERE id=? AND user_id=?');
    $stmt->execute([$id, $userId]);
    return ['ok'=>true];
  }
}
