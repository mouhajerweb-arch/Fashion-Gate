<?php
/** Execute real lead handler in PHP; WordPress transport/database functions are test doubles. */
define('ABSPATH','/');
function add_action(...$args) {}
function wp_salt($scheme) { return 'local-fixture-salt-'.$scheme; }
function home_url() { return 'https://www.fashiongatemall.com/landing'; }
function get_post_status($id) { return $id===42?'publish':'draft'; }
function post_password_required($id) { return false; }
function get_post_meta(...$args) { return $GLOBALS['fixture']; }
function sanitize_key($value) { return preg_replace('/[^a-z0-9_-]/','',strtolower((string)$value)); }
function sanitize_text_field($value) { return trim(strip_tags((string)$value)); }
function sanitize_textarea_field($value) { return sanitize_text_field($value); }
function is_email($value) { return filter_var($value,FILTER_VALIDATE_EMAIL); }
function wp_generate_uuid4() { return '11111111-1111-4111-8111-111111111111'; }
function wp_generate_password(...$args) { return 'fixturechallenge'; }
function get_permalink($id) { return 'https://www.fashiongatemall.com/landing/test'; }
function get_locale() { return 'en_US'; }
function wp_json_encode($value,$flags=0) { return json_encode($value,$flags); }
function wp_mail(...$args) { $GLOBALS['delivered']++; return true; }
class WP_REST_Response {
    public function __construct(public $data,public $status=200) {}
    public function header(...$args) {}
}
class FixtureDB {
    public $prefix='wp_'; public $counts=[];
    public function prepare($sql,...$args) {
        foreach($args as $arg) { $sql=preg_replace('/%[sd]/',is_int($arg)?(string)$arg:"'".$arg."'",$sql,1); } return $sql;
    }
    public function query($sql) { preg_match("/'([a-f0-9]{64})'/",$sql,$m); if(!empty($m[1])) { $this->counts[$m[1]]=($this->counts[$m[1]]??0)+1; } return 1; }
    public function get_var($sql) { preg_match("/'([a-f0-9]{64})'/",$sql,$m); return $this->counts[$m[1]]??0; }
}
class FixtureRequest {
    public function __construct(public array $data,public string $origin='https://www.fashiongatemall.com') {}
    public function get_body() { return json_encode($this->data); }
    public function get_header($name) { return $this->origin; }
    public function get_json_params() { return $this->data; }
}
$wpdb=new FixtureDB(); $delivered=0; $_SERVER['REMOTE_ADDR']='127.0.0.1';
require '/Leads.php';
$fixture=json_encode([['id'=>'lead123','widgetType'=>'fg-lead-experience','settings'=>['campaign'=>'qa','fields'=>[['key'=>'email','label'=>'Email','type'=>'email','required'=>'yes'],['key'=>'consent','label'=>'Consent','type'=>'checkbox','required'=>'yes']]]]]);
$signed=(time()-3).'.fixture';
$token=$signed.'.'.hash_hmac('sha256',$signed,wp_salt('nonce'));
$base=['pageId'=>42,'widget'=>'lead123','token'=>$token,'fields'=>['email'=>'qa@example.invalid','consent'=>'yes']];
$run=static function($data,$expected,$name,$origin='https://www.fashiongatemall.com') {
    $response=\FashionGate\ElementorExperience\Leads::submit(new FixtureRequest($data,$origin));
    if($response->status!==$expected) { throw new Exception($name.': expected '.$expected.', got '.$response->status); }
    echo $name.'='.$response->status."\n";
};
$run($base,403,'foreign-origin','https://attacker.invalid');
$invalid=$base;$invalid['fields']['email']='invalid';$run($invalid,400,'invalid-email');
$invalid=$base;$invalid['companyWebsite']='bot';$run($invalid,400,'honeypot');
$invalid=$base;$invalid['pageId']=2;$run($invalid,400,'unpublished');
$invalid=$base;$invalid['token']='forged';$run($invalid,400,'invalid-token');
putenv('FG_LEAD_DESTINATION=email');putenv('FG_LEAD_EMAIL=qa@example.invalid');
$run($base,200,'confirmed-mock-delivery');
if($delivered!==1) { throw new Exception('Expected one delivery'); }
$run($base,409,'replay');
if($delivered!==1) { throw new Exception('Replay delivered'); }
$invalid=$base;$invalid['fields']['consent']='';$run($invalid,400,'required-consent');
$run($base,409,'eighth-request-replay');
$run($base,429,'rate-limit');
