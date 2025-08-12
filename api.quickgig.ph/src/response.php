<?php
function json_ok($data, $code=200){ http_response_code($code); header('Content-Type: application/json'); echo json_encode($data); exit; }
function json_bad($msg, $code=400){ json_ok(['error'=>$msg], $code); }
