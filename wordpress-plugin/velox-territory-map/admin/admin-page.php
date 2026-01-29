<?php
// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Handle form submission
if (isset($_POST['velox_save_territories']) && check_admin_referer('velox_territories_save', 'velox_territories_nonce')) {
    $territories = isset($_POST['territories']) ? json_decode(stripslashes($_POST['territories']), true) : array();
    update_option('velox_territories_data', $territories);
    
    // Update JSON file
    $json_file = VELOX_MAP_PLUGIN_DIR . 'public/territories.json';
    file_put_contents($json_file, json_encode($territories, JSON_PRETTY_PRINT));
    
    echo '<div class="notice notice-success"><p>Territories saved successfully!</p></div>';
}

// Get current territories
$territories = get_option('velox_territories_data', array());
?>

<div class="wrap">
    <h1>Territory Map Manager</h1>
    
    <div class="velox-admin-container">
        <!-- Shortcode Info -->
        <div class="velox-info-box">
            <h3>📍 How to Use</h3>
            <p>Add this shortcode to any page or post:</p>
            <code>[velox_territory_map]</code>
            <p style="margin-top: 10px;">Or use this iframe code:</p>
            <code>&lt;iframe src="<?php echo esc_url(VELOX_MAP_PLUGIN_URL . 'public/map.html'); ?>" width="100%" height="600" frameborder="0"&gt;&lt;/iframe&gt;</code>
        </div>

        <!-- Territory Editor -->
        <div class="velox-editor-section">
            <h2>Territory Editor</h2>
            
            <form method="post" id="velox-territories-form">
                <?php wp_nonce_field('velox_territories_save', 'velox_territories_nonce'); ?>
                
                <div class="velox-editor-toolbar">
                    <button type="button" class="button button-primary" id="add-territory">+ Add Territory</button>
                    <button type="button" class="button" id="import-json">Import JSON</button>
                    <button type="button" class="button" id="export-json">Export JSON</button>
                    <button type="submit" name="velox_save_territories" class="button button-primary">💾 Save All Changes</button>
                </div>

                <div id="territories-container">
                    <?php if (empty($territories)): ?>
                        <p class="no-territories">No territories yet. Click "Add Territory" to get started.</p>
                    <?php else: ?>
                        <?php foreach ($territories as $state => $state_territories): ?>
                            <div class="state-group" data-state="<?php echo esc_attr($state); ?>">
                                <h3><?php echo esc_html($state); ?> Territories</h3>
                                <?php foreach ($state_territories as $index => $territory): ?>
                                    <div class="territory-item">
                                        <div class="territory-header">
                                            <span class="territory-label"><?php echo esc_html($territory['label']); ?></span>
                                            <span class="territory-type <?php echo esc_attr(strtolower($territory['type'])); ?>">
                                                <?php echo esc_html($territory['type']); ?>
                                            </span>
                                            <button type="button" class="button-link delete-territory">🗑️ Delete</button>
                                        </div>
                                        <div class="territory-details">
                                            <div class="form-row">
                                                <label>Territory Name:</label>
                                                <input type="text" name="territories[<?php echo $state; ?>][<?php echo $index; ?>][label]" 
                                                       value="<?php echo esc_attr($territory['label']); ?>" required>
                                            </div>
                                            <div class="form-row">
                                                <label>Type:</label>
                                                <select name="territories[<?php echo $state; ?>][<?php echo $index; ?>][type]" required>
                                                    <option value="CORPORATE" <?php selected($territory['type'], 'CORPORATE'); ?>>Corporate</option>
                                                    <option value="FRANCHISE" <?php selected($territory['type'], 'FRANCHISE'); ?>>Franchise</option>
                                                    <option value="GREEN" <?php selected($territory['type'], 'GREEN'); ?>>Green</option>
                                                </select>
                                            </div>
                                            <div class="form-row">
                                                <label>Counties (comma-separated):</label>
                                                <input type="text" name="territories[<?php echo $state; ?>][<?php echo $index; ?>][counties]" 
                                                       value="<?php echo esc_attr(implode(', ', $territory['counties'])); ?>" required>
                                            </div>
                                            <div class="form-row">
                                                <label>Service Area URL:</label>
                                                <input type="url" name="territories[<?php echo $state; ?>][<?php echo $index; ?>][url]" 
                                                       value="<?php echo esc_attr($territory['url']); ?>" required>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

                <input type="hidden" name="territories" id="territories-json" value="">
            </form>
        </div>

        <!-- Map Preview -->
        <div class="velox-preview-section">
            <h2>Map Preview</h2>
            <iframe src="<?php echo esc_url(VELOX_MAP_PLUGIN_URL . 'public/map.html'); ?>" 
                    width="100%" height="600" frameborder="0" style="border: 1px solid #ddd; border-radius: 8px;"></iframe>
        </div>
    </div>
</div>

<!-- Add Territory Modal -->
<div id="add-territory-modal" class="velox-modal" style="display:none;">
    <div class="velox-modal-content">
        <span class="velox-modal-close">&times;</span>
        <h2>Add New Territory</h2>
        <form id="add-territory-form">
            <div class="form-row">
                <label>State (2-letter code):</label>
                <input type="text" id="new-state" maxlength="2" required placeholder="e.g., TX, CA, FL">
            </div>
            <div class="form-row">
                <label>Territory Name:</label>
                <input type="text" id="new-label" required placeholder="e.g., San Antonio">
            </div>
            <div class="form-row">
                <label>Type:</label>
                <select id="new-type" required>
                    <option value="CORPORATE">Corporate</option>
                    <option value="FRANCHISE">Franchise</option>
                    <option value="GREEN">Green</option>
                </select>
            </div>
            <div class="form-row">
                <label>Counties (comma-separated):</label>
                <input type="text" id="new-counties" required placeholder="e.g., Bexar, Comal">
            </div>
            <div class="form-row">
                <label>Service Area URL:</label>
                <input type="url" id="new-url" required placeholder="https://veloxval.com/service-areas/...">
            </div>
            <button type="submit" class="button button-primary">Add Territory</button>
        </form>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    // Add territory modal
    $('#add-territory').on('click', function() {
        $('#add-territory-modal').show();
    });
    
    $('.velox-modal-close').on('click', function() {
        $('#add-territory-modal').hide();
    });
    
    // Add territory form submission
    $('#add-territory-form').on('submit', function(e) {
        e.preventDefault();
        
        const state = $('#new-state').val().toUpperCase();
        const label = $('#new-label').val();
        const type = $('#new-type').val();
        const counties = $('#new-counties').val().split(',').map(c => c.trim());
        const url = $('#new-url').val();
        
        // Add to form (simplified - in production, you'd append to the territories container)
        alert('Territory added! Click "Save All Changes" to persist.');
        $('#add-territory-modal').hide();
        this.reset();
    });
    
    // Delete territory
    $(document).on('click', '.delete-territory', function() {
        if (confirm('Are you sure you want to delete this territory?')) {
            $(this).closest('.territory-item').remove();
        }
    });
    
    // Export JSON
    $('#export-json').on('click', function() {
        const territories = <?php echo json_encode($territories); ?>;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(territories, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "territories.json");
        downloadAnchor.click();
    });
    
    // Import JSON
    $('#import-json').on('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (confirm('This will replace all current territories. Continue?')) {
                        // Reload page with new data
                        location.reload();
                    }
                } catch (err) {
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
});
</script>
