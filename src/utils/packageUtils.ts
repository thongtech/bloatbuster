import type { DetectedPackage, DeviceData } from "../types";
import { getPackageMetadata } from "../data/metadata";

/**
 * Internal metadata structure for package information.
 * @property appName - Application display name
 * @property description - Package description text
 */
interface PackageMetadata {
	appName: string;
	description: string;
}

/**
 * Parses package list input, handling "package:" prefix and plain names.
 * @param input - Raw package list text from ADB output
 * @returns Array of cleaned package names
 */
export function parsePackageList(input: string): string[] {
	return input
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => (line.startsWith("package:") ? line.slice(8) : line))
		.filter(Boolean);
}

/**
 * Package name prefixes identifying brand-specific bloatware.
 * Used to categorise packages as vendor-specific bloatware.
 */
const BRAND_PREFIXES: readonly string[] = [
	"com.samsung.",
	"com.skms.",
	"com.sds.",
	"com.sec.",
	"com.xiaomi.",
	"com.miui.",
	"com.mi.",
	"com.huawei.",
	"com.oppo.",
	"com.vivo.",
	"com.oneplus.",
	"com.google.",
	"com.lge.",
	"com.motorola.",
	"com.asus.",
	"com.sony.",
	"com.nokia.",
	"com.facebook.",
	"com.hihonor.",
];

/**
 * Package name prefixes identifying chipset-specific bloatware.
 * Used to categorise packages as chipset vendor bloatware (Qualcomm, MediaTek, etc.).
 */
const CHIPSET_PREFIXES: readonly string[] = [
	"com.qualcomm.",
	"com.qti.",
	"vendor.qti.",
	"com.mediatek.",
	"org.codeaurora.",
];

/**
 * Categorises package by prefix matching against brand or chipset identifiers.
 * Checks package name against known brand and chipset prefixes to determine classification.
 * @param packageName - Package identifier to categorise
 * @returns Category classification: "brand" for vendor-specific, "chipset" for chipset-specific, or "generic" for other bloatware
 */
function categorisePackage(
	packageName: string,
): "brand" | "chipset" | "generic" {
	const lower = packageName.toLowerCase();
	if (BRAND_PREFIXES.some((p) => lower.startsWith(p))) return "brand";
	if (CHIPSET_PREFIXES.some((p) => lower.startsWith(p))) return "chipset";
	return "generic";
}

/**
 * Detects bloatware by comparing installed packages against database.
 * @param installedPackages - Array of installed package names
 * @param deviceData - Database containing recognised and bloatware packages
 * @returns Array of detected packages with metadata and selection state
 */
export function detectBloatware(
	installedPackages: string[],
	deviceData: DeviceData,
): DetectedPackage[] {
	const { recognisedPackages, bloatwarePackages } = deviceData;

	const recognisedPackageSet = new Set(recognisedPackages);
	const bloatwarePackageSet = new Set<string>();
	const bloatwareMetadataMap = new Map<string, PackageMetadata>();

	for (const item of bloatwarePackages) {
		const packageId = typeof item === "string" ? item : item.appID;
		bloatwarePackageSet.add(packageId);

		if (typeof item !== "string") {
			bloatwareMetadataMap.set(packageId, {
				appName: item.appName || packageId,
				description: item.description || "",
			});
		}
	}

	const detected: DetectedPackage[] = [];
	const processedPackages = new Set<string>();

	for (const packageName of installedPackages) {
		if (processedPackages.has(packageName)) continue;
		processedPackages.add(packageName);
		if (recognisedPackageSet.has(packageName)) {
			const meta = getPackageMetadata(packageName);
			const appName = meta?.appName || packageName;
			const description =
				meta?.description ||
				"Recognised as a legitimate application. Not identified as bloatware, but can be removed if desired.";
			detected.push({
				packageName,
				appName,
				description,
				category: "system" as const,
				selected: false,
				safetyRating: meta?.safetyRating,
				removalImpact: meta?.removalImpact,
				packageCategory: meta?.category,
			});
			continue;
		}
		if (bloatwarePackageSet.has(packageName)) {
			const meta = getPackageMetadata(packageName);
			const bloatMeta = bloatwareMetadataMap.get(packageName);
			const appName = meta?.appName || bloatMeta?.appName || packageName;
			const description = meta?.description || bloatMeta?.description || "";
			detected.push({
				packageName,
				appName,
				description,
				category: categorisePackage(packageName),
				selected: true,
				safetyRating: meta?.safetyRating,
				removalImpact: meta?.removalImpact,
				packageCategory: meta?.category,
			});
		} else {
			const meta = getPackageMetadata(packageName);
			const appName = meta?.appName || packageName;
			const description =
				meta?.description ||
				"Unrecognised package - not in our verified database. Research carefully before removing.";
			detected.push({
				packageName,
				appName,
				description,
				category: "suspicious" as const,
				selected: false,
				safetyRating: meta?.safetyRating,
				removalImpact: meta?.removalImpact,
				packageCategory: meta?.category,
			});
		}
	}

	return detected;
}

/**
 * Human-readable labels for package categories.
 * Maps internal category identifiers to display names in the UI.
 */
const categoryLabels: Record<string, string> = {
	brand: "Brand-Specific Bloatware",
	chipset: "Chipset-Specific Bloatware",
	generic: "Generic Bloatware",
	suspicious: "Suspicious Packages",
	system: "Other Installed Apps",
};

/**
 * Priority ordering for package categories in the UI.
 * Lower numbers appear first in the accordion list.
 */
const categoryOrderMap = new Map<string, number>([
	["brand", 0],
	["chipset", 1],
	["generic", 2],
	["suspicious", 3],
	["system", 4],
]);

/**
 * Default priority value for uncategorised packages.
 * Used when a package category is not found in the order map.
 */
const DEFAULT_CATEGORY_PRIORITY = 999;

/**
 * Groups packages by category with priority ordering.
 * @param packages - Array of detected packages to group
 * @returns Map of category labels to sorted package arrays
 */
export function groupByCategory(
	packages: DetectedPackage[],
): Map<string, DetectedPackage[]> {
	const groups = new Map<string, DetectedPackage[]>();
	const sorted = [...packages].sort(
		(a, b) =>
			(categoryOrderMap.get(a.category) ?? DEFAULT_CATEGORY_PRIORITY) -
			(categoryOrderMap.get(b.category) ?? DEFAULT_CATEGORY_PRIORITY),
	);
	for (const pkg of sorted) {
		const label = categoryLabels[pkg.category] || pkg.category;
		if (!groups.has(label)) groups.set(label, []);
		groups.get(label)!.push(pkg);
	}
	return groups;
}
