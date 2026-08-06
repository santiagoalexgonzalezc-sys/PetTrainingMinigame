/**
 * Data Loader Utility
 * Loads JSON data files with fallback to embedded data
 */

const DataLoader = {
    /**
     * Load JSON data from a file with fallback to embedded data
     * @param {string} filePath - Path to the JSON file
     * @param {object} fallbackData - Embedded fallback data
     * @returns {Promise<object>} - Parsed JSON data or fallback
     */
    async loadData(filePath, fallbackData) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.warn(`Failed to load ${filePath}, using fallback data`);
                return fallbackData;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn(`Error loading ${filePath}, using fallback data:`, error);
            return fallbackData;
        }
    },

    /**
     * Load all game data files
     * @param {object} embeddedData - Embedded fallback data for all files
     * @returns {Promise<object>} - Object containing all loaded data
     */
    async loadAllData(embeddedData) {
        const [pets, equipment, zones, achievements] = await Promise.all([
            this.loadData('data/pets.json', embeddedData.pets || {}),
            this.loadData('data/equipment.json', embeddedData.equipment || {}),
            this.loadData('data/zones.json', embeddedData.zones || {}),
            this.loadData('data/achievements.json', embeddedData.achievements || {})
        ]);

        return {
            pets,
            equipment,
            zones,
            achievements
        };
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
