<?php
namespace FashionGate\ElementorExperience;
use Elementor\Controls_Manager as C;
use Elementor\Group_Control_Typography;
use Elementor\Repeater;
defined('ABSPATH') || exit;

/** Small capability widgets; page composition always belongs to Elementor containers. */
class ExperienceWidget extends \Elementor\Widget_Base {
    public const KINDS = [
        'announcement-bar' => 'Announcement Marquee Bar',
        'fashion-header' => 'Main Fashion Header',
        'animated-hero' => 'Animated Hero',
        'horizontal-showcase' => 'Horizontal Showcase',
        'editorial-banner' => 'Editorial Banner',
        'reveal-heading' => 'Reveal Heading',
        'editorial-media' => 'Editorial Media',
        'luxury-cards' => 'Luxury Cards',
        'marquee' => 'Marquee',
        'atelier-contact' => 'Atelier Contact Section',
        'site-footer' => 'Luxury Site Footer',
        'lead-experience' => 'Lead Experience',
        'brand-manifesto' => 'Brand Manifesto'
    ];
    private string $kind;

    public function __construct($data = [], $args = null, $kind = 'animated-hero') {
        $candidate = isset($data['widgetType']) ? substr($data['widgetType'], 3) : $kind;
        $this->kind = isset(self::KINDS[$candidate]) ? $candidate : $kind;
        parent::__construct($data, $args);
    }

    public function get_name() { return 'fg-'.$this->kind; }
    public function get_title() { return 'Fashion Gate '.self::KINDS[$this->kind]; }
    public function get_icon() { return 'eicon-star'; }
    public function get_categories() { return ['fashiongate']; }
    public function get_style_depends() { return ['fg-experience']; }
    public function get_script_depends() { return ['fg-frontend','fg-motion']; }

