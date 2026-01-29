# Velox Territory Map - WordPress Plugin

## 📍 Overview

An interactive USA territory map plugin for WordPress with a powerful admin interface to manage territories, service areas, and URLs.

## ✨ Features

- **Interactive Map**: Clickable territories with hover tooltips
- **Admin Dashboard**: Easy-to-use interface for managing territories
- **Editable Data**: Add, edit, and delete territories
- **Import/Export**: JSON import/export for bulk updates
- **Shortcode Support**: Simple `[velox_territory_map]` shortcode
- **Iframe Embedding**: Standalone HTML version for any website
- **Responsive Design**: Works on all devices
- **Color-Coded**: Corporate (Yellow), Franchise (Maroon), Green territories

## 📦 Installation

### Method 1: WordPress Admin

1. Download the `velox-territory-map` folder
2. Zip the folder
3. Go to WordPress Admin → Plugins → Add New → Upload Plugin
4. Upload the zip file
5. Click "Install Now" and then "Activate"

### Method 2: Manual Installation

1. Download the `velox-territory-map` folder
2. Upload it to `/wp-content/plugins/` directory
3. Go to WordPress Admin → Plugins
4. Find "Velox Territory Map" and click "Activate"

## 🚀 Usage

### Using the Shortcode

Add this shortcode to any page or post:

```
[velox_territory_map]
```

**With custom dimensions:**

```
[velox_territory_map width="100%" height="800px"]
```

### Using Iframe (for non-WordPress sites)

```html
<iframe
  src="https://yoursite.com/wp-content/plugins/velox-territory-map/public/map.html"
  width="100%"
  height="600"
  frameborder="0"
></iframe>
```

## ⚙️ Managing Territories

### Access the Admin Panel

1. Go to WordPress Admin
2. Click on "Territory Map" in the sidebar menu

### Add a New Territory

1. Click "Add Territory" button
2. Fill in the form:
   - **State**: 2-letter code (e.g., TX, CA, FL)
   - **Territory Name**: Display name (e.g., San Antonio)
   - **Type**: Corporate, Franchise, or Green
   - **Counties**: Comma-separated list (e.g., Bexar, Comal)
   - **Service Area URL**: Full URL to the service area page
3. Click "Add Territory"
4. Click "Save All Changes"

### Edit a Territory

1. Find the territory in the list
2. Modify any field directly
3. Click "Save All Changes"

### Delete a Territory

1. Find the territory in the list
2. Click the "🗑️ Delete" button
3. Confirm the deletion
4. Click "Save All Changes"

### Import/Export

**Export:**

1. Click "Export JSON" button
2. Save the downloaded `territories.json` file

**Import:**

1. Click "Import JSON" button
2. Select a valid `territories.json` file
3. Confirm the import (this will replace all current territories)

## 📁 File Structure

```
velox-territory-map/
├── velox-territory-map.php    # Main plugin file
├── admin/
│   ├── admin-page.php          # Admin interface
│   ├── admin-styles.css        # Admin CSS
│   └── admin-script.js         # Admin JavaScript
├── public/
│   ├── map.html                # Standalone embeddable map
│   └── territories.json        # Territory data (auto-generated)
├── assets/
│   └── maps/                   # TopoJSON map files
└── README.md                   # This file
```

## 🎨 Territory Types & Colors

| Type      | Color  | Hex Code |
| --------- | ------ | -------- |
| Corporate | Yellow | #F2AF58  |
| Franchise | Maroon | #9B2E2E  |
| Green     | Green  | #96CB91  |

## 🔧 Technical Details

### Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Modern browser with JavaScript enabled

### Dependencies

- D3.js v7 (loaded from CDN)
- TopoJSON Client v3 (loaded from CDN)

### Data Storage

Territory data is stored in:

- WordPress option: `velox_territories_data`
- JSON file: `public/territories.json` (for the standalone map)

## 🛠️ Customization

### Changing Map Colors

Edit the `COLORS` object in `public/map.html`:

```javascript
const COLORS = {
  corporate: "#F2AF58", // Change this
  franchise: "#9B2E2E", // Change this
  green: "#96CB91", // Change this
};
```

### Changing Map Dimensions

Default dimensions can be modified in the shortcode:

```php
[velox_territory_map width="1200px" height="700px"]
```

## 📝 Territory Data Format

Each territory object contains:

```json
{
  "key": "TX_SAN_ANTONIO",
  "label": "San Antonio",
  "type": "CORPORATE",
  "counties": ["Bexar", "Comal", "Guadalupe"],
  "url": "https://veloxval.com/service-areas/texas/san-antonio/"
}
```

## ⚠️ Important Notes

1. **County Uniqueness**: Each county can only belong to ONE territory
2. **State Codes**: Use 2-letter USPS state codes (TX, CA, FL, etc.)
3. **County Names**: Must match official county names (without "County" suffix)
4. **URLs**: Must be valid URLs starting with http:// or https://

## 🐛 Troubleshooting

### Map Not Displaying

- Check if the shortcode is correct: `[velox_territory_map]`
- Ensure JavaScript is enabled in the browser
- Check browser console for errors

### Territories Not Showing

- Verify county names match official names
- Check that the state code is correct (2-letter USPS code)
- Ensure you clicked "Save All Changes"

### Admin Page Not Loading

- Check if you have admin privileges
- Clear WordPress cache
- Deactivate and reactivate the plugin

## 📞 Support

For support, please contact Velox Valuation at https://veloxval.com

## 📄 License

GPL v2 or later

## 🔄 Changelog

### Version 1.0.0

- Initial release
- Interactive territory map
- Admin interface for territory management
- Shortcode and iframe embedding
- Import/Export functionality
