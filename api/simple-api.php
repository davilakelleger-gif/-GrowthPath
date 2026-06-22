<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$dataDir = __DIR__ . '/storage/data';
if (!is_dir($dataDir)) mkdir($dataDir, 0777, true);

function jsonRes($data, $code = 200) { http_response_code($code); echo json_encode($data); exit; }
function readJ($key) { global $dataDir; $f = "$dataDir/$key.json"; return file_exists($f) ? json_decode(file_get_contents($f), true) : []; }
function writeJ($key, $data) { global $dataDir; file_put_contents("$dataDir/$key.json", json_encode($data, JSON_PRETTY_PRINT)); }
function input() { return json_decode(file_get_contents('php://input'), true) ?? []; }

function auth() {
    $token = null;
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/', $hdr, $m)) $token = $m[1];
    if (!$token) jsonRes(['error' => 'No token'], 401);
    $users = readJ('users');
    foreach ($users as $u) {
        if (isset($u['token']) && $u['token'] === $token) return $u;
    }
    jsonRes(['error' => 'Invalid token'], 401);
}

function userData($userId, $key) {
    $all = readJ("user_${userId}_${key}");
    return $all ?: [];
}
function saveUserData($userId, $key, $data) {
    writeJ("user_{$userId}_{$key}", $data);
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#/Habit/api#', '', $path);
$segments = array_values(array_filter(explode('/', $path)));

try {
    $resource = $segments[0] ?? '';

    switch ($resource) {
        case 'health':
            jsonRes(['status' => 'ok', 'version' => '2.0.0', 'time' => date('c')]);
            break;

        // ======================== AUTH ========================
        case 'auth':
            $action = $segments[1] ?? '';
            if ($action === 'register' && $method === 'POST') {
                $d = input();
                if (empty($d['email']) || empty($d['password']) || empty($d['name']))
                    jsonRes(['error' => 'name, email, password required'], 400);
                $users = readJ('users');
                foreach ($users as $u) {
                    if ($u['email'] === $d['email']) jsonRes(['error' => 'Email already exists'], 409);
                }
                $userId = count($users) > 0 ? max(array_column($users, 'id')) + 1 : 1;
                $token = bin2hex(random_bytes(32));
                $user = [
                    'id' => $userId,
                    'name' => $d['name'],
                    'email' => $d['email'],
                    'password' => password_hash($d['password'], PASSWORD_DEFAULT),
                    'token' => $token,
                    'streak' => 0,
                    'level' => 1,
                    'xp' => 0,
                    'created_at' => date('c'),
                ];
                $users[] = $user;
                writeJ('users', $users);
                saveUserData($userId, 'habits', [
                    ['id' => 1, 'name' => 'Drink Water', 'icon' => '💧', 'target' => 8, 'unit' => 'glasses', 'color' => '#2563EB', 'logs' => []],
                    ['id' => 2, 'name' => 'Read', 'icon' => '📚', 'target' => 50, 'unit' => 'pages', 'color' => '#22C55E', 'logs' => []],
                    ['id' => 3, 'name' => 'Running', 'icon' => '🏃', 'target' => 30, 'unit' => 'min', 'color' => '#F59E0B', 'logs' => []],
                    ['id' => 4, 'name' => 'Meditate', 'icon' => '🧘', 'target' => 15, 'unit' => 'min', 'color' => '#8B5CF6', 'logs' => []],
                    ['id' => 5, 'name' => 'Code', 'icon' => '💻', 'target' => 60, 'unit' => 'min', 'color' => '#EC4899', 'logs' => []],
                    ['id' => 6, 'name' => 'Journal', 'icon' => '📝', 'target' => 1, 'unit' => 'entry', 'color' => '#06B6D4', 'logs' => []],
                ]);
                saveUserData($userId, 'goals', [
                    ['id' => 1, 'name' => 'Learn Flutter', 'icon' => '🎯', 'progress' => 0, 'deadline' => '2026-08-15'],
                    ['id' => 2, 'name' => 'Run 5KM', 'icon' => '🏃', 'progress' => 0, 'deadline' => '2026-07-01'],
                    ['id' => 3, 'name' => 'Read 12 Books', 'icon' => '📚', 'progress' => 0, 'deadline' => '2026-12-31'],
                    ['id' => 4, 'name' => 'Save $5,000', 'icon' => '💰', 'progress' => 0, 'deadline' => '2026-11-01'],
                ]);
                saveUserData($userId, 'notifications', []);
                saveUserData($userId, 'achievements', [
                    ['name' => 'Early Bird', 'icon' => '🌅', 'desc' => 'Complete 7 morning habits', 'unlocked' => false],
                    ['name' => 'Consistent', 'icon' => '🔥', 'desc' => '7-day streak', 'unlocked' => false],
                    ['name' => 'Marathon', 'icon' => '🏃', 'desc' => '30-day streak', 'unlocked' => false],
                    ['name' => 'Bookworm', 'icon' => '📖', 'desc' => 'Read 500 pages', 'unlocked' => false],
                    ['name' => 'Century', 'icon' => '💯', 'desc' => '100 habits completed', 'unlocked' => false],
                    ['name' => 'Master', 'icon' => '👑', 'desc' => 'Complete all goals', 'unlocked' => false],
                ]);
                jsonRes(['user' => ['id' => $userId, 'name' => $d['name'], 'email' => $d['email'], 'streak' => 0, 'level' => 1, 'xp' => 0], 'token' => $token], 201);
            } elseif ($action === 'login' && $method === 'POST') {
                $d = input();
                $users = readJ('users');
                foreach ($users as &$u) {
                    if ($u['email'] === $d['email'] && password_verify($d['password'], $u['password'])) {
                        $token = bin2hex(random_bytes(32));
                        $u['token'] = $token;
                        writeJ('users', $users);
                        jsonRes(['user' => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'streak' => $u['streak'] ?? 0, 'level' => $u['level'] ?? 1, 'xp' => $u['xp'] ?? 0], 'token' => $token]);
                    }
                }
                jsonRes(['error' => 'Invalid credentials'], 401);
            } elseif ($action === 'me' && $method === 'GET') {
                $u = auth();
                jsonRes(['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'streak' => $u['streak'] ?? 0, 'level' => $u['level'] ?? 1, 'xp' => $u['xp'] ?? 0]);
            } elseif ($action === 'profile' && $method === 'PUT') {
                $u = auth();
                $d = input();
                $users = readJ('users');
                foreach ($users as &$user) {
                    if ($user['id'] === $u['id']) {
                        if (isset($d['name'])) $user['name'] = $d['name'];
                        writeJ('users', $users);
                        jsonRes(['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]);
                    }
                }
            }
            break;

        // ======================== HABITS ========================
        case 'habits':
            $u = auth();
            $habits = userData($u['id'], 'habits');

            if ($method === 'GET') {
                if (isset($segments[1]) && $segments[1] === 'today') {
                    $today = date('Y-m-d');
                    $result = array_map(function($h) use ($today) {
                        $current = $h['logs'][$today] ?? 0;
                        return array_merge($h, ['current' => $current, 'progress' => $h['target'] > 0 ? min(100, round(($current / $h['target']) * 100)) : 0]);
                    }, $habits);
                    jsonRes($result);
                } elseif (isset($segments[1]) && $segments[1] === 'weekly') {
                    $days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    $data = [];
                    for ($i = 6; $i >= 0; $i--) {
                        $date = date('Y-m-d', strtotime("-$i days"));
                        $total = 0; $count = 0;
                        foreach ($habits as $h) {
                            $val = $h['logs'][$date] ?? 0;
                            if ($val > 0 && ($h['target'] ?? 1) > 0) { $total += min(100, ($val / $h['target']) * 100); $count++; }
                        }
                        $data[] = ['label' => $days[(int)date('w', strtotime("-$i days"))], 'date' => $date, 'value' => $count > 0 ? round($total / $count) : 0];
                    }
                    jsonRes($data);
                } elseif (isset($segments[1])) {
                    $h = array_values(array_filter($habits, fn($h) => $h['id'] == $segments[1]));
                    jsonRes($h[0] ?? null, $h ? 200 : 404);
                } else {
                    jsonRes($habits);
                }
            } elseif ($method === 'POST' && isset($segments[1]) && $segments[1] === 'log') {
                $d = input();
                $habitId = $d['habit_id']; $date = $d['date'] ?? date('Y-m-d'); $value = $d['value'] ?? 0;
                $updated = false;
                foreach ($habits as &$h) {
                    if ($h['id'] == $habitId) {
                        if (!isset($h['logs'])) $h['logs'] = [];
                        $h['logs'][$date] = min($value, $h['target'] ?? $value);
                        $updated = true; break;
                    }
                }
                if ($updated) { saveUserData($u['id'], 'habits', $habits); jsonRes(['success' => true]); }
                jsonRes(['error' => 'Not found'], 404);
            } elseif ($method === 'POST') {
                $d = input();
                $d['id'] = count($habits) > 0 ? max(array_column($habits, 'id')) + 1 : 1;
                $d['logs'] = $d['logs'] ?? [];
                $habits[] = $d;
                saveUserData($u['id'], 'habits', $habits);
                jsonRes($d, 201);
            } elseif ($method === 'PUT' && isset($segments[1])) {
                $d = input();
                foreach ($habits as &$h) { if ($h['id'] == $segments[1]) { $h = array_merge($h, $d); saveUserData($u['id'], 'habits', $habits); jsonRes($h); } }
                jsonRes(['error' => 'Not found'], 404);
            } elseif ($method === 'DELETE' && isset($segments[1])) {
                $habits = array_values(array_filter($habits, fn($h) => $h['id'] != $segments[1]));
                saveUserData($u['id'], 'habits', $habits);
                jsonRes(null, 204);
            }
            break;

        // ======================== GOALS ========================
        case 'goals':
            $u = auth();
            $goals = userData($u['id'], 'goals');
            if ($method === 'GET') { jsonRes($goals); }
            elseif ($method === 'POST') { $d = input(); $d['id'] = count($goals) > 0 ? max(array_column($goals, 'id')) + 1 : 1; $goals[] = $d; saveUserData($u['id'], 'goals', $goals); jsonRes($d, 201); }
            elseif ($method === 'PUT' && isset($segments[1])) { $d = input(); foreach ($goals as &$g) { if ($g['id'] == $segments[1]) { $g = array_merge($g, $d); saveUserData($u['id'], 'goals', $goals); jsonRes($g); } } }
            break;

        // ======================== NOTIFICATIONS ========================
        case 'notifications':
            $u = auth();
            $notifs = userData($u['id'], 'notifications');
            if ($method === 'GET') { jsonRes($notifs); }
            elseif ($method === 'POST') {
                $d = input();
                $d['id'] = count($notifs) > 0 ? max(array_column($notifs, 'id')) + 1 : 1;
                $d['created_at'] = date('c');
                $d['is_read'] = false;
                $notifs[] = $d;
                saveUserData($u['id'], 'notifications', $notifs);
                jsonRes($d, 201);
            } elseif ($method === 'PUT' && isset($segments[1]) && $segments[1] === 'read') {
                foreach ($notifs as &$n) { $n['is_read'] = true; }
                saveUserData($u['id'], 'notifications', $notifs);
                jsonRes(['success' => true]);
            }
            break;

        // ======================== ACHIEVEMENTS ========================
        case 'achievements':
            $u = auth();
            jsonRes(userData($u['id'], 'achievements'));
            break;

        // ======================== STATS ========================
        case 'stats':
            $u = auth();
            $habits = userData($u['id'], 'habits');
            $goals = userData($u['id'], 'goals');
            $today = date('Y-m-d');
            $done = 0;
            foreach ($habits as $h) { if (($h['logs'][$today] ?? 0) >= ($h['target'] ?? 1)) $done++; }
            jsonRes([
                'streak' => $u['streak'] ?? 0,
                'habits_progress' => count($habits) > 0 ? round(($done / count($habits)) * 100) : 0,
                'habits_done' => $done, 'habits_total' => count($habits),
                'goals_done' => count(array_filter($goals, fn($g) => ($g['progress'] ?? 0) >= 100)),
                'goals_total' => count($goals),
                'level' => $u['level'] ?? 1, 'xp' => $u['xp'] ?? 0,
            ]);
            break;

        default:
            jsonRes(['error' => 'Not found', 'path' => $path], 404);
    }
} catch (Exception $e) {
    jsonRes(['error' => $e->getMessage()], 500);
}