    protected function register_controls() {
        $this->start_controls_section('fg_content', ['label'=>'Content']);

        if ($this->kind === 'announcement-bar') {
            $this->add_control('show_announcement', ['label' => 'Show Marquee', 'type' => C::SWITCHER, 'default' => 'yes']);
            $this->add_control('speed', ['label' => 'Scroll Speed (seconds)', 'type' => C::NUMBER, 'min' => 5, 'max' => 120, 'default' => 35]);
            $r_ann = new Repeater();
            $r_ann->add_control('text', ['label' => 'Message Text', 'type' => C::TEXT]);
            $r_ann->add_control('link', ['label' => 'Message Link', 'type' => C::URL]);
            $this->add_control('messages', ['label' => 'Announcement Messages', 'type' => C::REPEATER, 'fields' => $r_ann->get_controls(), 'title_field' => '{{{ text }}}']);
        } elseif ($this->kind === 'fashion-header') {
            $this->add_control('logo', ['label' => 'Fashion Gate Logo', 'type' => C::MEDIA, 'dynamic' => ['active' => true]]);
            $this->add_control('logo_url', ['label' => 'Logo Link', 'type' => C::URL, 'default' => ['url' => '/']]);
            $this->add_control('show_header_contacts', ['label' => 'Show Contact Links (WhatsApp & Phone)', 'type' => C::SWITCHER, 'default' => 'no']);
            $this->add_control('fashiongatelabel', ['label' => 'Header Brand Text', 'type' => C::TEXT, 'default' => 'FASHION GATE MALL']);
            $this->add_control('whatsapp_label', ['label' => 'WhatsApp Label', 'type' => C::TEXT, 'default' => 'WhatsApp Us']);
            $this->add_control('whatsapp_number', ['label' => 'WhatsApp Display Number', 'type' => C::TEXT, 'default' => '+963 930 000 000']);
            $this->add_control('whatsapp_url', ['label' => 'WhatsApp Destination URL', 'type' => C::URL, 'default' => ['url' => 'https://wa.me/963930000000']]);
            $this->add_control('phone_number', ['label' => 'Phone Number', 'type' => C::TEXT, 'default' => '+963 930 000 000']);
            $this->add_control('phone_url', ['label' => 'Phone Link (tel:)', 'type' => C::URL, 'default' => ['url' => 'tel:+963930000000']]);
            $this->add_control('x_url', ['label' => 'X (Twitter) Link', 'type' => C::URL, 'default' => ['url' => 'https://x.com/fashiongatemall']]);
            $this->add_control('instagram_url', ['label' => 'Instagram Link', 'type' => C::URL, 'default' => ['url' => 'https://www.instagram.com/fashiongatemall']]);
            $this->add_control('facebook_url', ['label' => 'Facebook Link', 'type' => C::URL, 'default' => ['url' => 'https://www.facebook.com/fashiongatemall']]);
            $this->add_control('lang_label', ['label' => 'Language Button Label', 'type' => C::TEXT, 'default' => 'EN']);
            $this->add_control('lang_url', ['label' => 'Language Switch Link', 'type' => C::URL, 'default' => ['url' => '?lang=ar']]);
            $this->add_control('flag_image', ['label' => 'Custom Flag Image', 'type' => C::MEDIA]);
        } elseif ($this->kind === 'editorial-banner') {
            $this->add_control('banner_theme', [
                'label' => 'Banner Theme',
                'type' => C::SELECT,
                'default' => 'perfume',
                'options' => [
                    'perfume' => 'Perfume (Sage & Pearl Elegance)',
                    'skincare' => 'Skincare (Warm Luxury Orange)',
                    'curated' => 'Curated Fashion (Minimal Model Banner)'
                ]
            ]);
            $this->add_control('banner_image', [
                'label' => 'Banner Image',
                'type' => C::MEDIA,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('eyebrow', [
                'label' => 'Eyebrow',
                'type' => C::TEXT,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('title', [
                'label' => 'Title / Heading',
                'type' => C::TEXT,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('deal_highlight', [
                'label' => 'Deal Highlight Text (Perfume)',
                'type' => C::TEXT,
                'default' => 'Up To <span class="fg-highlight-teal">50%</span> Discount!',
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('skincare_highlight', [
                'label' => 'Deal Highlight Text (Skincare)',
                'type' => C::TEXT,
                'default' => '<span class="fg-skincare-white-accent">50%</span> Massive',
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('quote_text', [
                'label' => 'Quote Description',
                'type' => C::TEXTAREA,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('quote_author', [
                'label' => 'Quote Author',
                'type' => C::TEXT,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('cta', [
                'label' => 'Button Label',
                'type' => C::TEXT,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('link', [
                'label' => 'Button Link',
                'type' => C::URL,
                'dynamic' => ['active' => true]
            ]);
        } elseif ($this->kind === 'brand-manifesto') {
            $this->add_control('eyebrow', [
                'label' => 'Eyebrow',
                'type' => C::TEXT,
                'default' => 'WHERE GLOBAL COUTURE MEETS DAMASCUS',
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('quote_text', [
                'label' => 'Quote / Manifesto',
                'type' => C::TEXTAREA,
                'default' => '"Syria has never had a luxury mall of this scale. Fashion Gate Mall Syria is not just a business. It is the reopening of Syria to the world through fashion."',
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('subtitle', [
                'label' => 'Subtitle',
                'type' => C::TEXT,
                'default' => 'On Boulevard. For the world...',
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('signature_image', [
                'label' => 'Signature Graphic',
                'type' => C::MEDIA,
                'dynamic' => ['active' => true]
            ]);
            $this->add_control('signature_text', [
                'label' => 'Signature Text',
                'type' => C::TEXT,
                'default' => 'Fashion Gate',
                'dynamic' => ['active' => true]
            ]);
        } elseif ($this->kind === 'atelier-contact') {
            $this->add_control('atelier_title', ['label' => 'Atelier Section Title', 'type' => C::TEXT, 'default' => 'Visit The Atelier', 'dynamic' => ['active' => true]]);
            $this->add_control('atelier_text', ['label' => 'Atelier Address', 'type' => C::TEXTAREA, 'default' => "Fashion Gate Mall, Damascus Boulevard\nDamascus, Syria", 'dynamic' => ['active' => true]]);
            $this->add_control('hours_title', ['label' => 'Hours Heading', 'type' => C::TEXT, 'default' => 'Opening Hours', 'dynamic' => ['active' => true]]);
            $this->add_control('hours_text', ['label' => 'Hours Text', 'type' => C::TEXTAREA, 'default' => "Mon. – Sun.\n11:00 AM – 9:00 PM", 'dynamic' => ['active' => true]]);
            $this->add_control('email_title', ['label' => 'Email Heading', 'type' => C::TEXT, 'default' => 'Email Us', 'dynamic' => ['active' => true]]);
            $this->add_control('email_text', ['label' => 'Email Address', 'type' => C::TEXT, 'default' => 'support@fashiongatemall.com', 'dynamic' => ['active' => true]]);
            $this->add_control('model_image', ['label' => 'Portrait Model Image', 'type' => C::MEDIA, 'dynamic' => ['active' => true]]);
            $this->add_control('form_cursive', ['label' => 'Cursive Eyebrow', 'type' => C::TEXT, 'default' => 'Write to us', 'dynamic' => ['active' => true]]);
            $this->add_control('form_title', ['label' => 'Form Heading', 'type' => C::TEXT, 'default' => 'Send A Message', 'dynamic' => ['active' => true]]);
            $this->add_control('form_sub', ['label' => 'Form Subtitle', 'type' => C::TEXTAREA, 'default' => 'A personal advisor will be in touch within 24 hours.', 'dynamic' => ['active' => true]]);
            $this->add_control('modal_title', ['label' => 'Floating Modal Title', 'type' => C::TEXT, 'default' => 'Get in touch', 'dynamic' => ['active' => true]]);
            $this->add_control('btn_text', ['label' => 'Submit Button Label', 'type' => C::TEXT, 'default' => 'SEND MESSAGE', 'dynamic' => ['active' => true]]);
        } elseif ($this->kind === 'site-footer') {
            $this->add_control('brand_title', ['label' => 'Footer Brand Title', 'type' => C::TEXT, 'default' => 'FASHION GATE', 'dynamic' => ['active' => true]]);
            $this->add_control('boulevard_text', ['label' => 'Boulevard Text', 'type' => C::TEXT, 'default' => 'BOULEVARD DAMASCUS', 'dynamic' => ['active' => true]]);
            $this->add_control('monogram', ['label' => 'Monogram Logo', 'type' => C::MEDIA, 'dynamic' => ['active' => true]]);
            $this->add_control('desc', ['label' => 'Brand Description', 'type' => C::TEXTAREA, 'default' => "Syria's first luxury department destination. Integrating fine apparel, curated beauty, and bespoke boutique shopping under a modern architectural vision.", 'dynamic' => ['active' => true]]);
            $this->add_control('updates_title', ['label' => 'Newsletter Title', 'type' => C::TEXT, 'default' => 'Bespoke Updates', 'dynamic' => ['active' => true]]);
            $this->add_control('subscribe_desc', ['label' => 'Newsletter Description', 'type' => C::TEXTAREA, 'default' => 'Subscribe to receive private invitations, seasonal collection launches, and atelier journal notes.', 'dynamic' => ['active' => true]]);
            $this->add_control('placeholder', ['label' => 'Email Input Placeholder', 'type' => C::TEXT, 'default' => 'Email address', 'dynamic' => ['active' => true]]);
            $this->add_control('copyright', ['label' => 'Copyright Note', 'type' => C::TEXT, 'default' => 'All rights reserved.', 'dynamic' => ['active' => true]]);
            $this->add_control('instagram_url', ['label' => 'Instagram URL', 'type' => C::URL, 'default' => ['url' => 'https://www.instagram.com/fashiongatemall']]);
            $this->add_control('facebook_url', ['label' => 'Facebook URL', 'type' => C::URL, 'default' => ['url' => 'https://www.facebook.com/fashiongatemall']]);
            $this->add_control('whatsapp_url', ['label' => 'WhatsApp URL', 'type' => C::URL, 'default' => ['url' => 'https://wa.me/963930000000']]);
            $this->add_control('tiktok_url', ['label' => 'TikTok URL', 'type' => C::URL, 'default' => ['url' => 'https://www.tiktok.com/@fashiongatemall']]);
            $this->add_control('youtube_url', ['label' => 'YouTube URL', 'type' => C::URL, 'default' => ['url' => 'https://www.youtube.com/@fashiongatemall']]);
            $this->add_control('x_url', ['label' => 'X (Twitter) URL', 'type' => C::URL, 'default' => ['url' => 'https://x.com/fashiongatemall']]);
        } elseif ($this->kind === 'marquee') {
            $this->add_control('speed', ['label' => 'Scroll Speed (seconds)', 'type' => C::NUMBER, 'min' => 10, 'max' => 300, 'default' => 110]);
            $this->add_control('direction', ['label' => 'Direction', 'type' => C::SELECT, 'default' => 'normal', 'options' => ['normal' => 'Forward', 'reverse' => 'Reverse']]);
            $this->add_responsive_control('logo_height', [
                'label' => 'Logo Size / Height (px)',
                'type' => C::SLIDER,
                'size_units' => ['px', 'rem', 'em'],
                'range' => [
                    'px' => [
                        'min' => 15,
                        'max' => 140,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 38,
                ],
                'selectors' => [
                    '{{WRAPPER}} .fg-brand-logo-marquee' => '--fg-marquee-logo-h: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .fg-marquee-logo-img' => 'height: {{SIZE}}{{UNIT}} !important; max-height: {{SIZE}}{{UNIT}} !important;',
                    '{{WRAPPER}} .fg-marquee-brand-item' => 'height: calc({{SIZE}}{{UNIT}} + 12px) !important;',
                ],
            ]);
            $r_b = new Repeater();
            $r_b->add_control('title', ['label' => 'Brand Name', 'type' => C::TEXT]);
            $r_b->add_control('logo', ['label' => 'Brand Logo', 'type' => C::MEDIA]);
            $r_b->add_control('url', ['label' => 'Brand Link', 'type' => C::URL]);
            $r_b->add_control('logo_height', [
                'label' => 'Custom Logo Height (px)',
                'type' => C::NUMBER,
                'min' => 10,
                'max' => 180,
                'step' => 1,
                'description' => 'Set height for this specific logo (e.g. 38, 45, 52). Overrides global slider.',
            ]);
            $r_b->add_control('logo_width', [
                'label' => 'Max Width (px)',
                'type' => C::NUMBER,
                'min' => 20,
                'max' => 500,
                'step' => 5,
                'description' => 'Optional maximum width constraint.',
            ]);
            $this->add_control('brands', ['label' => 'Brand Logos', 'type' => C::REPEATER, 'fields' => $r_b->get_controls(), 'title_field' => '{{{ title }}}']);
        } else {
            foreach (['eyebrow'=>'Eyebrow','title'=>'Heading','subtitle'=>'Subtitle','body'=>'Description','cta'=>'Button label'] as $key=>$label) {
                $this->add_control($key,['label'=>$label,'type'=>$key==='body'?C::TEXTAREA:C::TEXT,'dynamic'=>['active'=>true]]);
            }
            $this->add_control('tag',['label'=>'Heading tag','type'=>C::SELECT,'default'=>$this->kind==='animated-hero'?'h1':'h2','options'=>array_combine(['h1','h2','h3','h4','p'],['H1','H2','H3','H4','Paragraph'])]);
            $this->add_control('link',['label'=>'Button link','type'=>C::URL,'dynamic'=>['active'=>true]]);

            if (in_array($this->kind,['animated-hero','editorial-media'],true)) {
                if ($this->kind === 'animated-hero') {
                    $this->add_control('hero_media_type', [
                        'label' => 'Hero Media Mode',
                        'type' => C::SELECT,
                        'default' => 'video',
                        'options' => [
                            'video' => 'Background Video (MP4)',
                            'image' => 'Static Background Image'
                        ]
                    ]);
                    $this->add_control('video_file', [
                        'label' => 'Upload Background Video (MP4)',
                        'type' => C::MEDIA,
                        'media_type' => 'video',
                        'condition' => ['hero_media_type' => 'video']
                    ]);
                }
                foreach (['image'=>'Hero Image / Video Poster','mobile_image'=>'Mobile Image'] as $key=>$label) { $this->add_control($key,['label'=>$label,'type'=>C::MEDIA,'dynamic'=>['active'=>true]]); }
                $this->add_control('alt',['label'=>'Image description (blank for decorative)','type'=>C::TEXT]);
                $this->add_control('video',['label'=>'Video External URL / Fallback','type'=>C::URL,'options'=>['url']]);
                $this->add_control('secondary_cta',['label'=>'Secondary button label','type'=>C::TEXT]);
                $this->add_control('secondary_link',['label'=>'Secondary button link','type'=>C::URL]);

                if ($this->kind === 'animated-hero') {
                    $r_nav = new Repeater();
                    $r_nav->add_control('label', ['label' => 'Link Label', 'type' => C::TEXT]);
                    $r_nav->add_control('link', ['label' => 'Link URL', 'type' => C::URL]);
                    $this->add_control('bottom_nav', ['label' => 'Bottom Campaign Navigation', 'type' => C::REPEATER, 'fields' => $r_nav->get_controls(), 'title_field' => '{{{ label }}}']);
                }
            }
            if (in_array($this->kind,['horizontal-showcase','luxury-cards'],true)) {
                if ($this->kind === 'horizontal-showcase') {
                    $this->add_control('collection_type', [
                        'label' => 'Collection Type',
                        'type' => C::SELECT,
                        'default' => 'clothes',
                        'options' => [
                            'clothes' => 'Clothes (Fashion)',
                            'perfume' => 'Perfume (Rare Fragrances)',
                            'skincare' => 'Skincare (Beauty Rituals)'
                        ]
                    ]);
                }
                $r=new Repeater();
                foreach (['title','label','body','alt'] as $key) { $r->add_control($key,['label'=>ucfirst($key),'type'=>C::TEXT]); }
                $r->add_control('image',['label'=>'Image','type'=>C::MEDIA]);
                $r->add_control('hover_image',['label'=>'Alternate hover image','type'=>C::MEDIA]);
                $r->add_control('link',['label'=>'Link','type'=>C::URL]);
                $this->add_control('cards',['label'=>'Cards','type'=>C::REPEATER,'fields'=>$r->get_controls(),'title_field'=>'{{{ title }}}']);
            }
            if ($this->kind==='reveal-heading') {
                $this->add_control('split',['label'=>'Text grouping','type'=>C::SELECT,'default'=>'lines','options'=>['lines'=>'Lines (explicit line breaks)','words'=>'Words (English only)']]);
                $this->add_control('reveal_text',['label'=>'Heading text (one line per row)','type'=>C::TEXTAREA]);
                $this->add_control('decorative',['label'=>'Decorative background text','type'=>C::SWITCHER]);
            }
            if ($this->kind==='marquee') {
                $this->add_control('marquee_image',['label'=>'Optional logo/image','type'=>C::MEDIA]);
                $this->add_control('speed',['label'=>'Cycle seconds','type'=>C::NUMBER,'min'=>10,'max'=>120,'default'=>35]);
                $this->add_control('direction',['label'=>'Direction','type'=>C::SELECT,'default'=>'normal','options'=>['normal'=>'Forward','reverse'=>'Reverse']]);
            }
            if ($this->kind==='lead-experience') {
                $this->add_control('campaign',['label'=>'Campaign identifier','type'=>C::TEXT]);
                $r=new Repeater();
                $r->add_control('key',['label'=>'Stable field ID (letters/numbers/underscore)','type'=>C::TEXT]);
                $r->add_control('label',['label'=>'Label','type'=>C::TEXT]);
                $r->add_control('placeholder',['label'=>'Placeholder','type'=>C::TEXT]);
                $r->add_control('type',['label'=>'Type','type'=>C::SELECT,'default'=>'text','options'=>array_combine(['text','email','tel','textarea','select','checkbox'],['Text','Email','Phone','Message','Select','Consent'])]);
                $r->add_control('options',['label'=>'Select options (one per line)','type'=>C::TEXTAREA]);
                $r->add_control('required',['label'=>'Required','type'=>C::SWITCHER,'default'=>'yes']);
                $this->add_control('fields',['label'=>'Form fields','type'=>C::REPEATER,'fields'=>$r->get_controls(),'title_field'=>'{{{ label }}}']);
                $this->add_control('success',['label'=>'Success message','type'=>C::TEXTAREA]);
                $this->add_control('error',['label'=>'Error message','type'=>C::TEXTAREA]);
                $this->add_control('privacy',['label'=>'Privacy policy','type'=>C::URL]);
                $this->add_control('privacy_label',['label'=>'Privacy link label','type'=>C::TEXT]);
            }
        }
        $this->end_controls_section();

        $this->start_controls_section('fg_style',['label'=>'Style','tab'=>C::TAB_STYLE]);
        if ($this->kind === 'announcement-bar') {
            $this->add_control('announcement_bg', ['label' => 'Background Color', 'type' => C::COLOR, 'selectors' => ['{{WRAPPER}} .fg-announcement-bar' => 'background-color: {{VALUE}};']]);
            $this->add_control('announcement_text_color', ['label' => 'Text Color', 'type' => C::COLOR, 'selectors' => ['{{WRAPPER}} .fg-announcement-bar' => 'color: {{VALUE}};', '{{WRAPPER}} .fg-announcement-item a' => 'color: {{VALUE}};']]);
        } elseif ($this->kind === 'fashion-header') {
            $this->add_control('header_bg', ['label' => 'Header Background', 'type' => C::COLOR, 'selectors' => ['{{WRAPPER}} .fg-main-header' => 'background-color: {{VALUE}};']]);
            $this->add_control('header_text_color', ['label' => 'Header Text Color', 'type' => C::COLOR, 'selectors' => ['{{WRAPPER}} .fg-main-header' => 'color: {{VALUE}};', '{{WRAPPER}} .fg-header-contact-link' => 'color: {{VALUE}};', '{{WRAPPER}} .fg-social-icon-link' => 'color: {{VALUE}};']]);
        } elseif ($this->kind === 'marquee') {
            $this->add_responsive_control('style_logo_height', [
                'label' => 'Logo Size / Height (px)',
                'type' => C::SLIDER,
                'size_units' => ['px', 'rem', 'em'],
                'range' => [
                    'px' => [
                        'min' => 15,
                        'max' => 140,
                        'step' => 1,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .fg-brand-logo-marquee' => '--fg-marquee-logo-h: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .fg-marquee-logo-img' => 'height: {{SIZE}}{{UNIT}} !important; max-height: {{SIZE}}{{UNIT}} !important;',
                    '{{WRAPPER}} .fg-marquee-brand-item' => 'height: calc({{SIZE}}{{UNIT}} + 12px) !important;',
                ],
            ]);
            $this->add_responsive_control('style_logo_gap', [
                'label' => 'Spacing Between Logos',
                'type' => C::SLIDER,
                'size_units' => ['px', 'rem'],
                'range' => [
                    'px' => [
                        'min' => 20,
                        'max' => 160,
                        'step' => 2,
                    ],
                    'rem' => [
                        'min' => 1,
                        'max' => 10,
                    ]
                ],
                'selectors' => [
                    '{{WRAPPER}} .fg-marquee-group' => 'gap: {{SIZE}}{{UNIT}} !important; padding-inline-end: {{SIZE}}{{UNIT}} !important;',
                ],
            ]);
            $this->add_control('logo_opacity', [
                'label' => 'Logo Opacity',
                'type' => C::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 0.2,
                        'max' => 1,
                        'step' => 0.05,
                    ],
                ],
                'default' => [
                    'size' => 0.95,
                ],
                'selectors' => [
                    '{{WRAPPER}} .fg-marquee-logo-img' => 'opacity: {{SIZE}} !important;',
                ],
            ]);
        } else {
            foreach (['text_color'=>['Text color','.fg-copy'],'heading_color'=>['Heading color','.fg-heading'],'button_color'=>['Button text','.fg-button'],'button_background'=>['Button background','.fg-button']] as $key=>$def) {
                $this->add_control($key,['label'=>$def[0],'type'=>C::COLOR,'selectors'=>['{{WRAPPER}} '.$def[1]=>($key==='button_background'?'background-color':'color').': {{VALUE}};']]);
            }
            foreach (['heading'=>'.fg-heading','body'=>'.fg-copy','button'=>'.fg-button'] as $name=>$selector) {
                $this->add_group_control(Group_Control_Typography::get_type(),['name'=>$name.'_typography','selector'=>'{{WRAPPER}} '.$selector]);
            }
            if($this->kind==='lead-experience') {
                $this->add_group_control(Group_Control_Typography::get_type(),['name'=>'field_typography','selector'=>'{{WRAPPER}} .fg-field']);
                foreach(['field_color'=>['Field text','color'],'field_background'=>['Field background','background-color'],'field_border'=>['Field border','border-color']] as $key=>$def) {
                    $this->add_control($key,['label'=>$def[0],'type'=>C::COLOR,'selectors'=>['{{WRAPPER}} .fg-field input, {{WRAPPER}} .fg-field textarea, {{WRAPPER}} .fg-field select'=>$def[1].':{{VALUE}};']]);
                }
                $this->add_responsive_control('form_columns',['label'=>'Form columns','type'=>C::SELECT,'options'=>['1'=>'One','2'=>'Two'],'selectors'=>['{{WRAPPER}} .fg-form'=>'grid-template-columns:repeat({{VALUE}},minmax(0,1fr));']]);
            }
            $this->add_responsive_control('alignment',['label'=>'Text alignment','type'=>C::SELECT,'options'=>['start'=>'Start','center'=>'Center','end'=>'End'],'selectors'=>['{{WRAPPER}} .fg-experience'=>'text-align:{{VALUE}};']]);
            $this->add_responsive_control('min_height',['label'=>'Minimum height','type'=>C::SLIDER,'size_units'=>['px','vh'],'range'=>['px'=>['min'=>0,'max'=>1200],'vh'=>['min'=>0,'max'=>100]],'selectors'=>['{{WRAPPER}} .fg-experience'=>'min-height:{{SIZE}}{{UNIT}};']]);
            $this->add_responsive_control('content_padding',['label'=>'Content padding','type'=>C::DIMENSIONS,'size_units'=>['px','%','em'],'selectors'=>['{{WRAPPER}} .fg-copy'=>'padding:{{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};']]);
            $this->add_responsive_control('card_width',['label'=>'Card width','type'=>C::SLIDER,'size_units'=>['px','vw'],'range'=>['px'=>['min'=>180,'max'=>1000],'vw'=>['min'=>20,'max'=>95]],'selectors'=>['{{WRAPPER}} .fg-experience'=>'--fg-card-width:{{SIZE}}{{UNIT}};']]);
            $this->add_responsive_control('gap',['label'=>'Gap','type'=>C::SLIDER,'range'=>['px'=>['min'=>0,'max'=>120]],'selectors'=>['{{WRAPPER}} .fg-experience'=>'--fg-gap:{{SIZE}}{{UNIT}};']]);
            $this->add_control('overlay',['label'=>'Hero overlay','type'=>C::COLOR,'selectors'=>['{{WRAPPER}} .fg-hero-shade'=>'background:{{VALUE}};']]);
            $this->add_control('focal',['label'=>'Media focal point','type'=>C::SELECT,'options'=>['center'=>'Center','top'=>'Top','bottom'=>'Bottom','left'=>'Left','right'=>'Right'],'selectors'=>['{{WRAPPER}} .fg-media img'=>'object-position:{{VALUE}};']]);
            $this->add_responsive_control('media_order',['label'=>'Media position','type'=>C::SELECT,'options'=>['0'=>'First','2'=>'Last'],'selectors'=>['{{WRAPPER}} .fg-editorial-media > .fg-media'=>'order:{{VALUE}};']]);
        }
        $this->end_controls_section();

        $this->start_controls_section('fg_widget_motion',['label'=>'Motion']);
        $this->add_control('pin',['label'=>'Desktop gallery pin','type'=>C::SWITCHER,'default'=>'yes']);
        $this->add_control('gallery_scrub',['label'=>'Gallery scrub','type'=>C::NUMBER,'min'=>.1,'max'=>3,'default'=>1]);
        $this->add_control('mobile_layout',['label'=>'Mobile gallery','type'=>C::SELECT,'default'=>'swipe','options'=>['swipe'=>'Native swipe','stack'=>'Stack cards']]);
        $this->end_controls_section();
    }

    private function media($s, bool $hero=false): void {
        if (empty($s['image']['url'])) { return; }
        echo '<div class="fg-media"><picture>';
        if (!empty($s['mobile_image']['url'])) { echo '<source media="(max-width:767px)" srcset="'.esc_url($s['mobile_image']['url']).'">'; }
        $attrs=['alt'=>$s['alt']??'','loading'=>$hero?'eager':'lazy','fetchpriority'=>$hero?'high':'auto','class'=>'fg-image'];
        if (!empty($s['image']['id'])) { echo wp_get_attachment_image((int)$s['image']['id'], 'large', false, $attrs); }
        else { echo '<img class="fg-image" src="'.esc_url($s['image']['url']).'" alt="'.esc_attr($attrs['alt']).'" loading="'.$attrs['loading'].'" fetchpriority="'.$attrs['fetchpriority'].'" width="1600" height="1000">'; }
        echo '</picture>';
        if (!empty($s['video']['url'])) { echo '<video class="fg-video" controls muted playsinline preload="none" poster="'.esc_url($s['image']['url']).'"><source src="'.esc_url($s['video']['url']).'"></video>'; }
        echo '</div>';
    }

    private function button($label,$link,$hero=false): void {
        if (!$label || empty($link['url'])) { return; }
        echo '<a class="fg-button" data-fg-cta="'.($hero?'hero':'section').'" href="'.esc_url($link['url']).'"'.(!empty($link['is_external'])?' target="_blank" rel="noopener noreferrer"':'').'><span>'.esc_html($label).'</span><svg class="fg-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>';
    }

    protected function render() {
        ob_start();
        try {
            $this->render_experience();
            echo ob_get_clean();
        } catch (\Throwable $error) {
            ob_end_clean();
            $settings=$this->get_settings();
            echo '<div class="fg-experience"><h2>'.esc_html($settings['title']??'').'</h2><p>'.esc_html($settings['body']??'').'</p></div>';
            error_log('Fashion Gate widget render failed: '.$error->getMessage());
        }
    }

    private function render_experience(): void {
        $s=$this->get_settings_for_display();
        $kind=$this->kind;

        if ($kind === 'announcement-bar') {
            $this->render_announcement_bar($s);
            return;
        }

        if ($kind === 'fashion-header') {
            $this->render_fashion_header($s);
            return;
        }

        if ($kind === 'animated-hero') {
            $this->render_animated_hero($s);
            return;
        }

        if ($kind === 'editorial-banner') {
            $this->render_editorial_banner($s);
            return;
        }

        if ($kind === 'horizontal-showcase') {
            $this->render_horizontal_showcase($s);
            return;
        }

        if ($kind === 'brand-manifesto') {
            $this->render_brand_manifesto($s);
            return;
        }

        if ($kind === 'marquee') {
            $this->render_marquee($s);
            return;
        }

        if ($kind === 'atelier-contact') {
            $this->render_atelier_contact($s);
            return;
        }

        if ($kind === 'site-footer') {
            $this->render_site_footer($s);
            return;
        }

        $tag=in_array($s['tag']??'', ['h1','h2','h3','h4','p'],true)?$s['tag']:'h2';
        echo '<div class="fg-experience fg-'.esc_attr($kind).'" data-fg-mobile-layout="'.esc_attr($s['mobile_layout']??'swipe').'">';
        if (in_array($kind,['editorial-media'],true)) { $this->media($s,false); }
        echo '<div class="fg-copy">';
        if (!empty($s['eyebrow'])) { echo '<p class="fg-luxury-label">'.esc_html($s['eyebrow']).'</p>'; }
        if ($kind==='reveal-heading') {
            $text=($s['reveal_text']??'')?:($s['title']??'');
            echo '<'.$tag.' class="fg-heading fg-split"'.(!empty($s['decorative'])?' aria-hidden="true"':'').'>';
            $parts=($s['split']??'lines')==='words'&&!is_rtl()?preg_split('/\s+/u',$text):explode("\n",$text);
            foreach ($parts as $part) { echo '<span class="fg-text-part">'.esc_html($part).'</span> '; }
            echo '</'.$tag.'>';
        } elseif (!empty($s['title'])) { echo '<'.$tag.' class="fg-heading">'.esc_html($s['title']).'</'.$tag.'>'; }
        if (!empty($s['body'])) { echo '<div class="fg-body">'.wpautop(esc_html($s['body'])).'</div>'; }
        $this->button($s['cta']??'',$s['link']??[],false);
        $this->button($s['secondary_cta']??'',$s['secondary_link']??[],false);
        echo '</div>';
        if (in_array($kind,['horizontal-showcase','luxury-cards'],true)) {
            echo '<div class="fg-gallery" tabindex="0" role="region" aria-label="'.esc_attr($s['title']??__('Gallery','fashiongate')).'" data-fg-gallery="'.($kind==='horizontal-showcase'?'horizontal':'grid').'" data-pin="'.esc_attr($s['pin']??'').'" data-scrub="'.esc_attr($s['gallery_scrub']??1).'"><div class="fg-track">';
            foreach ($s['cards']??[] as $card) {
                echo '<article class="fg-card">'; $this->media($card);
                if (!empty($card['hover_image']['url'])) { echo '<img class="fg-hover-image" loading="lazy" alt="" width="800" height="1000" src="'.esc_url($card['hover_image']['url']).'">'; }
                echo '<p class="fg-luxury-label">'.esc_html($card['label']??'').'</p><h3 class="fg-heading">'.esc_html($card['title']??'').'</h3><p>'.esc_html($card['body']??'').'</p>';
                $this->button($card['title']??'',$card['link']??[]); echo '</article>';
            }
            echo '</div></div>';
        }
        if ($kind==='lead-experience') { $this->form($s); }
        echo '</div>';
    }

    private function render_editorial_banner($s): void {
        $current_lang = Platform::get_current_lang();
        $is_arabic = ($current_lang === 'ar' || is_rtl());
        $theme = $s['banner_theme'] ?? 'perfume';

        if ($theme === 'curated' || $theme === 'fashion') {
            $this->render_curated_fashion_banner($s, $is_arabic);
            return;
        }

        if ($theme === 'perfume') {
            // Replicating Image 1 (Perfume Banner)
            $img_url = !empty($s['banner_image']['url']) ? esc_url($s['banner_image']['url']) : FG_EXPERIENCE_URL . 'assets/media/banner-perfume-visual.png';
            $eyebrow = !empty($s['eyebrow']) ? $s['eyebrow'] : ($is_arabic ? 'وصول جديد' : 'NEW ARRIVAL');
            $title = !empty($s['title']) ? $s['title'] : ($is_arabic ? 'عروض استثنائية على العطور' : 'Massive Fragrance Deals');
            $highlight = !empty($s['deal_highlight']) ? $s['deal_highlight'] : ($is_arabic ? 'خصم يصل حتى <span class="fg-highlight-teal">50%</span>!' : 'Up To <span class="fg-highlight-teal">50%</span> Discount!');
            $quote = !empty($s['quote_text']) ? $s['quote_text'] : ($is_arabic 
                ? 'العطر هو الإمضاء الخفي للشخصية، واللمسة الأخيرة للأناقة الرفيعة.' 
                : 'Perfume is the indispensable complement of the personality; the finishing touch of an outfit.');

            echo '<div class="fg-experience fg-banner-exact-perfume">';
            echo '<div class="fg-banner-exact-inner">';
            
            // Left: Woman holding perfume with soft circle & bubbles
            echo '<div class="fg-banner-perfume-left">';
            echo '<img src="' . esc_url($img_url) . '" alt="' . esc_attr($title) . '" class="fg-banner-perfume-img" loading="lazy">';
            echo '</div>';

            // Right: Centered text block exactly as in reference image 1
            echo '<div class="fg-banner-perfume-right">';
            echo '<span class="fg-banner-perfume-eyebrow">' . esc_html($eyebrow) . '</span>';
            echo '<h2 class="fg-banner-perfume-title">' . esc_html($title) . '</h2>';
            echo '<p class="fg-banner-perfume-deal">' . wp_kses_post($highlight) . '</p>';
            if ($quote) {
                $q_open = $is_arabic ? '«' : '“';
                $q_close = $is_arabic ? '»' : '”';
                echo '<p class="fg-banner-perfume-quote">' . $q_open . esc_html($quote) . $q_close . '</p>';
            }
            echo '</div>'; // .fg-banner-perfume-right

            echo '</div>'; // .fg-banner-exact-inner
            echo '</div>'; // .fg-banner-exact-perfume

        } else {
            // Replicating Image 2 (Skincare Banner) - 50/50 split with solid orange theme
            $img_url = !empty($s['banner_image']['url']) ? esc_url($s['banner_image']['url']) : FG_EXPERIENCE_URL . 'assets/media/banner-skincare-visual.jpg';
            $eyebrow = !empty($s['eyebrow']) ? $s['eyebrow'] : ($is_arabic ? 'وصول جديد' : 'NEW ARRIVAL');
            $highlight = !empty($s['skincare_highlight']) ? $s['skincare_highlight'] : ($is_arabic ? '<span class="fg-skincare-white-accent">50%</span> خصم خاص' : '<span class="fg-skincare-white-accent">50%</span> Massive');
            $title = !empty($s['title']) ? $s['title'] : ($is_arabic ? 'تشكيلة العناية المتكاملة بالبشرة' : 'Skin Care Deals');
            $quote = !empty($s['quote_text']) ? $s['quote_text'] : ($is_arabic 
                ? 'العناية بالبشرة استثمار يدوم طويلاً، وإشراقتها مرآة للجمال الطبيعي.' 
                : 'Invest in your skin, glowing skin is the purest reflection of inner harmony.');

            echo '<div class="fg-experience fg-banner-exact-skincare">';
            echo '<div class="fg-banner-skincare-split">';

            // Left 50%: Solid Orange Theme with Centered Content
            echo '<div class="fg-banner-skincare-left-orange">';
            echo '<div class="fg-banner-skincare-copy-wrap">';
            echo '<span class="fg-banner-skincare-eyebrow">' . esc_html($eyebrow) . '</span>';
            echo '<div class="fg-banner-skincare-deal">' . wp_kses_post($highlight) . '</div>';
            echo '<h2 class="fg-banner-skincare-title">' . esc_html($title) . '</h2>';
            if ($quote) {
                $q_open = $is_arabic ? '«' : '“';
                $q_close = $is_arabic ? '»' : '”';
                echo '<p class="fg-banner-skincare-quote">' . $q_open . esc_html($quote) . $q_close . '</p>';
            }
            echo '</div>';
            echo '</div>'; // .fg-banner-skincare-left-orange

            // Right 50%: Flush Edge-to-Edge Image
            echo '<div class="fg-banner-skincare-right-image">';
            echo '<img src="' . esc_url($img_url) . '" alt="' . esc_attr($title) . '" class="fg-banner-skincare-img" loading="lazy">';
            echo '</div>'; // .fg-banner-skincare-right-image

            echo '</div>'; // .fg-banner-skincare-split
            echo '</div>'; // .fg-banner-exact-skincare
        }
    }

    private function render_curated_fashion_banner($s, bool $is_arabic): void {
        $default_banner_url = FG_EXPERIENCE_URL . 'assets/media/curated-fashion-banner.jpg';
        $banner_url = !empty($s['banner_image']['url']) ? esc_url($s['banner_image']['url']) : $default_banner_url;
        if (strpos($banner_url, 'curated-model') !== false || strpos($banner_url, 'fashiongate-curated-banner') !== false) {
            $banner_url = $default_banner_url;
        }

        // Localized text defaults for luxury clothes banner
        $default_eyebrow = $is_arabic ? 'الأزياء الجاهزة والكوتور' : 'READY-TO-WEAR & COUTURE';
        $default_title = $is_arabic ? 'أناقة عصرية وتصاميم أزياء راقية' : 'Contemporary Luxury & Designer Clothes';
        $default_cta = $is_arabic ? 'اكتشف التشكيلة' : 'EXPLORE COLLECTION';

        $eyebrow = (!empty($s['eyebrow']) && !in_array($s['eyebrow'], ['NEW COLLECTION', 'تشكيلة حصرية', 'Orders Of $95 Or More', 'للطلبات بقيمة 95$ أو أكثر'], true))
            ? $s['eyebrow']
            : $default_eyebrow;

        $title = (!empty($s['title']) && !in_array($s['title'], ['Contemporary Luxury & Elegance', 'أناقة عصرية وإطلالات راقية', 'New Pocket Long Sleeve Shirt', 'قميص جديد طويل الأكمام بجيوب'], true))
            ? $s['title']
            : $default_title;

        $cta = (!empty($s['cta']) && !in_array($s['cta'], ['SHOP NOW', 'تسوق الآن'], true))
            ? $s['cta']
            : $default_cta;
        $link_url = !empty($s['link']['url']) ? esc_url($s['link']['url']) : '#clothes';

        echo '<div class="fg-experience fg-curated-fashion-banner' . ($is_arabic ? ' fg-curated-ar' : ' fg-curated-en') . '">';
        echo '<div class="fg-curated-banner-wrap">';
        echo '<img src="' . esc_url($banner_url) . '" alt="' . esc_attr($title) . '" class="fg-curated-bg-img" loading="eager">';
        echo '<div class="fg-curated-banner-content">';
        if ($eyebrow) {
            echo '<span class="fg-curated-eyebrow">' . esc_html($eyebrow) . '</span>';
        }
        echo '<h2 class="fg-curated-title">' . esc_html($title) . '</h2>';
        if ($cta) {
            echo '<a href="' . $link_url . '" class="fg-curated-btn">' . esc_html($cta) . '</a>';
        }
        echo '</div>'; // .fg-curated-banner-content
        echo '</div>'; // .fg-curated-banner-wrap
        echo '</div>'; // .fg-curated-fashion-banner
    }

    private function render_brand_manifesto($s): void {
        $current_lang = Platform::get_current_lang();
        $is_arabic = ($current_lang === 'ar' || is_rtl());

        $default_signature_url = FG_EXPERIENCE_URL . 'assets/media/fashion-gate-signature.png';
        $signature_url = !empty($s['signature_image']['url']) ? esc_url($s['signature_image']['url']) : $default_signature_url;

        $eyebrow = $s['eyebrow'] ?? '';
        $quote_text = $s['quote_text'] ?? '';
        $subtitle = $s['subtitle'] ?? '';
        $signature_text = $s['signature_text'] ?? 'Fashion Gate';

        if ($is_arabic) {
            if (empty($eyebrow) || $eyebrow === 'WHERE GLOBAL COUTURE MEETS DAMASCUS') {
                $eyebrow = 'حيث تلتقي الموضة العالمية بدمشق';
            }
            if (empty($quote_text) || strpos($quote_text, 'Syria has never had') !== false) {
                $quote_text = '“لم تشهد سوريا من قبل وجهة تسوق فاخرة بهذا المستوى. فاشن غيت مول سوريا ليس مجرد مشروع تجاري، بل هو إعادة انفتاح سوريا على العالم من بوابة الموضة.”';
            }
            if (empty($subtitle) || $subtitle === 'On Boulevard. For the world...') {
                $subtitle = 'على البوليفارد. إلى العالم...';
            }
        } else {
            if (empty($eyebrow)) {
                $eyebrow = 'WHERE GLOBAL COUTURE MEETS DAMASCUS';
            }
            if (empty($quote_text)) {
                $quote_text = '"Syria has never had a luxury mall of this scale. Fashion Gate Mall Syria is not just a business. It is the reopening of Syria to the world through fashion."';
            }
            if (empty($subtitle)) {
                $subtitle = 'On Boulevard. For the world...';
            }
        }

        echo '<div class="fg-experience fg-brand-manifesto' . ($is_arabic ? ' fg-manifesto-ar' : ' fg-manifesto-en') . '">';
        echo '<div class="fg-manifesto-container">';
        if (!empty($eyebrow)) {
            echo '<p class="fg-manifesto-eyebrow">' . esc_html($eyebrow) . '</p>';
        }
        if (!empty($quote_text)) {
            echo '<blockquote class="fg-manifesto-quote">' . esc_html($quote_text) . '</blockquote>';
        }
        if (!empty($subtitle)) {
            echo '<p class="fg-manifesto-subtitle">' . esc_html($subtitle) . '</p>';
        }
        echo '<div class="fg-manifesto-signature">';
        echo '<span class="fg-manifesto-sig-text">' . esc_html($signature_text) . '</span>';
        echo '</div>'; // .fg-manifesto-signature
        echo '</div>'; // .fg-manifesto-container
        echo '</div>'; // .fg-brand-manifesto
    }

    private function render_marquee($s): void {
        $speed = max(10, min(300, (float)($s['speed'] ?? 110)));
        $direction = ($s['direction'] ?? '') === 'reverse' ? 'reverse' : 'normal';
        $logo_height = !empty($s['logo_height']['size']) 
            ? (int)$s['logo_height']['size'] 
            : (!empty($s['style_logo_height']['size']) ? (int)$s['style_logo_height']['size'] : 38);

        $brands = [];
        if (!empty($s['brands']) && is_array($s['brands'])) {
            foreach ($s['brands'] as $b) {
                $b_url = '';
                if (!empty($b['logo']['url'])) {
                    $b_url = $b['logo']['url'];
                } elseif (!empty($b['logo']['id'])) {
                    $b_url = wp_get_attachment_image_url((int)$b['logo']['id'], 'full');
                } elseif (!empty($b['url']['url'])) {
                    $b_url = $b['url']['url'];
                } elseif (!empty($b['url']) && is_string($b['url'])) {
                    $b_url = $b['url'];
                }

                $link_url = !empty($b['brand_link']['url']) ? $b['brand_link']['url'] : (!empty($b['url']['url']) ? $b['url']['url'] : '');
                $item_h = !empty($b['logo_height']) ? (int)$b['logo_height'] : $logo_height;
                $item_w = !empty($b['logo_width']) ? (int)$b['logo_width'] : 0;

                if (!empty($b['title']) || !empty($b_url)) {
                    $brands[] = [
                        'id' => sanitize_title($b['title'] ?? 'brand'),
                        'title' => $b['title'] ?? '',
                        'url' => $b_url,
                        'link' => $link_url,
                        'height' => $item_h,
                        'width' => $item_w
                    ];
                }
            }
        }

        if (empty($brands)) {
            $manifest_file = FG_EXPERIENCE_PATH . 'assets/media/logos/brands-manifest.json';
            if (file_exists($manifest_file)) {
                $brands = json_decode(file_get_contents($manifest_file), true) ?: [];
            }
        }

        if (empty($brands)) {
            $brands = [
                ['id' => 'giorgio-armani', 'title' => 'Giorgio Armani', 'filename' => 'giorgio-armani.png'],
                ['id' => 'valentino', 'title' => 'Valentino', 'filename' => 'valentino.png'],
                ['id' => 'sandro', 'title' => 'Sandro', 'filename' => 'sandro.png'],
                ['id' => 'hugo-boss', 'title' => 'BOSS', 'filename' => 'hugo-boss.png'],
                ['id' => 'weekend-maxmara', 'title' => 'Weekend Max Mara', 'filename' => 'weekend-maxmara.png'],
                ['id' => 'max-and-co', 'title' => 'MAX&Co.', 'filename' => 'max-and-co.png'],
                ['id' => 'persona-marina-rinaldi', 'title' => 'Persona by Marina Rinaldi', 'filename' => 'persona-marina-rinaldi.png'],
                ['id' => 'nean-com', 'title' => 'NÉAN', 'filename' => 'nean-com.png'],
                ['id' => 'acler', 'title' => 'Acler', 'filename' => 'acler.png'],
                ['id' => 'almais', 'title' => 'ALÉMAIS', 'filename' => 'almais.png'],
                ['id' => 'elie-saab', 'title' => 'Elie Saab', 'filename' => 'elie-saab.png'],
                ['id' => 'prada', 'title' => 'Prada', 'filename' => 'prada.png'],
                ['id' => 'gucci', 'title' => 'Gucci', 'filename' => 'gucci.png'],
                ['id' => 'ysl', 'title' => 'Saint Laurent', 'filename' => 'ysl.png'],
            ];
        }

        echo '<div class="fg-experience fg-brand-logo-marquee" dir="ltr" style="--fg-marquee-logo-h:' . $logo_height . 'px;">';
        echo '<div class="fg-marquee-window">';
        echo '<div class="fg-marquee-track" style="--fg-speed:' . $speed . 's; animation-direction:' . esc_attr($direction) . ';" aria-hidden="true">';

        for ($loop = 0; $loop < 2; $loop++) {
            echo '<div class="fg-marquee-group">';
            foreach ($brands as $brand) {
                $logo_url = !empty($brand['url']) ? $brand['url'] : FG_EXPERIENCE_URL . 'assets/media/logos/' . ($brand['filename'] ?? '');
                $brand_title = $brand['title'] ?? '';
                $h = !empty($brand['height']) ? (int)$brand['height'] : $logo_height;
                $w = !empty($brand['width']) ? (int)$brand['width'] : 0;
                $w_css = $w > 0 ? " max-width: {$w}px !important;" : "";

                echo '<div class="fg-marquee-brand-item" title="' . esc_attr($brand_title) . '" style="height:' . ($h + 12) . 'px;">';
                if (!empty($logo_url)) {
                    echo '<img src="' . esc_url($logo_url) . '" alt="' . esc_attr($brand_title) . '" class="fg-marquee-logo-img" loading="lazy" style="height:' . $h . 'px !important; max-height:' . $h . 'px !important;' . $w_css . '">';
                } else {
                    echo '<span class="fg-marquee-brand-name">' . esc_html($brand_title) . '</span>';
                }
                echo '</div>';
            }
            echo '</div>'; // .fg-marquee-group
        }

        echo '</div>'; // .fg-marquee-track
        echo '</div>'; // .fg-marquee-window
        echo '</div>'; // .fg-brand-logo-marquee
    }

    private function render_atelier_contact($s): void {
        $current_lang = Platform::get_current_lang();
        $is_arabic = ($current_lang === 'ar' || is_rtl());

        $model_img = !empty($s['model_image']['url']) ? $s['model_image']['url'] : (FG_EXPERIENCE_URL . 'assets/media/contact-model.webp');

        // Localized string defaults matching Sanity CMS & Next.js
        if ($is_arabic) {
            $atelier_title = (!empty($s['atelier_title']) && $s['atelier_title'] !== 'Visit The Atelier') ? $s['atelier_title'] : 'تفضلوا بزيارتنا';
            $atelier_text = (!empty($s['atelier_text']) && $s['atelier_text'] !== "Fashion Gate Mall, Damascus Boulevard\nDamascus, Syria") ? $s['atelier_text'] : "فاشن غيت مول، بوليفارد دمشق\nدمشق، سورية";
            $hours_title = (!empty($s['hours_title']) && $s['hours_title'] !== 'Opening Hours') ? $s['hours_title'] : 'ساعات العمل';
            $hours_text = (!empty($s['hours_text']) && $s['hours_text'] !== "Mon. – Sun.\n11:00 AM – 9:00 PM") ? $s['hours_text'] : "الاثنين – الأحد\n11:00 ص – 9:00 م";
            $email_title = (!empty($s['email_title']) && $s['email_title'] !== 'Email Us') ? $s['email_title'] : 'راسلونا عبر البريد';
            $email_text = !empty($s['email_text']) ? $s['email_text'] : 'support@fashiongatemall.com';
            $cursive = (!empty($s['form_cursive']) && $s['form_cursive'] !== 'Write to us') ? $s['form_cursive'] : 'راسلنا';
            $heading = (!empty($s['form_title']) && $s['form_title'] !== 'Send A Message') ? $s['form_title'] : 'أرسل رسالتك';
            $modal_title = (!empty($s['modal_title']) && $s['modal_title'] !== 'Get in touch') ? $s['modal_title'] : 'تواصل معنا';
            $sub = (!empty($s['form_sub']) && $s['form_sub'] !== 'A personal advisor will be in touch within 24 hours.') ? $s['form_sub'] : 'سيتواصل معك مستشار شخصي خلال ٢٤ ساعة.';
            $btn_text = (!empty($s['btn_text']) && $s['btn_text'] !== 'SEND MESSAGE') ? $s['btn_text'] : 'إرسال الرسالة';
        } else {
            $atelier_title = !empty($s['atelier_title']) ? $s['atelier_title'] : 'Visit The Atelier';
            $atelier_text = !empty($s['atelier_text']) ? $s['atelier_text'] : "Fashion Gate Mall, Damascus Boulevard\nDamascus, Syria";
            $hours_title = !empty($s['hours_title']) ? $s['hours_title'] : 'Opening Hours';
            $hours_text = !empty($s['hours_text']) ? $s['hours_text'] : "Mon. – Sun.\n11:00 AM – 9:00 PM";
            $email_title = !empty($s['email_title']) ? $s['email_title'] : 'Email Us';
            $email_text = !empty($s['email_text']) ? $s['email_text'] : 'support@fashiongatemall.com';
            $cursive = !empty($s['form_cursive']) ? $s['form_cursive'] : 'Write to us';
            $heading = !empty($s['form_title']) ? $s['form_title'] : 'Send A Message';
            $modal_title = !empty($s['modal_title']) ? $s['modal_title'] : 'Get in touch';
            $sub = !empty($s['form_sub']) ? $s['form_sub'] : 'A personal advisor will be in touch within 24 hours.';
            $btn_text = !empty($s['btn_text']) ? $s['btn_text'] : 'SEND MESSAGE';
        }

        $lbl_name = $is_arabic ? 'الاسم الكامل *' : 'Your Name *';
        $lbl_email = $is_arabic ? 'البريد الإلكتروني *' : 'Email Address *';
        $lbl_phone = $is_arabic ? 'الهاتف (اختياري)' : 'Phone (optional)';
        $lbl_msg = $is_arabic ? 'رسالتك *' : 'Your Message *';

        $thank_title = $is_arabic ? 'شكراً لك' : 'Thank You';
        $thank_body = $is_arabic ? 'تم استلام رسالتك وسنتواصل معك قريباً.' : 'We\'ve received your message and will respond shortly.';
        $send_another = $is_arabic ? 'إرسال رسالة أخرى' : 'Send Another';
        $closing_in = $is_arabic ? 'سيغلق خلال' : 'Closing in';

        echo '<div class="fg-experience fg-atelier-contact-section" id="fg-atelier-contact" dir="' . ($is_arabic ? 'rtl' : 'ltr') . '">';
        echo '<div class="fg-atelier-contact-inner">';

        // 1. Top Atelier Info Bar (Image 1)
        echo '<div class="fg-atelier-info-bar">';
        echo '<div class="fg-info-col fg-info-atelier">';
        echo '<h4 class="fg-info-title">' . esc_html($atelier_title) . '</h4>';
        echo '<p class="fg-info-desc">' . nl2br(esc_html($atelier_text)) . '</p>';
        echo '</div>';
        echo '<div class="fg-info-col fg-info-hours">';
        echo '<h4 class="fg-info-title">' . esc_html($hours_title) . '</h4>';
        echo '<p class="fg-info-desc">' . nl2br(esc_html($hours_text)) . '</p>';
        echo '</div>';
        echo '<div class="fg-info-col fg-info-email">';
        echo '<h4 class="fg-info-title">' . esc_html($email_title) . '</h4>';
        echo '<p class="fg-info-desc"><a href="mailto:' . esc_attr($email_text) . '">' . esc_html($email_text) . '</a></p>';
        echo '</div>';
        echo '</div>'; // .fg-atelier-info-bar

        // 2. Main Two-Column Contact Section (Image 1)
        echo '<div class="fg-contact-main-grid">';
        // Left Column: Portrait Model with framed overlay
        echo '<div class="fg-contact-portrait-col">';
        echo '<div class="fg-contact-portrait-wrap">';
        echo '<img src="' . esc_url($model_img) . '" alt="Fashion Gate Atelier" class="fg-contact-model-img" loading="lazy">';
        echo '<div class="fg-contact-portrait-frame" aria-hidden="true"></div>';
        echo '<div class="fg-contact-portrait-overlay">';
        echo '<span class="fg-portrait-cursive">' . esc_html($cursive) . '</span>';
        echo '<h3 class="fg-portrait-title">' . esc_html($heading) . '</h3>';
        echo '</div>';
        echo '</div>';
        echo '</div>'; // .fg-contact-portrait-col

        // Right Column: Contact Form
        echo '<div class="fg-contact-form-col">';
        echo '<div class="fg-contact-form-card">';
        echo '<div class="fg-contact-header">';
        echo '<div class="fg-copper-rule" aria-hidden="true"></div>';
        echo '<span class="fg-contact-cursive-eyebrow">' . esc_html($cursive) . '</span>';
        echo '<h2 class="fg-contact-heading">' . esc_html($heading) . '</h2>';
        echo '<p class="fg-contact-sub">' . esc_html($sub) . '</p>';
        echo '</div>';

        echo '<form class="fg-contact-form fg-inpage-form" data-source="in-page-contact" data-lang="' . ($is_arabic ? 'ar' : 'en') . '">';
        echo '<div class="fg-form-grid-two">';
        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-c-name">' . esc_html($lbl_name) . '</label>';
        echo '<input type="text" id="fg-c-name" name="name" required autocomplete="name" class="fg-contact-input">';
        echo '</div>';
        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-c-email">' . esc_html($lbl_email) . '</label>';
        echo '<input type="email" id="fg-c-email" name="email" required autocomplete="email" dir="ltr" class="fg-contact-input">';
        echo '</div>';
        echo '</div>';

        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-c-phone">' . esc_html($lbl_phone) . '</label>';
        echo '<input type="tel" id="fg-c-phone" name="phone" placeholder="+963 ..." dir="ltr" autocomplete="tel" class="fg-contact-input fg-phone-ltr">';
        echo '</div>';

        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-c-msg">' . esc_html($lbl_msg) . '</label>';
        echo '<textarea id="fg-c-msg" name="message" required rows="4" class="fg-contact-textarea"></textarea>';
        echo '</div>';

        echo '<div class="fg-honeypot" aria-hidden="true" style="display:none;">';
        echo '<input type="text" name="companyWebsite" tabindex="-1" autocomplete="off">';
        echo '</div>';

        echo '<button type="submit" class="fg-contact-submit-btn">';
        echo '<span>' . esc_html($btn_text) . '</span>';
        echo '<svg class="fg-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        echo '</button>';
        echo '<div class="fg-contact-status" role="status" aria-live="polite"></div>';
        echo '</form>';

        // Success State
        echo '<div class="fg-contact-success-state fg-inpage-success" style="display:none;">';
        echo '<div class="fg-success-icon-wrap">';
        echo '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CB6116" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>';
        echo '</div>';
        echo '<h3 class="fg-success-title">' . esc_html($thank_title) . '</h3>';
        echo '<p class="fg-success-desc">' . esc_html($thank_body) . '</p>';
        echo '<button type="button" class="fg-reset-form-btn">' . esc_html($send_another) . '</button>';
        echo '</div>';

        echo '</div>'; // .fg-contact-form-card
        echo '</div>'; // .fg-contact-form-col
        echo '</div>'; // .fg-contact-main-grid
        echo '</div>'; // .fg-atelier-contact-inner
        echo '</div>'; // .fg-atelier-contact-section

        // 3. Floating Contact Widget & Modal (Image 2)
        echo '<div class="fg-floating-contact-wrapper" dir="' . ($is_arabic ? 'rtl' : 'ltr') . '">';
        echo '<button type="button" class="fg-floating-contact-btn" aria-label="' . esc_attr($modal_title) . '" title="' . esc_attr($modal_title) . '">';
        echo '<img src="' . esc_url(FG_EXPERIENCE_URL . 'assets/media/floating-send-icon.png') . '" class="fg-agent-icon fg-send-icon" width="26" height="26" alt="Contact">';
        echo '<svg class="fg-close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        echo '</button>';
        echo '</div>'; // .fg-floating-contact-wrapper

        echo '<div class="fg-contact-modal" role="dialog" aria-modal="true" aria-label="' . esc_attr($modal_title) . '" dir="' . ($is_arabic ? 'rtl' : 'ltr') . '" style="display:none;">';
        echo '<div class="fg-modal-backdrop"></div>';
        echo '<div class="fg-modal-dialog">';
        echo '<button type="button" class="fg-modal-close-btn" aria-label="Close">';
        echo '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        echo '</button>';
        echo '<div class="fg-modal-grid">';
        
        // Modal Left Column: Model portrait with frame & overlay
        echo '<div class="fg-modal-portrait-col">';
        echo '<img src="' . esc_url($model_img) . '" alt="Fashion Gate" class="fg-modal-portrait-img" loading="lazy">';
        echo '<div class="fg-modal-portrait-frame" aria-hidden="true"></div>';
        echo '<div class="fg-modal-portrait-overlay">';
        echo '<span class="fg-portrait-cursive">' . esc_html($cursive) . '</span>';
        echo '<h3 class="fg-portrait-title">' . esc_html($heading) . '</h3>';
        echo '</div>';
        echo '</div>'; // .fg-modal-portrait-col

        // Modal Right Column: Form with "Get in touch"
        echo '<div class="fg-modal-form-col">';
        echo '<div class="fg-modal-form-wrap">';
        echo '<div class="fg-modal-header">';
        echo '<h2 class="fg-modal-title">' . esc_html($modal_title) . '</h2>';
        echo '<p class="fg-modal-sub">' . esc_html($sub) . '</p>';
        echo '</div>';

        echo '<form class="fg-contact-form fg-modal-contact-form" data-source="floating-modal" data-lang="' . ($is_arabic ? 'ar' : 'en') . '">';
        echo '<div class="fg-form-grid-two">';
        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-m-name">' . esc_html($lbl_name) . '</label>';
        echo '<input type="text" id="fg-m-name" name="name" required autocomplete="name" class="fg-contact-input">';
        echo '</div>';
        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-m-email">' . esc_html($lbl_email) . '</label>';
        echo '<input type="email" id="fg-m-email" name="email" required autocomplete="email" dir="ltr" class="fg-contact-input">';
        echo '</div>';
        echo '</div>';

        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-m-phone">' . esc_html($lbl_phone) . '</label>';
        echo '<input type="tel" id="fg-m-phone" name="phone" placeholder="+963 ..." dir="ltr" autocomplete="tel" class="fg-contact-input fg-phone-ltr">';
        echo '</div>';

        echo '<div class="fg-input-wrap">';
        echo '<label for="fg-m-msg">' . esc_html($lbl_msg) . '</label>';
        echo '<textarea id="fg-m-msg" name="message" required rows="4" class="fg-contact-textarea"></textarea>';
        echo '</div>';

        echo '<div class="fg-honeypot" aria-hidden="true" style="display:none;">';
        echo '<input type="text" name="companyWebsite" tabindex="-1" autocomplete="off">';
        echo '</div>';

        echo '<button type="submit" class="fg-contact-submit-btn">';
        echo '<span>' . esc_html($btn_text) . '</span>';
        echo '<svg class="fg-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        echo '</button>';
        echo '<div class="fg-contact-status" role="status" aria-live="polite"></div>';
        echo '</form>';

        // Modal Success State
        echo '<div class="fg-contact-success-state fg-modal-success" style="display:none;">';
        echo '<div class="fg-success-icon-wrap">';
        echo '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#CB6116" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>';
        echo '</div>';
        echo '<h3 class="fg-success-title">' . esc_html($thank_title) . '</h3>';
        echo '<p class="fg-success-desc">' . esc_html($thank_body) . '</p>';
        echo '<div class="fg-countdown-box">';
        echo '<span class="fg-countdown-label">' . esc_html($closing_in) . '</span> ';
        echo '<span class="fg-countdown-num">4</span>';
        echo '</div>';
        echo '</div>';

        echo '</div>'; // .fg-modal-form-wrap
        echo '</div>'; // .fg-modal-form-col
        echo '</div>'; // .fg-modal-grid
        echo '</div>'; // .fg-modal-dialog
        echo '</div>'; // .fg-contact-modal
    }

    private function render_site_footer($s): void {
        $lang = Platform::get_current_lang();
        $is_ar = ($lang === 'ar' || is_rtl());

        $monogram_url = !empty($s['monogram']['url']) ? $s['monogram']['url'] : (FG_EXPERIENCE_URL . 'assets/media/fg-mark-white.png');
        
        if ($is_ar) {
            $brand_title = (!empty($s['brand_title']) && $s['brand_title'] !== 'FASHION GATE' && $s['brand_title'] !== 'Fashion Gate' && !str_contains($s['brand_title'], '|')) 
                ? $s['brand_title'] 
                : 'فــاشــن غــيــت';
            $boulevard_text = (!empty($s['boulevard_text']) && $s['boulevard_text'] !== 'BOULEVARD DAMASCUS' && !str_contains($s['boulevard_text'], '·')) 
                ? $s['boulevard_text'] 
                : 'بوليفارد دمشق';
            $desc = (!empty($s['desc']) && !str_starts_with($s['desc'], 'Syria\'s first'))
                ? $s['desc']
                : 'أول وجهة متجر فاخر للتسوّق في سوريا، حيث تلتقي الأزياء الراقية، ومجموعة مختارة من منتجات الجمال والعناية بالبشرة، واللايف ستايل، ضمن رؤية معمارية عصرية متكاملة.';
            $updates_title = (!empty($s['updates_title']) && $s['updates_title'] !== 'Bespoke Updates')
                ? $s['updates_title']
                : 'تحديثات مخصصة';
            $subscribe_desc = (!empty($s['subscribe_desc']) && !str_starts_with($s['subscribe_desc'], 'Subscribe to receive'))
                ? $s['subscribe_desc']
                : 'اشترك لتلقي الدعوات الخاصة، وإطلاق المجموعات الموسمية، وملاحظات مجلة الأتيلييه.';
            $placeholder = (!empty($s['placeholder']) && $s['placeholder'] !== 'Email address')
                ? $s['placeholder']
                : 'البريد الإلكتروني';
            $copyright = (!empty($s['copyright']) && $s['copyright'] !== 'All rights reserved.')
                ? $s['copyright']
                : 'جميع الحقوق محفوظة.';
            $copy_full = '© ' . date('Y') . ' فاشن غيت مول سوريا. ' . $copyright;
        } else {
            $brand_title = (!empty($s['brand_title']) && !str_contains($s['brand_title'], '|')) ? $s['brand_title'] : 'Fashion Gate';
            $boulevard_text = (!empty($s['boulevard_text']) && !str_contains($s['boulevard_text'], '·')) ? $s['boulevard_text'] : 'BOULEVARD DAMASCUS';
            $desc = !empty($s['desc']) ? $s['desc'] : "Syria's first luxury department destination. Integrating fine apparel, curated beauty, and bespoke boutique shopping under a modern architectural vision.";
            $updates_title = !empty($s['updates_title']) ? $s['updates_title'] : 'Bespoke Updates';
            $subscribe_desc = !empty($s['subscribe_desc']) ? $s['subscribe_desc'] : 'Subscribe to receive private invitations, seasonal collection launches, and atelier journal notes.';
            $placeholder = !empty($s['placeholder']) ? $s['placeholder'] : 'Email address';
            $copyright = !empty($s['copyright']) ? $s['copyright'] : 'All rights reserved.';
            $copy_full = '© ' . date('Y') . ' Fashion Gate Mall Syria. ' . $copyright;
        }

        $socials = [
            'instagram' => [
                'name' => $is_ar ? 'إنستغرام' : 'Instagram',
                'url' => !empty($s['instagram_url']['url']) ? $s['instagram_url']['url'] : 'https://www.instagram.com/fashiongatemall',
                'svg' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
            ],
            'facebook' => [
                'name' => $is_ar ? 'فيسبوك' : 'Facebook',
                'url' => !empty($s['facebook_url']['url']) ? $s['facebook_url']['url'] : 'https://www.facebook.com/fashiongatemall',
                'svg' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
            ],
            'tiktok' => [
                'name' => $is_ar ? 'تيك توك' : 'TikTok',
                'url' => !empty($s['tiktok_url']['url']) ? $s['tiktok_url']['url'] : 'https://www.tiktok.com/@fashiongatemall',
                'svg' => '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
            ],
            'youtube' => [
                'name' => $is_ar ? 'يوتيوب' : 'YouTube',
                'url' => !empty($s['youtube_url']['url']) ? $s['youtube_url']['url'] : 'https://www.youtube.com/@fashiongatemall',
                'svg' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
            ],
            'pinterest' => [
                'name' => $is_ar ? 'بينتيريست' : 'Pinterest',
                'url' => !empty($s['pinterest_url']['url']) ? $s['pinterest_url']['url'] : 'https://www.pinterest.com/fashiongatemall/',
                'svg' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.056.23-.19.279-.441.168-1.642-.765-2.671-3.167-2.671-5.097 0-4.15 3.018-7.962 8.701-7.962 4.609 0 8.188 3.284 8.188 7.671 0 4.58-2.887 8.267-6.893 8.267-1.346 0-2.612-.7-3.046-1.528l-.828 3.159c-.299 1.144-1.109 2.578-1.651 3.46 1.209.373 2.49.576 3.82.576 6.618 0 11.984-5.365 11.984-11.987C23.998 5.367 18.636 0 12.017 0z"/></svg>'
            ],
            'snapchat' => [
                'name' => $is_ar ? 'سناب شات' : 'Snapchat',
                'url' => 'https://www.snapchat.com/@fashiongatemall',
                'svg' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03 2.14c-3.11 0-5.08 2.27-5.08 4.79 0 .91.31 1.94.7 2.65.13.25.17.43.08.62-.12.24-.46.39-.77.51-.78.3-1.64.67-1.74 1.54-.08.7.46 1.22 1.05 1.5.34.16.7.27 1.05.39.29.1.48.27.53.58.11.75-.4 1.48-.96 1.97-.47.41-1.02.76-1.39 1.29-.46.66-.23 1.46.46 1.83.91.49 1.94.49 2.94.39.54-.05 1.05-.2 1.56-.37.33-.11.63-.07.93.07.72.33 1.48.53 2.27.54.8-.01 1.56-.21 2.28-.54.3-.14.6-.18.93-.07.51.17 1.02.32 1.56.37 1 .1 2.03.1 2.94-.39.69-.37.92-1.17.46-1.83-.37-.53-.92-.88-1.39-1.29-.56-.49-1.07-1.22-.96-1.97.05-.31.24-.48.53-.58.35-.12.71-.23 1.05-.39.59-.28 1.13-.8 1.05-1.5-.1-.87-.96-1.24-1.74-1.54-.31-.12-.65-.27-.77-.51-.09-.19-.05-.37.08-.62.39-.71.7-1.74.7-2.65 0-2.52-1.97-4.79-5.08-4.79z"/></svg>'
            ],
            'x' => [
                'name' => $is_ar ? 'إكس (تويتر)' : 'X (Twitter)',
                'url' => 'https://x.com/fashiongatemall',
                'svg' => '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
            ]
        ];

        echo '<footer class="fg-site-footer-section" dir="' . ($is_ar ? 'rtl' : 'ltr') . '">';
        echo '<div class="fg-footer-container">';
        echo '<div class="fg-footer-main-grid">';
        
        // 1. Brand Column
        echo '<div class="fg-footer-brand-col">';
        echo '<div class="fg-footer-brand-head">';
        echo '<div class="fg-footer-logo-box">';
        echo '<img src="' . esc_url($monogram_url) . '" alt="Fashion Gate" class="fg-footer-monogram" width="28" height="28">';
        echo '</div>';
        echo '<div class="fg-footer-brand-text">';
        echo '<span class="fg-footer-brand-name">' . esc_html($brand_title) . '</span>';
        echo '<span class="fg-footer-brand-eyebrow">' . esc_html($boulevard_text) . '</span>';
        echo '</div>';
        echo '</div>'; // .fg-footer-brand-head
        echo '<p class="fg-footer-desc">' . esc_html($desc) . '</p>';
        echo '</div>'; // .fg-footer-brand-col

        // 2. Newsletter Column
        echo '<div class="fg-footer-newsletter-col">';
        echo '<h3 class="fg-footer-newsletter-title">' . esc_html($updates_title) . '</h3>';
        echo '<p class="fg-footer-newsletter-sub">' . esc_html($subscribe_desc) . '</p>';
        echo '<form class="fg-footer-subscribe-form" data-lang="' . ($is_ar ? 'ar' : 'en') . '">';
        echo '<div class="fg-footer-input-row">';
        echo '<input type="email" name="email" required placeholder="' . esc_attr($placeholder) . '" aria-label="' . esc_attr($placeholder) . '" class="fg-footer-input" dir="' . ($is_ar ? 'rtl' : 'ltr') . '">';
        echo '<input type="text" name="companyWebsite" tabindex="-1" autocomplete="off" style="display:none;" aria-hidden="true">';
        echo '<button type="submit" class="fg-footer-submit-btn" aria-label="Subscribe">';
        echo '<svg class="fg-footer-arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        echo '</button>';
        echo '</div>'; // .fg-footer-input-row
        echo '<div class="fg-footer-status" role="status" aria-live="polite"></div>';
        echo '</form>';
        echo '</div>'; // .fg-footer-newsletter-col

        echo '</div>'; // .fg-footer-main-grid

        // 3. Bottom Bar: Copyright & Social Links
        echo '<div class="fg-footer-bottom-bar">';
        echo '<div class="fg-footer-copyright">' . esc_html($copy_full) . '</div>';
        echo '<div class="fg-footer-social-row">';
        foreach ($socials as $key => $soc) {
            echo '<a href="' . esc_url($soc['url']) . '" target="_blank" rel="noopener noreferrer" class="fg-footer-social-btn fg-social-' . esc_attr($key) . '" title="' . esc_attr($soc['name']) . '" aria-label="' . esc_attr($soc['name']) . '">';
            echo $soc['svg'];
            echo '</a>';
        }
        echo '</div>'; // .fg-footer-social-row
        echo '</div>'; // .fg-footer-bottom-bar

        echo '</div>'; // .fg-footer-container
        echo '</footer>';
    }

    private function render_animated_hero($s): void {
        $media_mode = $s['hero_media_type'] ?? 'video';
        $video_url = !empty($s['video_file']['url']) 
            ? esc_url($s['video_file']['url']) 
            : (!empty($s['video']['url']) 
                ? esc_url($s['video']['url']) 
                : FG_EXPERIENCE_URL . 'assets/media/fashiongatemall.mp4');
        $img_url = !empty($s['image']['url']) ? esc_url($s['image']['url']) : FG_EXPERIENCE_URL . 'assets/media/hero-woman-wide.png';
        $tag = in_array($s['tag'] ?? '', ['h1','h2','h3','h4','p'], true) ? $s['tag'] : 'h1';
        $title = !empty($s['title']) ? $s['title'] : (is_rtl() ? 'فـاشـن غـيـت مـول' : 'FASHION GATE MALL');
        $subtitle = !empty($s['subtitle']) ? $s['subtitle'] : (is_rtl() ? 'دمشق، سورية' : 'Damascus, Syria');

        echo '<div class="fg-experience fg-animated-hero">';
        
        // Background Media (Video or Image)
        echo '<div class="fg-media">';
        if ($media_mode === 'image') {
            echo '<img src="'.$img_url.'" alt="'.esc_attr($title).'" class="fg-hero-bg-img" loading="eager" fetchpriority="high">';
        } else {
            echo '<video class="fg-hero-video" autoplay muted loop playsinline preload="auto" poster="'.$img_url.'">';
            echo '<source src="'.$video_url.'" type="video/mp4">';
            echo '</video>';
        }
        echo '</div>';

        // Dark Layer Background over Media
        echo '<div class="fg-hero-shade" aria-hidden="true"></div>';

        // Centered Headline & Subtitle
        echo '<div class="fg-hero-content">';
        echo '<'.$tag.' class="fg-hero-heading">'.esc_html($title).'</'.$tag.'>';
        if (!empty($subtitle)) {
            echo '<p class="fg-hero-subtitle">'.esc_html($subtitle).'</p>';
        }
        echo '</div>';

        echo '</div>';
    }

    private function render_horizontal_showcase($s): void {
        $current_lang = Platform::get_current_lang();
        $is_arabic = ($current_lang === 'ar' || is_rtl());
        $col_type = $s['collection_type'] ?? 'clothes';

        // Default or custom title
        $raw_title = trim($s['title'] ?? '');
        if ($raw_title === '' || $raw_title === 'THIS SEASON' || $raw_title === 'هذا الموسم') {
            if ($col_type === 'perfume') {
                $title = $is_arabic ? 'عطور ونفحات نادرة' : 'Rare Perfumes & Fragrances';
            } elseif ($col_type === 'skincare') {
                $title = $is_arabic ? 'طقوس العناية المتكاملة' : 'Botanical Skincare Rituals';
            } else {
                $title = $is_arabic ? 'مختارات حصرية' : 'Curated Collection';
            }
        } else {
            $title = $raw_title;
        }

        $cards = !empty($s['cards']) ? $s['cards'] : [];
        if (empty($cards)) {
            if ($col_type === 'perfume') {
                $cards = $is_arabic ? [
                    [
                        'title' => 'نوار آند أمبر',
                        'label' => 'ميزون فيستيج · عطور راقية',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-noir.jpg']
                    ],
                    [
                        'title' => 'ميزون لـ أمور',
                        'label' => 'باريس · عطر فائق التركيز',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-maison.jpg']
                    ],
                    [
                        'title' => 'ياسمين سامباك',
                        'label' => 'خلاصات نباتية · إكسير الزهور',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-jasmine.jpg']
                    ],
                    [
                        'title' => 'ميث أو دو بارفان',
                        'label' => 'إيليس بروكلين · نفحات أثيرية',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-ellis.jpg']
                    ],
                    [
                        'title' => 'روز فلفيت كريستال',
                        'label' => 'أزياء راقية · خلطة استثنائية',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/banner-perfume-woman.png']
                    ],
                    [
                        'title' => 'شانيل رقم ٥',
                        'label' => 'شانيل · عطر أيقوني باريسي',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_1.png']
                    ],
                    [
                        'title' => 'توم فورد عود وود',
                        'label' => 'توم فورد · برايفيت بلند',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_2.png']
                    ],
                    [
                        'title' => 'باكارات روج ٥٤٠',
                        'label' => 'ميزون فرانسيس كوركدجيان · عبير فاخر',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_3.png']
                    ],
                    [
                        'title' => 'سانتال ٣٣',
                        'label' => 'لي لابو · عطر نيويوركي نخبوي',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_4.png']
                    ],
                    [
                        'title' => 'إكسير البنفسج الإمبراطوري',
                        'label' => 'دار دمشق الملكية · تقطير نقي',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-unisex-perfume.jpg']
                    ]
                ] : [
                    [
                        'title' => 'NOIR & AMBRE',
                        'label' => 'Maison Vestige · Parfums de Prestige',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-noir.jpg']
                    ],
                    [
                        'title' => 'MAISON L\'AMOUR',
                        'label' => 'Paris · Eau De Parfum Intense',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-maison.jpg']
                    ],
                    [
                        'title' => 'JASMINE SAMBAC',
                        'label' => 'Luxury Botanicals · Rare Flower Elixir',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-jasmine.jpg']
                    ],
                    [
                        'title' => 'MYTH EAU DE PARFUM',
                        'label' => 'Ellis Brooklyn · Modern Floral',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-perfume-ellis.jpg']
                    ],
                    [
                        'title' => 'VELVET ROSE CRYSTAL',
                        'label' => 'Haute Parfumerie · Signature Blend',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/banner-perfume-woman.png']
                    ],
                    [
                        'title' => 'CHANEL NO. 5',
                        'label' => 'Chanel · Iconic Parisian Flacon',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_1.png']
                    ],
                    [
                        'title' => 'TOM FORD OUD WOOD',
                        'label' => 'Tom Ford · Private Blend Reserve',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_2.png']
                    ],
                    [
                        'title' => 'BACCARAT ROUGE 540',
                        'label' => 'Maison Francis Kurkdjian · Amber Floral',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_3.png']
                    ],
                    [
                        'title' => 'SANTAL 33',
                        'label' => 'Le Labo · Artisanal Smoky Cardamom',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_4.png']
                    ],
                    [
                        'title' => 'IMPERIAL VIOLET ELIXIR',
                        'label' => 'Haute Damascus · Pure Extraction',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-unisex-perfume.jpg']
                    ]
                ];
            } elseif ($col_type === 'skincare') {
                $cards = $is_arabic ? [
                    [
                        'title' => 'رحيق الزعفران المجدد',
                        'label' => 'آرثر آند كو · إكسير النضارة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-skincare-saffron.jpg']
                    ],
                    [
                        'title' => 'زيت السامباك النباتي',
                        'label' => 'بيور بوتانيكالز · ترميم وإشراق',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-skincare-botanical.jpg']
                    ],
                    [
                        'title' => 'بلسم فيلفيت هيدرا المرطب',
                        'label' => 'مستحضرات فاخرة · ترطيب مكثف',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-skincare-glow.jpg']
                    ],
                    [
                        'title' => 'إكسير الإشراق الذهبي',
                        'label' => 'أوت بوتيه · تجديد خلوي',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/honey.png']
                    ],
                    [
                        'title' => 'قطرات الروز كوارتز الحيوية',
                        'label' => 'مختبرات نباتية · تغذية مركزة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/luxury-beauty.png']
                    ],
                    [
                        'title' => 'كريم دي لا مير المركز',
                        'label' => 'لا مير · مركب ميراكل بروث',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_5.png']
                    ],
                    [
                        'title' => 'ذا ريتش كريم',
                        'label' => 'أوغستينوس بادر · عناية خلوية متقدمة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_6.png']
                    ],
                    [
                        'title' => 'سيروم الإصلاح الليلي المتقدم',
                        'label' => 'إستي لودر · ترميم مكثف للبشرة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_7.png']
                    ],
                    [
                        'title' => 'خلاصة العلاج الفائق للوجه',
                        'label' => 'إس كيه تو · ماء بيترا الأسطوري',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_8.png']
                    ],
                    [
                        'title' => 'زيت الياسمين الملكي التجديدي',
                        'label' => 'أرتيزان دمشق · نقاء طبيعي ۱۰۰٪',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/jasmine-oil.png']
                    ]
                ] : [
                    [
                        'title' => 'SAFFRON RADIANCE NECTAR',
                        'label' => 'Arthur & Co. · Youth Infusion',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-skincare-saffron.jpg']
                    ],
                    [
                        'title' => 'BOTANICAL RADIANCE OIL',
                        'label' => 'Pure Botanicals · Restorative Elixir',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-skincare-botanical.jpg']
                    ],
                    [
                        'title' => 'VELVET GLOW HYDRA-BALM',
                        'label' => 'Luxury Skincare · Deep Hydration',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-skincare-glow.jpg']
                    ],
                    [
                        'title' => 'GOLDEN IMPERIAL INFUSION',
                        'label' => 'Haute Beauté · Cellular Renewal',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/honey.png']
                    ],
                    [
                        'title' => 'ROSE BOTANICAL ELIXIR',
                        'label' => 'Botanical Labs · Nutrient Drops',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/luxury-beauty.png']
                    ],
                    [
                        'title' => 'CRÈME DE LA MER',
                        'label' => 'La Mer · Miracle Broth Concentrate',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_5.png']
                    ],
                    [
                        'title' => 'THE RICH CREAM',
                        'label' => 'Augustinus Bader · TFC8 Cellular Renew',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_6.png']
                    ],
                    [
                        'title' => 'ADVANCED NIGHT REPAIR',
                        'label' => 'Estée Lauder · Synchronized Recovery Complex',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_7.png']
                    ],
                    [
                        'title' => 'FACIAL TREATMENT ESSENCE',
                        'label' => 'SK-II · Pure Pitera Miracle Moisture',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product_8.png']
                    ],
                    [
                        'title' => 'ROYAL JASMINE NOURISHING OIL',
                        'label' => 'Damascus Botanicals · Pure Cold-Pressed',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/jasmine-oil.png']
                    ]
                ];
            } else {
                $cards = $is_arabic ? [
                    [
                        'title' => 'فستان ميدي كتان نقي',
                        'label' => 'فساتين راقية · صيف معاصر',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-midi-dress.jpg']
                    ],
                    [
                        'title' => 'بلوزة موون الحريرية',
                        'label' => 'بلوزات وتصاميم ناعمة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-moon-blouse.jpg']
                    ],
                    [
                        'title' => 'قميص صن أوفرسايز الفاخر',
                        'label' => 'أزياء يومية راقية',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-sun-blouse.jpg']
                    ],
                    [
                        'title' => 'بليزر صيفي أنيق مونوكروم',
                        'label' => 'بليزرات وتفصيل إيطالي',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/blazer.png']
                    ],
                    [
                        'title' => 'فستان سهرة كوتور مطرز',
                        'label' => 'أزياء الهوت كوتور',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/designer-collections.png']
                    ],
                    [
                        'title' => 'معطف ترنش خريفي فاخر',
                        'label' => 'معاطف وأزياء دافئة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/autumn-edit.png']
                    ],
                    [
                        'title' => 'سترة شانيل من التويد الملكي',
                        'label' => 'شانيل · حرفية باريسية رفيعة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-01.jpg']
                    ],
                    [
                        'title' => 'جاكيت ديور بار الشهير',
                        'label' => 'ديور · قصة خصر أيقونية',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-02.jpg']
                    ],
                    [
                        'title' => 'معطف صوفي أوفرسايز من برادا',
                        'label' => 'برادا · خطوط عصرية جريئة',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-04.jpg']
                    ],
                    [
                        'title' => 'بدلة توكسيدو لو سموكينغ',
                        'label' => 'سان لوران · أناقة سهرة سرمدية',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-05.jpg']
                    ]
                ] : [
                    [
                        'title' => 'PURE LINEN MIDI DRESS',
                        'label' => 'Dresses · Contemporary Summer',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-midi-dress.jpg']
                    ],
                    [
                        'title' => 'SILK MOON BLOUSE',
                        'label' => 'Blouse · Fluid Tailoring',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-moon-blouse.jpg']
                    ],
                    [
                        'title' => 'OVERSIZED SUN SHIRT',
                        'label' => 'Blouse · Resort Elegance',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/product-sun-blouse.jpg']
                    ],
                    [
                        'title' => 'TAILORED SUMMER BLAZER',
                        'label' => 'Tailoring · Italian Craftsmanship',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/blazer.png']
                    ],
                    [
                        'title' => 'EMBROIDERED COUTURE GOWN',
                        'label' => 'Haute Couture · Silk Velvet',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/designer-collections.png']
                    ],
                    [
                        'title' => 'STRUCTURED AUTUMN TRENCH',
                        'label' => 'Outerwear · Pure Cashmere & Wool',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/autumn-edit.png']
                    ],
                    [
                        'title' => 'CHANEL TWEED JACKET',
                        'label' => 'Chanel · Parisian Heritage Couture',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-01.jpg']
                    ],
                    [
                        'title' => 'DIOR ICONIC BAR JACKET',
                        'label' => 'Dior · Sculpted Cinch Silhouette',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-02.jpg']
                    ],
                    [
                        'title' => 'PRADA OVERSIZED WOOL COAT',
                        'label' => 'Prada · Architectural Modern Minimal',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-04.jpg']
                    ],
                    [
                        'title' => 'SAINT LAURENT LE SMOKING',
                        'label' => 'Saint Laurent · Midnight Black Velvet Tuxedo',
                        'image' => ['url' => FG_EXPERIENCE_URL . 'assets/media/hero-look-05.jpg']
                    ]
                ];
            }
        }

        echo '<div class="fg-experience fg-product-showcase-wrap fg-showcase-' . esc_attr($col_type) . '">';
        echo '<div class="fg-product-showcase-header">';
        echo '<h2 class="fg-product-showcase-title">'.esc_html($title).'</h2>';
        echo '<div class="fg-carousel-nav" aria-label="Navigation">';
        echo '<button type="button" class="fg-carousel-btn fg-prev" aria-label="Previous Products"><svg width="22" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="6" x2="2" y2="6"/><polyline points="7 1 2 6 7 11"/></svg></button>';
        echo '<button type="button" class="fg-carousel-btn fg-next" aria-label="Next Products"><svg width="22" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="6" x2="22" y2="6"/><polyline points="17 1 22 6 17 11"/></svg></button>';
        echo '</div>';
        echo '</div>'; // .fg-product-showcase-header

        echo '<div class="fg-product-carousel" tabindex="0" role="region" aria-label="'.esc_attr($title).'">';
        echo '<div class="fg-product-track">';
        foreach ($cards as $card) {
            $c_title = esc_html($card['title'] ?? '');
            $c_cat = esc_html($card['label'] ?? ($card['category'] ?? ($card['body'] ?? '')));
            $img_url = !empty($card['image']['url']) ? esc_url($card['image']['url']) : '';

            echo '<article class="fg-product-card fg-product-preview-only">';
            echo '<div class="fg-product-img-wrap">';
            if ($img_url) {
                echo '<img src="'.$img_url.'" alt="'.$c_title.'" class="fg-product-img" loading="lazy" width="600" height="800">';
            }
            echo '</div>'; // .fg-product-img-wrap

            echo '<div class="fg-product-info">';
            echo '<h3 class="fg-product-name"><span>'.$c_title.'</span></h3>';
            if ($c_cat) {
                echo '<p class="fg-product-category">'.$c_cat.'</p>';
            }
            echo '</div>'; // .fg-product-info

            echo '</article>';
        }
        echo '</div>'; // .fg-product-track
        echo '</div>'; // .fg-product-carousel
        echo '</div>'; // .fg-product-showcase-wrap
    }

    private function render_announcement_bar($s): void {
        if (($s['show_announcement'] ?? 'yes') === 'no') { return; }
        $messages = $s['messages'] ?? [];
        if (empty($messages)) {
            $messages = [
                ['text' => is_rtl() ? 'أحدث تشكيلات الأزياء الراقية متوفرة الآن في فاشن غيت' : 'NEW COLLECTIONS HAVE ARRIVED · VISIT FASHION GATE AT BOULEVARD DAMASCUS', 'link' => ['url' => '#clothes']],
                ['text' => is_rtl() ? 'تفضلوا بزيارتنا في فاشن غيت - بوليفارد دمشق' : 'SPECIAL SEASONAL HIGHLIGHTS & EXCLUSIVE BRANDS NOW AVAILABLE', 'link' => ['url' => '#brands']],
                ['text' => is_rtl() ? 'عطور ونفحات استثنائية من دور العطور العالمية' : 'DISCOVER PRIVATE PERFUME BLENDS & HAUTE PARFUMERIE', 'link' => ['url' => '#perfume']]
            ];
        }
        $speed = max(5, min(180, (float)($s['speed'] ?? 45)));
        echo '<div class="fg-announcement-bar"><div class="fg-announcement-marquee" style="--fg-marquee-speed:'.$speed.'s;"><div class="fg-announcement-track">';
        for ($loop = 0; $loop < 2; $loop++) {
            echo '<div class="fg-announcement-group">';
            foreach ($messages as $msg) {
                $text = esc_html($msg['text'] ?? '');
                $url = !empty($msg['link']['url']) ? esc_url($msg['link']['url']) : '';
                if ($text) {
                    echo '<span class="fg-announcement-item">';
                    if ($url) {
                        echo '<a href="'.$url.'">'.$text.'</a>';
                    } else {
                        echo '<span>'.$text.'</span>';
                    }
                    echo '</span><span class="fg-announcement-sep" aria-hidden="true">✦</span>';
                }
            }
            echo '</div>'; // .fg-announcement-group
        }
        echo '</div></div></div>';
    }

    private function render_fashion_header($s): void {
        $logo_mark_url = FG_EXPERIENCE_URL . 'assets/media/logo.png';
        $logo_svg_url = !empty($s['logo']['url']) ? esc_url($s['logo']['url']) : FG_EXPERIENCE_URL . 'assets/media/fashion-gate-logo.svg';
        $logo_link = !empty($s['logo_url']['url']) ? esc_url($s['logo_url']['url']) : '#';
        $wa_label = esc_html($s['whatsapp_label'] ?? (is_rtl() ? 'واتساب' : 'WhatsApp Us'));
        $wa_number = esc_html($s['whatsapp_number'] ?? '+963 930 000 000');
        $wa_url = !empty($s['whatsapp_url']['url']) ? esc_url($s['whatsapp_url']['url']) : 'https://wa.me/963930000000';
        $phone_num = esc_html($s['phone_number'] ?? '+963 930 000 000');
        $phone_url = !empty($s['phone_url']['url']) ? esc_url($s['phone_url']['url']) : 'tel:+963930000000';
        
        $x_url = !empty($s['x_url']['url']) ? esc_url($s['x_url']['url']) : 'https://x.com/fashiongatemall';
        $ig_url = !empty($s['instagram_url']['url']) ? esc_url($s['instagram_url']['url']) : 'https://www.instagram.com/fashiongatemall';
        $fb_url = !empty($s['facebook_url']['url']) ? esc_url($s['facebook_url']['url']) : 'https://www.facebook.com/fashiongatemall';
        $fashiongate_label = esc_html($s['fashiongatelabel'] ?? (is_rtl() ? 'فـاشـن غـيـت مـول' : 'FASHION GATE MALL'));
        
        $current_lang = Platform::get_current_lang();
        $is_arabic = ($current_lang === 'ar' || is_rtl());

        $lang_label = $is_arabic ? 'EN' : 'AR';
        $lang_url = $is_arabic ? home_url('/landing/en') : home_url('/landing/ar');
        $flag_url = $is_arabic ? FG_EXPERIENCE_URL . 'assets/media/United-Kingdom-flag.svg' : FG_EXPERIENCE_URL . 'assets/media/Syrian-flag.svg';

        echo '<header class="fg-main-header" id="fg-main-header">';
        echo '<div class="fg-header-inner">';
        
        // LEFT SIDE: WhatsApp & Phone (Hidden for now per user request)
        $show_contacts = ($s['show_header_contacts'] ?? 'no') === 'yes';
        if ($show_contacts) {
            echo '<div class="fg-header-left">';
            if ($wa_url) {
                echo '<a href="'.$wa_url.'" target="_blank" rel="noopener noreferrer" class="fg-header-contact-link fg-whatsapp-link" aria-label="WhatsApp">';
                echo '<svg class="fg-header-icon-wa" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.51 1.036 3.531l-.679 2.479 2.544-.667a5.727 5.727 0 0 0 2.867.756h.001c3.181 0 5.767-2.586 5.768-5.766 0-1.541-.6-2.989-1.69-4.079a5.717 5.717 0 0 0-4.079-1.69zm3.565 8.163c-.15.421-.869.805-1.2.835-.308.028-.71.134-2.316-.531-1.933-.8-3.17-2.766-3.268-2.894-.097-.13-.787-1.047-.787-1.996 0-.949.497-1.417.674-1.611.177-.194.388-.243.518-.243.13 0 .259.002.373.007.12.006.281-.045.44.336.162.388.551 1.344.599 1.442.049.097.081.211.016.34-.065.13-.097.21-.194.324-.097.114-.205.255-.293.343-.097.097-.199.203-.086.397.113.194.503.83 1.08 1.344.743.662 1.37.867 1.564.964.194.097.308.081.421-.049.113-.13.486-.567.616-.761.13-.194.259-.162.437-.097.178.065 1.134.535 1.328.632.194.097.324.146.373.227.049.081.049.47-.101.891z"/></svg>';
                echo '<span class="fg-contact-text">'.$wa_label.'</span>';
                echo '</a>';
            }
            if ($phone_num) {
                echo '<span class="fg-header-divider" aria-hidden="true">|</span>';
                echo '<a href="'.$phone_url.'" class="fg-header-contact-link fg-phone-link fg-phone-ltr" dir="ltr">';
                echo '<svg class="fg-header-icon-ph" width="20" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';
                echo '<span class="fg-contact-text fg-phone-ltr" dir="ltr">'.$phone_num.'</span>';
                echo '</a>';
            }
            echo '</div>';
        }

        // CENTER: Logo Icon + "FASHION GATE" Logo Image
        echo '<div class="fg-header-center">';
        echo '<a href="'.$logo_link.'" class="fg-logo-link" aria-label="Fashion Gate">';
        echo '<span class="fg-logo-header">';
        echo '<img src="'.$logo_mark_url.'" alt="FG Logo" class="fg-logo-mark-img" width="32" height="32">';
        echo '</span>';
        // echo '<div class="fg-label-header"> '.$fashiongate_label.'</div>';
        echo '</a>';
        echo '</div>';

        // RIGHT SIDE: Instagram, Facebook, X, Language Switcher
        echo '<div class="fg-header-right">';
        echo '<div class="fg-social-group">';
        if ($ig_url) {
            echo '<a href="'.$ig_url.'" target="_blank" rel="noopener noreferrer" class="fg-social-icon-link" aria-label="Instagram">';
            echo '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';
            echo '</a>';
        }
        if ($fb_url) {
            echo '<a href="'.$fb_url.'" target="_blank" rel="noopener noreferrer" class="fg-social-icon-link" aria-label="Facebook">';
            echo '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
            echo '</a>';
        }
        if ($x_url) {
            echo '<a href="'.$x_url.'" target="_blank" rel="noopener noreferrer" class="fg-social-icon-link" aria-label="X (Twitter)">';
            echo '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
            echo '</a>';
        }
        echo '</div>';
        echo '<span class="fg-header-divider" aria-hidden="true">|</span>';
        echo '<div class="fg-lang-box">';
        echo '<a href="'.$lang_url.'" class="fg-lang-switch-btn" aria-label="Language Switcher">';
        echo '<img src="'.$flag_url.'" alt="Flag" class="fg-flag-img" width="22" height="16">';
        echo '<span class="fg-lang-code">'.$lang_label.'</span>';
        // echo '<svg class="fg-lang-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
        echo '</a>';
        echo '</div>';
        echo '</div>';

        echo '</div>';
        echo '</header>';
    }

    private function form($s): void {
        $id=$this->get_id();
        echo '<form class="fg-form" data-widget="'.esc_attr($id).'" data-success="'.esc_attr($s['success']??'').'" data-error="'.esc_attr($s['error']??'').'">';
        foreach ($s['fields']??[] as $f) {
            $key=sanitize_key($f['key']??''); if (!$key) { continue; }
            $type=in_array($f['type']??'', ['text','email','tel','textarea','select','checkbox'],true)?$f['type']:'text';
            $fid='fg-'.$id.'-'.$key;
            $attrs=' id="'.esc_attr($fid).'" name="'.esc_attr($key).'" '.(($f['required']??'')==='yes'?'required ':'').'placeholder="'.esc_attr($f['placeholder']??'').'"';
            echo '<div class="fg-field"><label for="'.esc_attr($fid).'">'.esc_html($f['label']??$key).'</label>';
            if($type==='textarea') { echo '<textarea'.$attrs.' maxlength="5000" rows="4"></textarea>'; }
            elseif($type==='select') { echo '<select'.$attrs.'><option value=""></option>'; foreach(explode("\n",$f['options']??'') as $option) { $option=trim($option); if($option!=='') { echo '<option value="'.esc_attr($option).'">'.esc_html($option).'</option>'; } } echo '</select>'; }
            else { echo '<input type="'.$type.'"'.$attrs.($type==='checkbox'?' value="yes"':' maxlength="200"').(in_array($type,['email','tel'],true)?' dir="ltr" autocomplete="'.$type.'"':'').'>'; }
            echo '</div>';
        }
        echo '<div class="fg-honeypot" aria-hidden="true"><label>Website<input name="companyWebsite" tabindex="-1" autocomplete="off"></label></div><div class="fg-turnstile"></div>';
        echo '<button class="fg-button" type="submit">'.esc_html($s['cta']??__('Send','fashiongate')).'</button><p class="fg-status" role="status" aria-live="polite" tabindex="-1"></p>';
        $this->button($s['privacy_label']??'',$s['privacy']??[]);
        echo '<noscript>'.esc_html__('Please enable JavaScript to send this form, or use our contact page.','fashiongate').'</noscript></form>';
    }
}
