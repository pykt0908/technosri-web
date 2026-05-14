<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Enrollment Group
            [
                'key' => 'enrollment_link',
                'value' => 'https://admission.technosri.ac.th',
                'group' => 'enrollment',
                'label' => 'ลิงก์ระบบสมัครเรียนออนไลน์',
                'type' => 'text',
            ],
            [
                'key' => 'enrollment_qr',
                'value' => null, // Will be handled via file upload or static path
                'group' => 'enrollment',
                'label' => 'QR Code สมัครเรียน',
                'type' => 'file',
            ],

            // Recruitment Group
            [
                'key' => 'recruitment_link',
                'value' => 'https://forms.gle/recruitment-example',
                'group' => 'recruitment',
                'label' => 'ลิงก์สมัครงานออนไลน์',
                'type' => 'text',
            ],
            
            // Social & Contact Group
            [
                'key' => 'line_id',
                'value' => '@technosri',
                'group' => 'contact',
                'label' => 'Line Official ID',
                'type' => 'text',
            ],
            [
                'key' => 'contact_email',
                'value' => 'technosriracha@gmail.com',
                'group' => 'contact',
                'label' => 'อีเมลติดต่อสถาบัน',
                'type' => 'text',
            ],
            [
                'key' => 'contact_phone',
                'value' => '038-351-468',
                'group' => 'contact',
                'label' => 'เบอร์โทรศัพท์ติดต่อ',
                'type' => 'text',
            ],
            [
                'key' => 'contact_address',
                'value' => '12/19 หมู่ที่ 2 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 20230',
                'group' => 'contact',
                'label' => 'ที่อยู่สถาบัน',
                'type' => 'textarea',
            ],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
