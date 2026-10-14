<?php
namespace FashionGate\ElementorExperience;
defined('ABSPATH') || exit;
final class Leads {
    public const ATTRIBUTION=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','msclkid'];
    public static function boot(): void {
        add_action('rest_api_init',static function () {
            register_rest_route('fashiongate/v1','/challenge',['methods'=>'GET','permission_callback'=>'__return_true','callback'=>[self::class,'challenge']]);
            register_rest_route('fashiongate/v1','/leads',['methods'=>'POST','permission_callback'=>'__return_true','callback'=>[self::class,'submit']]);
            register_rest_route('fashiongate/v1','/contact-inquiry',['methods'=>'POST','permission_callback'=>'__return_true','callback'=>[self::class,'submit_contact_inquiry']]);
            register_rest_route('fashiongate/v1','/newsletter-subscribe',['methods'=>'POST','permission_callback'=>'__return_true','callback'=>[self::class,'submit_newsletter_subscribe']]);
        });
        add_action('fg_cleanup_gates',static function () {
            global $wpdb;
            $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->prefix}fg_gates WHERE expires < %d",time()));
        });
    }
    private static function response($data,int $status=200) { $r=new \WP_REST_Response($data,$status); $r->header('Cache-Control','no-store'); return $r; }
    private static function fail(int $status=400) { return self::response(['success'=>false],$status); }
    private static function ip(): string {
        $secret=(string)getenv('FG_PROXY_SECRET');
        $token=(string)($_SERVER['HTTP_X_FG_PROXY_TOKEN']??'');
        $ip=(string)($_SERVER['HTTP_X_FG_CLIENT_IP']??'');
        if(strlen($secret)>=32 && hash_equals($secret,$token) && filter_var($ip,FILTER_VALIDATE_IP)) { return $ip; }
        // Local testing / non-Vercel hosts require a trusted REMOTE_ADDR policy.
        return (string)($_SERVER['REMOTE_ADDR']??'unknown');
    }
    private static function gate(string $key,int $limit,int $ttl): bool {
        global $wpdb;
        $key=hash_hmac('sha256',$key,wp_salt('auth'));
        $table=$wpdb->prefix.'fg_gates';
        $result=$wpdb->query($wpdb->prepare("INSERT INTO $table (gate_key,hits,expires) VALUES (%s,1,%d) ON DUPLICATE KEY UPDATE hits=hits+1",$key,time()+$ttl));
        if($result===false) { return false; }
        return (int)$wpdb->get_var($wpdb->prepare("SELECT hits FROM $table WHERE gate_key=%s",$key))<=$limit;
    }
    public static function challenge($request) {
        if(!self::gate('challenge:'.self::ip().':'.floor(time()/300),60,600)) { return self::fail(429); }
        $payload=time().'.'.wp_generate_password(24,false,false);
        $token=$payload.'.'.hash_hmac('sha256',$payload,wp_salt('nonce'));
        return self::response(['token'=>$token]);
    }
    /** Find by stable Elementor element ID; the browser never supplies validation rules. */
    public static function find_form(array $nodes,string $id): ?array {
        foreach($nodes as $node) {
            if(($node['id']??'')===$id && ($node['widgetType']??'')==='fg-lead-experience') { return $node['settings']??[]; }
            $found=self::find_form($node['elements']??[],$id); if($found!==null) { return $found; }
        }
        return null;
    }
    public static function submit($request) {
        if(strlen($request->get_body())>24576) { return self::fail(413); }
        $origin=$request->get_header('origin');
        $public=parse_url(home_url());
        $expected=$public['scheme'].'://'.$public['host'].(isset($public['port'])?':'.$public['port']:'');
        if($origin && $origin!==$expected) { return self::fail(403); }
        if(!self::gate('lead:'.self::ip().':'.floor(time()/600),8,1200)) { return self::fail(429); }
        $body=$request->get_json_params();
        if(!is_array($body) || !empty($body['companyWebsite'])) { return self::fail(); }
        if(!is_string($body['token']??null) || !is_string($body['widget']??null) ||
            !filter_var($body['pageId']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]) ||
            !is_array($body['fields']??null) || (isset($body['attribution'])&&!is_array($body['attribution'])) ||
            (isset($body['turnstile'])&&!is_string($body['turnstile']))) { return self::fail(); }
        $token=(string)($body['token']??''); $parts=explode('.',$token);
        if(count($parts)!==3 || !ctype_digit($parts[0]) || time()-(int)$parts[0]<2 || time()-(int)$parts[0]>1800 || !hash_equals(hash_hmac('sha256',$parts[0].'.'.$parts[1],wp_salt('nonce')),$parts[2])) { return self::fail(); }
        $page=(int)($body['pageId']??0);
        if(get_post_status($page)!=='publish' || post_password_required($page)) { return self::fail(); }
        $tree=json_decode((string)get_post_meta($page,'_elementor_data',true),true);
        $form=self::find_form(is_array($tree)?$tree:[],sanitize_key($body['widget']??''));
        if(!$form || empty($form['fields'])) { return self::fail(); }
        $submitted=$body['fields']??[]; if(!is_array($submitted)) { return self::fail(); }
        $fields=[];
        foreach($form['fields'] as $f) {
            $key=sanitize_key($f['key']??''); if(!$key || isset($fields[$key])) { return self::fail(); }
            $raw=$submitted[$key]??''; if(!is_scalar($raw)) { return self::fail(); }
            $value=sanitize_textarea_field((string)$raw);
            if((($f['required']??'')==='yes' && $value==='') || strlen($value)>(($f['type']??'')==='textarea'?5000:800)) { return self::fail(); }
            $type=$f['type']??'text';
            if($value!=='' && (($type==='email'&&!is_email($value)) || ($type==='checkbox'&&$value!=='yes') || ($type==='tel'&&!preg_match('/^[+0-9\s().-]{5,40}$/',$value)))) { return self::fail(); }
            if($type==='select' && $value!=='' && !in_array($value,array_map('trim',explode("\n",$f['options']??'')),true)) { return self::fail(); }
            $fields[$key]=['label'=>sanitize_text_field($f['label']??$key),'value'=>$value];
        }
        $secret=(string)getenv('FG_TURNSTILE_SECRET');
        if($secret) {
            $verify=wp_remote_post('https://challenges.cloudflare.com/turnstile/v0/siteverify',['timeout'=>10,'body'=>['secret'=>$secret,'response'=>sanitize_text_field($body['turnstile']??''),'remoteip'=>self::ip()]]);
            $result=is_wp_error($verify)?[]:json_decode(wp_remote_retrieve_body($verify),true);
            if(empty($result['success']) || ($result['hostname']??'')!==$public['host'] || ($result['action']??'')!=='fg_lead') { return self::fail(); }
        }
        $attribution=[];
        foreach(self::ATTRIBUTION as $key) {
            $value=$body['attribution'][$key]??'';
            if(is_string($value) && $value!=='') { $attribution[$key]=substr(sanitize_text_field($value),0,200); }
        }
        // One delivery attempt per signed challenge, including simultaneous requests.
        if(!self::gate('used:'.$token,1,3600)) { return self::fail(409); }
        $lead=['id'=>wp_generate_uuid4(),'campaign'=>sanitize_text_field($form['campaign']??''),'page'=>get_permalink($page),'language'=>function_exists('pll_get_post_language')?pll_get_post_language($page):get_locale(),'fields'=>$fields,'attribution'=>$attribution,'submittedAt'=>gmdate('c')];
        $destination=(string)getenv('FG_LEAD_DESTINATION');
        $ok=false;
        if($destination==='email') {
            $to=(string)getenv('FG_LEAD_EMAIL');
            if(is_email($to)) { $ok=wp_mail($to,'Fashion Gate campaign enquiry',wp_json_encode($lead,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT)); }
        } elseif($destination==='webhook') {
            $url=(string)getenv('FG_LEAD_WEBHOOK_URL');
            $key=(string)getenv('FG_LEAD_WEBHOOK_SECRET');
            if(wp_parse_url($url,PHP_URL_SCHEME)==='https' && $key) {
                $json=wp_json_encode($lead);
                $result=wp_safe_remote_post($url,['timeout'=>15,'redirection'=>0,'headers'=>['Content-Type'=>'application/json','X-FG-Signature'=>'sha256='.hash_hmac('sha256',$json,$key),'Idempotency-Key'=>$lead['id']],'body'=>$json]);
                $ok=!is_wp_error($result) && wp_remote_retrieve_response_code($result)>=200 && wp_remote_retrieve_response_code($result)<300;
            }
        } elseif($destination==='existing-contact') {
            // Existing Next endpoint stays untouched. All custom fields/attribution retained in the message.
            $values=array_map(static fn($v)=>$v['value'],$fields);
            $url=$expected.'/api/contact-inquiries';
            $message=[]; foreach($fields as $field) { $message[]=$field['label'].': '.$field['value']; }
            $message[]='Attribution: '.wp_json_encode($attribution);
            if(!empty($values['name']) && !empty($values['email'])) {
                $result=wp_safe_remote_post($url,['timeout'=>20,'redirection'=>0,'headers'=>['Content-Type'=>'application/json'],'body'=>wp_json_encode(['name'=>$values['name'],'email'=>$values['email'],'phone'=>$values['phone']??'','message'=>substr(implode("\n",$message),0,5000),'source'=>'landing:'.substr($lead['campaign'],0,60),'pageUrl'=>$lead['page'],'language'=>str_starts_with((string)$lead['language'],'ar')?'ar':'en'])]);
                $reply=is_wp_error($result)?[]:json_decode(wp_remote_retrieve_body($result),true);
                $ok=!is_wp_error($result) && wp_remote_retrieve_response_code($result)===200 && !empty($reply['success']);
            }
        }
        // No PII logging and no public lead records. Provider is the durable system of record.
        return $ok?self::response(['success'=>true]):self::fail(503);
    }

    public static function get_env_config(string $key, string $default = ''): string {
        $val = (string)getenv($key);
        if ($val !== '') { return $val; }
        if (defined($key)) { return (string)constant($key); }

        static $cached_env = null;
        if ($cached_env === null) {
            $cached_env = [];
            $files = [
                dirname(__DIR__) . '/.env.local',
                dirname(__DIR__, 4) . '/.env.local',
                dirname(ABSPATH, 2) . '/.env.local'
            ];
            foreach ($files as $file) {
                if (file_exists($file)) {
                    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    foreach ($lines as $line) {
                        $line = trim($line);
                        if ($line === '' || str_starts_with($line, '#')) { continue; }
                        $parts = explode('=', $line, 2);
                        if (count($parts) === 2) {
                            $cached_env[trim($parts[0])] = trim(trim($parts[1]), '"\'');
                        }
                    }
                    break;
                }
            }
        }
        if (isset($cached_env[$key])) { return $cached_env[$key]; }

        $defaults = [
            'SANITY_PROJECT_ID' => '4y6hfnze',
            'SANITY_DATASET' => 'production',
            'SANITY_API_WRITE_TOKEN' => '',
            'RESEND_API_KEY' => '',
            'EMAIL_FROM' => 'Fashion Gate Mall <noreply@fashiongatemall.com>',
            'EMAIL_TO' => 'support@fashiongatemall.com',
        ];
        return $defaults[$key] ?? $default;
    }

    public static function query_sanity(string $query, array $params = []) {
        $project_id = self::get_env_config('SANITY_PROJECT_ID', '4y6hfnze');
        $dataset = self::get_env_config('SANITY_DATASET', 'production');
        $token = self::get_env_config('SANITY_API_WRITE_TOKEN');

        $url = 'https://' . $project_id . '.api.sanity.io/v2023-08-01/data/query/' . $dataset . '?query=' . rawurlencode($query);
        foreach ($params as $k => $v) {
            $url .= '&$' . rawurlencode($k) . '=' . rawurlencode(wp_json_encode($v));
        }

        $headers = [];
        if ($token) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        $res = wp_remote_get($url, [
            'timeout' => 8,
            'headers' => $headers
        ]);

        if (is_wp_error($res)) { return null; }
        $body = wp_remote_retrieve_body($res);
        $data = json_decode($body, true);
        return $data['result'] ?? null;
    }

    public static function mutate_sanity(array $mutations): bool {
        $project_id = self::get_env_config('SANITY_PROJECT_ID', '4y6hfnze');
        $dataset = self::get_env_config('SANITY_DATASET', 'production');
        $token = self::get_env_config('SANITY_API_WRITE_TOKEN');
        if (!$token) { return false; }

        $url = 'https://' . $project_id . '.api.sanity.io/v2023-08-01/data/mutate/' . $dataset;
        $res = wp_remote_post($url, [
            'timeout' => 10,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $token
            ],
            'body' => wp_json_encode(['mutations' => $mutations])
        ]);

        if (is_wp_error($res)) { return false; }
        $code = wp_remote_retrieve_response_code($res);
        return ($code >= 200 && $code < 300);
    }

    public static function send_resend_email(string $to, string $subject, string $html, string $text, ?string $reply_to = null): bool {
        $api_key = self::get_env_config('RESEND_API_KEY');
        $from = self::get_env_config('EMAIL_FROM', 'Fashion Gate Mall <noreply@fashiongatemall.com>');
        if (!$api_key) { return false; }

        $payload = [
            'from' => $from,
            'to' => $to,
            'subject' => $subject,
            'html' => $html,
            'text' => $text
        ];
        if ($reply_to) {
            $payload['replyTo'] = $reply_to;
        }

        $res = wp_remote_post('https://api.resend.com/emails', [
            'timeout' => 10,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ],
            'body' => wp_json_encode($payload)
        ]);

        if (is_wp_error($res)) { return false; }
        $code = wp_remote_retrieve_response_code($res);
        return ($code >= 200 && $code < 300);
    }

    private static function render_email_shell(string $eyebrow, string $content_html): string {
        $logo_url = 'https://fashiongatemall.com/brand/logo.png';
        return '<!doctype html><html><body style="margin:0;padding:0;background:#f4efe8;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe8;width:100%;"><tr><td align="center" style="padding:34px 14px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#fbfaf8;border-collapse:collapse;box-shadow:0 22px 60px rgba(17,17,17,0.12);"><tr><td style="background:#111111;padding:34px 34px 30px;text-align:center;"><a href="https://fashiongatemall.com" style="display:inline-block;text-decoration:none;"><img src="' . esc_url($logo_url) . '" width="86" alt="Fashion Gate Mall" style="display:block;margin:0 auto 18px;width:86px;max-width:86px;height:auto;border:0;outline:none;" /></a><div style="font-family:Georgia, serif;font-size:26px;line-height:1;letter-spacing:3px;color:#ffffff;text-transform:uppercase;">Fashion Gate Mall</div><div style="width:56px;height:1px;background:#CB6116;margin:18px auto 0;"></div><div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.6;letter-spacing:2px;color:#c8bdb2;text-transform:uppercase;margin-top:14px;">' . esc_html($eyebrow) . '</div></td></tr><tr><td style="padding:38px 34px;">' . $content_html . '</td></tr><tr><td style="background:#eee6dd;padding:22px 34px;text-align:center;border-top:1px solid #ded2c8;"><p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#756b62;">Fashion Gate Mall, Damascus Boulevard, Syria<br />+963 930 000 000 &bull; support@fashiongatemall.com</p></td></tr></table></td></tr></table></body></html>';
    }

    public static function submit_contact_inquiry($request) {
        if (strlen($request->get_body()) > 24576) { return self::fail(413); }
        $body = $request->get_json_params();
        if (!is_array($body)) { return self::fail(); }
        if (!empty($body['companyWebsite'])) {
            return self::response(['success' => true, 'message' => 'Message sent successfully']);
        }
        $name = sanitize_text_field($body['name'] ?? '');
        $email = strtolower(sanitize_email($body['email'] ?? ''));
        $phone = sanitize_text_field($body['phone'] ?? '');
        $message = sanitize_textarea_field($body['message'] ?? '');
        $language = ($body['language'] ?? 'en') === 'ar' ? 'ar' : 'en';
        $source = sanitize_text_field($body['source'] ?? 'wordpress-landing');
        $pageUrl = esc_url_raw($body['pageUrl'] ?? home_url());

        if (strlen($name) < 2 || !is_email($email) || strlen($message) < 3) {
            return self::fail(400);
        }

        $payload = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message,
            'language' => $language,
            'source' => $source,
            'pageUrl' => $pageUrl,
            'companyWebsite' => ''
        ];

        // 1. Forward directly to Next.js API if available
        $next_urls = [
            'http://host.docker.internal:3000/api/contact-inquiries',
            'http://127.0.0.1:3000/api/contact-inquiries',
            'http://localhost:3000/api/contact-inquiries'
        ];
        foreach ($next_urls as $next_url) {
            $resp = @wp_remote_post($next_url, [
                'timeout' => 6,
                'headers' => ['Content-Type' => 'application/json'],
                'body' => wp_json_encode($payload)
            ]);
            if (!is_wp_error($resp)) {
                $code = wp_remote_retrieve_response_code($resp);
                $reply = json_decode(wp_remote_retrieve_body($resp), true);
                if (is_array($reply) && !empty($reply['success']) && $code >= 200 && $code < 300) {
                    return self::response(['success' => true, 'message' => ($language === 'ar' ? 'تم إرسال رسالتك بنجاح.' : 'Your message has been sent successfully.')]);
                }
            }
        }

        // 2. Direct Sanity dataset submission fallback
        $submittedAt = gmdate('c');
        self::mutate_sanity([
            [
                'create' => [
                    '_type' => 'contactInquiry',
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'message' => $message,
                    'source' => $source,
                    'pageUrl' => $pageUrl,
                    'language' => $language,
                    'status' => 'new',
                    'submittedAt' => $submittedAt
                ]
            ]
        ]);

        // 3. Send email to support & luxury auto-responder to customer via Resend
        $support_email = self::get_env_config('EMAIL_TO', 'support@fashiongatemall.com');
        $support_subj = 'استفسار جديد من الموقع | New Website Enquiry - ' . $name;
        $support_html = self::render_email_shell('New Inquiry / استفسار جديد', '
            <h2 style="font-family:Georgia,serif;font-size:22px;color:#111;margin:0 0 16px;">New Website Contact Inquiry</h2>
            <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:#333;">
                <tr><td style="padding:6px 0;width:120px;font-weight:bold;color:#777;">Name:</td><td>' . esc_html($name) . '</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#777;">Email:</td><td><a href="mailto:' . esc_attr($email) . '" style="color:#CB6116;">' . esc_html($email) . '</a></td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#777;">Phone:</td><td>' . esc_html($phone ?: 'Not provided') . '</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#777;">Language:</td><td>' . esc_html($language) . '</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#777;">Source:</td><td>' . esc_html($source) . '</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#777;">Submitted:</td><td>' . esc_html($submittedAt) . '</td></tr>
            </table>
            <div style="margin-top:20px;padding:18px;background:#f4efe8;border-left:3px solid #CB6116;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#222;">
                ' . nl2br(esc_html($message)) . '
            </div>
        ');
        $support_text = "New Website Contact Inquiry\nName: $name\nEmail: $email\nPhone: $phone\nLanguage: $language\nMessage:\n$message";
        self::send_resend_email($support_email, $support_subj, $support_html, $support_text, $email);

        // Customer auto-responder / acknowledgment email
        $cust_subj = ($language === 'ar') ? 'تم استلام رسالتك | We received your message' : 'We received your message | تم استلام رسالتك';
        $cust_html = self::render_email_shell('Fashion Gate Concierge', '
            <div dir="' . ($language === 'ar' ? 'rtl' : 'ltr') . '" style="text-align:' . ($language === 'ar' ? 'right' : 'left') . ';font-family:Arial,sans-serif;">
                <h2 style="font-family:Georgia,serif;font-size:24px;color:#111;margin:0 0 16px;">' . ($language === 'ar' ? 'شكراً لتواصلك معنا، ' . esc_html($name) : 'Thank you for reaching out, ' . esc_html($name)) . '</h2>
                <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 16px;">' . ($language === 'ar' ? 'وصلت رسالتك إلى فاشن غيت مول. سيقوم فريق خدمة العملاء بمراجعتها والرد عليك قريباً.' : 'Your message has reached Fashion Gate Mall. Our client services team will review it and get back to you shortly.') . '</p>
                <p style="font-size:14px;line-height:1.8;color:#666;margin:0 0 24px;">' . ($language === 'ar' ? 'نقدّر اهتمامك وتواصلك معنا. نسعد دائماً بخدمتكم.' : 'We appreciate you taking the time to contact us. We look forward to assisting you.') . '</p>
                <div style="border-top:1px solid #ded2c8;padding-top:18px;font-size:13px;color:#888;">
                    <strong>Fashion Gate Mall</strong><br />
                    Damascus Boulevard, Syria
                </div>
            </div>
        ');
        $cust_text = "Thank you, $name. Your message has reached Fashion Gate Mall. Our client services team will review it and get back to you shortly.";
        self::send_resend_email($email, $cust_subj, $cust_html, $cust_text);

        return self::response(['success' => true, 'message' => ($language === 'ar' ? 'تم إرسال رسالتك بنجاح.' : 'Your message has been sent successfully.')]);
    }

    public static function submit_newsletter_subscribe($request) {
        if (strlen($request->get_body()) > 4096) { return self::fail(413); }
        if (!self::gate('newsletter:' . self::ip() . ':' . floor(time() / 300), 10, 600)) {
            return self::response(['success' => false, 'message' => 'Too many requests. Please try again later.'], 429);
        }

        $body = $request->get_json_params();
        if (!is_array($body) || !empty($body['companyWebsite'])) {
            return self::fail(400);
        }

        $email = strtolower(trim((string)($body['email'] ?? '')));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 160) {
            return self::response(['success' => false, 'message' => 'Please provide a valid email address.'], 400);
        }

        $language = in_array($body['language'] ?? '', ['ar', 'en'], true) ? $body['language'] : 'en';
        $source = sanitize_text_field($body['source'] ?? 'footer-subscribe');
        $pageUrl = esc_url_raw($body['pageUrl'] ?? '');

        // 1. Proxy to Next.js API if available (host.docker.internal works from Docker to host)
        $next_urls = [
            'http://host.docker.internal:3000/api/newsletter/subscribe',
            'http://127.0.0.1:3000/api/newsletter/subscribe',
            'http://localhost:3000/api/newsletter/subscribe'
        ];
        foreach ($next_urls as $next_url) {
            $next_res = @wp_remote_post($next_url, [
                'timeout' => 6,
                'headers' => ['Content-Type' => 'application/json'],
                'body' => wp_json_encode([
                    'email' => $email,
                    'language' => $language,
                    'source' => $source,
                    'pageUrl' => $pageUrl,
                    'companyWebsite' => ''
                ])
            ]);

            if (!is_wp_error($next_res)) {
                $code = wp_remote_retrieve_response_code($next_res);
                $parsed = json_decode(wp_remote_retrieve_body($next_res), true);
                if (is_array($parsed) && isset($parsed['success']) && $code >= 200 && $code < 300) {
                    return self::response($parsed, $code);
                }
            }
        }

        // 2. Direct Sanity check & mutation fallback
        $subscriber_doc_id = 'newsletterSubscriber.' . hash('sha256', $email);
        $existing = self::query_sanity('*[_id == $id][0]{status, unsubscribeToken}', ['id' => $subscriber_doc_id]);

        if (is_array($existing) && ($existing['status'] ?? '') === 'subscribed') {
            $already_msg = ($language === 'ar') ? 'أنت مشترك بالفعل.' : 'Already subscribed.';
            return self::response([
                'success' => true,
                'code' => 'already_subscribed',
                'message' => $already_msg
            ], 200);
        }

        $unsubscribe_token = (!empty($existing['unsubscribeToken'])) ? $existing['unsubscribeToken'] : wp_generate_uuid4();
        $now = gmdate('c');

        self::mutate_sanity([
            [
                'createIfNotExists' => [
                    '_id' => $subscriber_doc_id,
                    '_type' => 'newsletterSubscriber',
                    'email' => $email,
                    'language' => $language,
                    'status' => 'subscribed',
                    'unsubscribeToken' => $unsubscribe_token,
                    'source' => $source,
                    'pageUrl' => $pageUrl,
                    'subscribedAt' => $now
                ]
            ],
            [
                'patch' => [
                    'id' => $subscriber_doc_id,
                    'set' => [
                        'email' => $email,
                        'language' => $language,
                        'status' => 'subscribed',
                        'unsubscribeToken' => $unsubscribe_token,
                        'source' => $source,
                        'pageUrl' => $pageUrl,
                        'subscribedAt' => $now,
                        'unsubscribedAt' => null
                    ]
                ]
            ]
        ]);

        // 3. Send luxury Welcome Email via Resend
        $unsub_url = 'https://fashiongatemall.com/' . $language . '/newsletter/unsubscribe?token=' . urlencode($unsubscribe_token);
        $welcome_subj = ($language === 'ar') ? 'مرحباً بك في تحديثات فاشن غيت مول | Welcome to Fashion Gate Mall' : 'Welcome to Fashion Gate Mall updates | مرحباً بك في تحديثات فاشن غيت مول';
        $welcome_html = self::render_email_shell('Bespoke Updates / تحديثات خاصة', '
            <div dir="' . ($language === 'ar' ? 'rtl' : 'ltr') . '" style="text-align:' . ($language === 'ar' ? 'right' : 'left') . ';font-family:Arial,sans-serif;">
                <h1 style="font-family:Georgia,serif;font-size:26px;color:#111;margin:0 0 16px;">' . ($language === 'ar' ? 'مرحباً بك في تحديثات فاشن غيت مول' : 'Welcome to Fashion Gate Mall updates') . '</h1>
                <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 14px;">' . ($language === 'ar' ? 'شكراً لاشتراكك في تحديثاتنا الخاصة. ستصلك دعوات مختارة، وإطلاقات المجموعات الموسمية، وأخبار فاشن غيت مول.' : 'Thank you for subscribing to our private updates. You will receive selected invitations, seasonal collection launches, and refined notes from Fashion Gate Mall.') . '</p>
                <p style="font-size:14px;line-height:1.8;color:#666;margin:0 0 24px;">' . ($language === 'ar' ? 'تم اشتراكك بنجاح. سنبقيك قريباً من أحدث الفعاليات والتجارب الحصرية.' : 'You are subscribed. We will keep you close to our latest events and bespoke boutique experiences.') . '</p>
                <div style="margin-top:24px;padding-top:16px;border-top:1px solid #ded2c8;font-size:12px;color:#888;">
                    <a href="' . esc_url($unsub_url) . '" style="color:#CB6116;text-decoration:underline;">' . ($language === 'ar' ? 'إلغاء الاشتراك' : 'Unsubscribe') . '</a>
                </div>
            </div>
        ');
        $welcome_text = "Welcome to Fashion Gate Mall updates. Thank you for subscribing to our private updates.";
        self::send_resend_email($email, $welcome_subj, $welcome_html, $welcome_text);

        $success_msg = ($language === 'ar') ? 'تم الاشتراك بنجاح.' : 'Subscribed successfully.';
        return self::response(['success' => true, 'message' => $success_msg, 'code' => 'subscribed'], 200);
    }
}

