<?php
// หาตำแหน่งโฟลเดอร์
$target = __DIR__ . '/../storage/app/public'; 
$shortcut = __DIR__ . '/storage';

// สั่งเชื่อม
if(symlink($target, $shortcut)){
    echo "เชื่อมต่อท่อรูปภาพสำเร็จ! (Symlink Created)";
} else {
    echo "เชื่อมต่อไม่สำเร็จ (อาจจะต้องลบโฟลเดอร์ public/storage ตัวเก่าทิ้งก่อน)";
}
?>