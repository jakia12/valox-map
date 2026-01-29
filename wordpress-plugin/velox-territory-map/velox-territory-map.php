<?php
/**
 * Plugin Name: Velox Territory Map
 * Plugin URI: https://veloxval.com
 * Description: Interactive USA territory map with admin interface for managing territories and service areas
 * Version: 1.0.0
 * Author: Velox Valuation
 * Author URI: https://veloxval.com
 * License: GPL v2 or later
 * Text Domain: velox-territory-map
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('VELOX_MAP_VERSION', '1.0.0');
define('VELOX_MAP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VELOX_MAP_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main Plugin Class
 */
class Velox_Territory_Map {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->init_hooks();
    }
    
    private function init_hooks() {
        // Activation/Deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        // Admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register shortcode
        add_shortcode('velox_territory_map', array($this, 'render_map_shortcode'));
        
        // AJAX handlers
        add_action('wp_ajax_velox_save_territories', array($this, 'ajax_save_territories'));
        add_action('wp_ajax_velox_get_territories', array($this, 'ajax_get_territories'));
        
        // Enqueue scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_public_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Set default territory data
        if (!get_option('velox_territories_data')) {
            $default_data = $this->get_default_territories();
            update_option('velox_territories_data', $default_data);
        }
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Cleanup if needed
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'Territory Map',
            'Territory Map',
            'manage_options',
            'velox-territory-map',
            array($this, 'render_admin_page'),
            'dashicons-location-alt',
            30
        );
    }
    
    /**
     * Render admin page
     */
    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        include VELOX_MAP_PLUGIN_DIR . 'admin/admin-page.php';
    }
    
    /**
     * Enqueue public scripts
     */
    public function enqueue_public_scripts() {
        // Only load on pages with shortcode
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'velox_territory_map')) {
            wp_enqueue_script('d3', 'https://d3js.org/d3.v7.min.js', array(), '7.0.0', true);
            wp_enqueue_script('topojson', 'https://unpkg.com/topojson-client@3', array('d3'), '3.0.0', true);
        }
    }
    
    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        if ('toplevel_page_velox-territory-map' !== $hook) {
            return;
        }
        
        wp_enqueue_style('velox-admin-styles', VELOX_MAP_PLUGIN_URL . 'admin/admin-styles.css', array(), VELOX_MAP_VERSION);
        wp_enqueue_script('velox-admin-script', VELOX_MAP_PLUGIN_URL . 'admin/admin-script.js', array('jquery'), VELOX_MAP_VERSION, true);
        
        wp_localize_script('velox-admin-script', 'veloxMap', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('velox_map_nonce')
        ));
    }
    
    /**
     * Render map shortcode
     */
    public function render_map_shortcode($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => '600px'
        ), $atts);
        
        // Add version parameter to prevent caching
        $iframe_url = VELOX_MAP_PLUGIN_URL . 'public/map.html?v=' . VELOX_MAP_VERSION . '&t=' . time();
        
        return sprintf(
            '<iframe src="%s" width="%s" height="%s" frameborder="0" style="border:0; max-width:100%%;"></iframe>',
            esc_url($iframe_url),
            esc_attr($atts['width']),
            esc_attr($atts['height'])
        );
    }
    
    /**
     * AJAX: Save territories
     */
    public function ajax_save_territories() {
        check_ajax_referer('velox_map_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $territories = isset($_POST['territories']) ? json_decode(stripslashes($_POST['territories']), true) : array();
        
        if (update_option('velox_territories_data', $territories)) {
            // Also update the JSON file for the map
            $this->update_territories_json($territories);
            wp_send_json_success('Territories saved successfully');
        } else {
            wp_send_json_error('Failed to save territories');
        }
    }
    
    /**
     * AJAX: Get territories
     */
    public function ajax_get_territories() {
        check_ajax_referer('velox_map_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }
        
        $territories = get_option('velox_territories_data', array());
        wp_send_json_success($territories);
    }
    
    /**
     * Update territories JSON file
     */
    private function update_territories_json($territories) {
        $json_file = VELOX_MAP_PLUGIN_DIR . 'public/territories.json';
        file_put_contents($json_file, json_encode($territories, JSON_PRETTY_PRINT));
    }
    
    /**
     * Get default territories data
     */
    private function get_default_territories() {
        $territories_file = VELOX_MAP_PLUGIN_DIR . 'app/components/maps/territories.js';
        
        // For now, return empty array - will be populated from your existing data
        return array();
    }
}

// Initialize the plugin
function velox_territory_map_init() {
    return Velox_Territory_Map::get_instance();
}

add_action('plugins_loaded', 'velox_territory_map_init');
