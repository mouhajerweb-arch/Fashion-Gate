<?php
/** Only mounted by local Playground. Never included in deployment ZIPs. */
define('WP_ADMIN', true);
require '/wordpress/wp-load.php';
wp_set_current_user(1);
global $polylang;
update_option('permalink_structure','/%postname%');
update_option('elementor_experiment-container','active');
delete_option('wpseo_redirect_after_install');
// Mock mail transport for explicit QA requests only; no message leaves this fixture.
wp_mkdir_p(WPMU_PLUGIN_DIR);
file_put_contents(WPMU_PLUGIN_DIR.'/fg-qa-mail.php', '<?php if (($_SERVER["HTTP_X_FG_QA_DELIVERY"]??"")==="mock") { putenv("FG_LEAD_DESTINATION=email"); putenv("FG_LEAD_EMAIL=qa@example.invalid"); add_filter("pre_wp_mail", static fn()=>true); }');
foreach ([['en','en_US','English',false],['ar','ar','العربية',true]] as [$slug,$locale,$name,$rtl]) {
    if(!$polylang->model->get_language($slug)) { $polylang->model->languages->add(['slug'=>$slug,'locale'=>$locale,'name'=>$name,'rtl'=>$rtl]); }
}
$pairs=[];
foreach(['en','ar'] as $lang) {
    $raw=file_get_contents(WP_PLUGIN_DIR.'/fashiongate-elementor-experience/templates/immersive-landing-'.$lang.'.json');
    $raw=str_replace('https://www.fashiongatemall.com/landing/wp-content/plugins/fashiongate-elementor-experience/',plugins_url('fashiongate-elementor-experience/'),$raw);
    $data=json_decode($raw,true);
    $existing=get_page_by_path('qa-campaign-'.$lang,OBJECT,'page');
    $id=wp_insert_post(['ID'=>$existing?$existing->ID:0,'post_type'=>'page','post_status'=>'publish','post_title'=>'Fashion Gate '.$lang,'post_name'=>'qa-campaign-'.$lang]);
    update_post_meta($id,'_elementor_edit_mode','builder');
    update_post_meta($id,'_elementor_data',wp_slash(wp_json_encode($data['content'])));
    update_post_meta($id,'_elementor_page_settings',['hide_title'=>'yes']);
    update_post_meta($id,'_wp_page_template','elementor_canvas');
    pll_set_post_language($id,$lang);
    $pairs[$lang]=$id;
    if($lang==='en') { update_option('show_on_front','page'); update_option('page_on_front',$id); }
}
pll_save_post_translations($pairs);
$settings=json_decode(file_get_contents(WP_PLUGIN_DIR.'/fashiongate-elementor-experience/templates/global-settings.json'),true);
Elementor\Plugin::$instance->kits_manager->get_active_kit()->update_settings($settings['page_settings']);
flush_rewrite_rules();
Elementor\Plugin::$instance->files_manager->clear_cache();
echo 'FG_FIXTURE_READY '.wp_json_encode($pairs);
