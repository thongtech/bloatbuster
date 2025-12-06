/**
 * Package information with optional metadata.
 * @property appID - Unique package identifier
 * @property appName - Human-readable application name
 * @property description - Optional package description
 */
export interface PackageInfo {
	appID: string;
	appName?: string;
	description?: string;
}

/**
 * Package data can be either a simple string identifier or a PackageInfo object.
 */
export type PackageData = string | PackageInfo;

/**
 * Device package database structure.
 * @property recognisedPackages - Array of legitimate system packages
 * @property bloatwarePackages - Array of bloatware packages (strings or PackageInfo objects)
 */
export interface DeviceData {
	recognisedPackages: string[];
	bloatwarePackages: PackageData[];
}

/**
 * Detected package with classification and metadata.
 * @property packageName - Package identifier
 * @property appName - Human-readable application name
 * @property description - Package description
 * @property safetyRating - Optional safety rating for removal
 * @property removalImpact - Optional description of removal consequences
 * @property packageCategory - Optional package category classification
 * @property category - Package classification category
 * @property selected - Whether package is selected for removal
 */
export interface DetectedPackage {
	packageName: string;
	appName: string;
	description: string;
	safetyRating?: "safe" | "caution" | "risky";
	removalImpact?: string;
	packageCategory?: string;
	category: "brand" | "chipset" | "generic" | "suspicious" | "system";
	selected: boolean;
}
