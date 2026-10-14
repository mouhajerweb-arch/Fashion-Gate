<?php
namespace FashionGate\ElementorExperience;
use Elementor\Controls_Manager as C;
defined('ABSPATH') || exit;
final class MotionControls {
    public static function boot(): void {
        add_action('elementor/element/after_section_end', [self::class, 'controls'], 10, 3);
        add_action('elementor/frontend/before_render', [self::class, 'attributes']);
    }
    public static function controls($element, $section, $args): void {
        if (!in_array($section, ['_section_style', 'section_layout'], true)) { return; }
        if ($section === 'section_layout' && !in_array($element->get_name(), ['container', 'section', 'column'], true)) { return; }
        $element->start_controls_section('fg_motion', ['label' => 'Fashion Gate Motion', 'tab' => C::TAB_ADVANCED]);
        $options = [];
        foreach (['none','fade','fade-up','fade-down','reveal-left','reveal-right','mask-up','mask-down','scale-reveal','blur-reveal','parallax','text-reveal'] as $v) { $options[$v] = ucwords(str_replace('-', ' ', $v)); }
        $element->add_control('fg_animation', ['label'=>'Animation','type'=>C::SELECT,'options'=>$options,'default'=>'none']);
        $element->add_control('fg_trigger', ['label'=>'Trigger','type'=>C::SELECT,'options'=>['load'=>'On load','viewport'=>'Enter viewport','progress'=>'Scroll progress'],'default'=>'viewport']);
        foreach (['duration'=>[.8,.1,3,.1], 'delay'=>[0,0,2,.1], 'stagger'=>[.08,0,.5,.01], 'strength'=>[10,0,30,1], 'scrub'=>[0,0,3,.1]] as $name=>$values) {
            $element->add_control('fg_'.$name, ['label'=>ucfirst($name),'type'=>C::NUMBER,'default'=>$values[0],'min'=>$values[1],'max'=>$values[2],'step'=>$values[3]]);
        }
        $element->add_control('fg_ease', ['label'=>'Easing','type'=>C::SELECT,'default'=>'power2.out','options'=>array_combine(['none','power2.out','power3.out','expo.out'],['Linear','Soft','Editorial','Cinematic'])]);
        $element->add_control('fg_start', ['label'=>'Start','type'=>C::SELECT,'default'=>'top 85%','options'=>['top 85%'=>'Top at 85%','top center'=>'Top at center','top top'=>'Top at top']]);
        $element->add_control('fg_end', ['label'=>'End','type'=>C::SELECT,'default'=>'bottom top','options'=>['bottom top'=>'Bottom at top','bottom center'=>'Bottom at center','+=100%'=>'One viewport']]);
        $element->add_control('fg_pin', ['label'=>'Pin on desktop','type'=>C::SWITCHER,'default'=>'']);
        foreach (['desktop'=>'yes','tablet'=>'yes','mobile'=>''] as $device=>$default) {
            $element->add_control('fg_'.$device, ['label'=>ucfirst($device).' enabled','type'=>C::SWITCHER,'default'=>$default]);
        }
        $element->add_control('fg_reduced', ['label'=>'Reduced motion','type'=>C::SELECT,'default'=>'none','options'=>['none'=>'Show immediately','fade'=>'Brief opacity only']]);
        $element->end_controls_section();
    }
    public static function attributes($element): void {
        $s = $element->get_settings_for_display();
        if (empty($s['fg_animation']) || $s['fg_animation'] === 'none') { return; }
        foreach (['animation','trigger','duration','delay','stagger','strength','scrub','ease','start','end','pin','desktop','tablet','mobile','reduced'] as $key) {
            $element->add_render_attribute('_wrapper', 'data-fg-'.$key, esc_attr((string)($s['fg_'.$key] ?? '')));
        }
    }
}
