import { useState, useEffect, useMemo, useCallback } from "react";
import {
	Accordion,
	Anchor,
	Badge,
	Box,
	Button,
	Checkbox,
	Group,
	Paper,
	Stack,
	Text,
	TextInput,
	Tooltip,
	rem,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
	IconAlertTriangle,
	IconShieldCheck,
	IconInfoCircle,
	IconSearch,
} from "@tabler/icons-react";
import type { DetectedPackage } from "../types";
import { groupByCategory } from "../utils/packageUtils";

/**
 * Props for PackageList component.
 * @property packages - Array of detected packages to display
 * @property onPackagesChange - Callback function when package selection changes
 */
interface PackageListProps {
	packages: DetectedPackage[];
	onPackagesChange: (packages: DetectedPackage[]) => void;
}

/**
 * Colour mapping for package categories in the UI.
 * Defines visual colour scheme for each package category type.
 */
const CATEGORY_COLORS: Record<string, string> = {
	"Brand-Specific Bloatware": "#3B82F6",
	"Chipset-Specific Bloatware": "#8B5CF6",
	"Generic Bloatware": "#F59E0B",
	"Suspicious Packages": "#EF4444",
	"Other Installed Apps": "#10B981",
};

/**
 * Generates Google search URL for package research.
 * @param pkg - Package identifier
 * @returns Google search URL
 */
const getGoogleSearchUrl = (pkg: string): string =>
	`https://www.google.com/search?q=${encodeURIComponent(
		`android ${pkg} package`
	)}`;

/**
 * Filters packages by search term across package name, app name, and description.
 * @param packages - Packages to filter
 * @param term - Search term
 * @returns Filtered package array
 */
const filterPackages = (
	packages: DetectedPackage[],
	term: string
): DetectedPackage[] => {
	if (!term.trim()) return packages;
	const search = term.trim().toLowerCase();
	return packages.filter((p) => {
		return (
			p.packageName.toLowerCase().includes(search) ||
			p.appName.toLowerCase().includes(search) ||
			(p.description?.toLowerCase().includes(search) ?? false)
		);
	});
};

/**
 * Styling configuration for safety rating badges.
 * Provides consistent visual styling for safe, caution, and risky package ratings.
 */
const SAFETY_RATING_STYLES = {
	safe: {
		background: "#14261A",
		color: "#86EFAC",
		border: "1px solid #166534",
	},
	caution: {
		background: "#2D2510",
		color: "#FCD34D",
		border: "1px solid #92400E",
	},
	risky: {
		background: "#2D1515",
		color: "#FCA5A5",
		border: "1px solid #7F1D1D",
	},
} as const;

/**
 * Reusable style configurations for common UI components.
 */
const COMMON_STYLES = {
	paper: { background: "#1A1A1A", border: "1px solid #2A2A2A" },
	paperDark: { background: "#0A0A0A", border: "1px solid #2A2A2A" },
	buttonIndigo: {
		root: {
			fontWeight: 600,
			background: "#3730A3",
			color: "#FFFFFF",
			"&:hover": { background: "#4338CA" },
		},
	},
	buttonSubtle: {
		root: {
			fontWeight: 600,
			color: "#9CA3AF",
			"&:hover": { background: "#2A2A2A" },
		},
	},
};

/**
 * Debounce delay for search input (milliseconds).
 */
const SEARCH_DEBOUNCE_MS = 200;

/**
 * Displays detected packages grouped by category with search and selection controls.
 * @param packages - Array of detected packages
 * @param onPackagesChange - Callback when package selection changes
 */
export function PackageList({ packages, onPackagesChange }: PackageListProps) {
	const groups = useMemo(() => groupByCategory(packages), [packages]);
	const categoryKeys = useMemo(
		() => Array.from(groups.keys()).filter((k) => k !== "Other Installed Apps"),
		[groups]
	);
	const [expandedCategories, setExpandedCategories] = useState<string[]>(() =>
		Array.from(groups.keys()).filter((k) => k !== "Other Installed Apps")
	);
	const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
	const [debouncedSearchTerms] = useDebouncedValue(
		searchTerms,
		SEARCH_DEBOUNCE_MS
	);

	useEffect(() => {
		setExpandedCategories((prev) => {
			const newCategories = categoryKeys.filter((k) => !prev.includes(k));
			return newCategories.length > 0 ? [...prev, ...newCategories] : prev;
		});
	}, [categoryKeys]);

	/**
	 * Updates search term for a specific category.
	 * @param category - Category name to update
	 * @param value - New search term value
	 */
	const handleSearchChange = useCallback(
		(category: string, value: string) =>
			setSearchTerms((prev) => ({ ...prev, [category]: value })),
		[]
	);

	/**
	 * Toggles selection state for all packages in a category.
	 * @param category - Category name to toggle
	 * @param selected - Target selection state
	 */
	const handleToggleAll = useCallback(
		(category: string, selected: boolean) => {
			const catPkgs = groups.get(category) || [];
			if (!catPkgs.length) return;
			const names = new Set(catPkgs.map((p) => p.packageName));
			const needsUpdate = catPkgs.some((p) => p.selected !== selected);
			if (!needsUpdate) return;
			const updated = packages.map((p) =>
				names.has(p.packageName) && p.selected !== selected
					? { ...p, selected }
					: p
			);
			onPackagesChange(updated);
		},
		[groups, packages, onPackagesChange]
	);

	/**
	 * Toggles selection state for a single package.
	 * @param name - Package identifier to toggle
	 */
	const handleTogglePackage = useCallback(
		(name: string) =>
			onPackagesChange(
				packages.map((p) =>
					p.packageName === name ? { ...p, selected: !p.selected } : p
				)
			),
		[packages, onPackagesChange]
	);

	/**
	 * Selects all packages across all categories.
	 */
	const handleSelectAll = useCallback(() => {
		onPackagesChange(packages.map((p) => ({ ...p, selected: true })));
	}, [packages, onPackagesChange]);

	/**
	 * Deselects all packages across all categories.
	 */
	const handleDeselectAll = useCallback(() => {
		onPackagesChange(packages.map((p) => ({ ...p, selected: false })));
	}, [packages, onPackagesChange]);

	const filteredPackagesByCategory = useMemo(() => {
		const filtered = new Map<string, DetectedPackage[]>();
		for (const [cat, pkgs] of groups.entries()) {
			filtered.set(cat, filterPackages(pkgs, debouncedSearchTerms[cat] || ""));
		}
		return filtered;
	}, [groups, debouncedSearchTerms]);

	/**
	 * Map of category names to selected package counts.
	 * Computed once per groups change for efficient lookups.
	 * @returns Map with category names as keys and selected package counts as values
	 */
	const selectedCountByCategory = useMemo(() => {
		const countMap = new Map<string, number>();
		for (const [cat, pkgs] of groups.entries()) {
			countMap.set(cat, pkgs.filter((pkg) => pkg.selected).length);
		}
		return countMap;
	}, [groups]);

	/**
	 * Total count of selected packages across all categories.
	 * @returns Number of packages currently selected for removal
	 */
	const totalSelected = useMemo(
		() => packages.filter((p) => p.selected).length,
		[packages]
	);

	if (!packages.length) return null;

	return (
		<Paper shadow="sm" radius={rem(28)} p={rem(32)} style={COMMON_STYLES.paper}>
			<Stack gap={rem(24)}>
				<Group justify="space-between" wrap="nowrap">
					<Box>
						<Text size="xl" fw={700} c="#FFFFFF" mb={rem(4)}>
							Detected Packages
						</Text>
						<Text size="sm" c="#9CA3AF" fw={500}>
							Review packages and select which ones to remove
						</Text>
					</Box>
					<Group gap="xs">
						<Button
							size="sm"
							variant="light"
							color="indigo"
							onClick={handleSelectAll}
							radius={rem(12)}
							styles={COMMON_STYLES.buttonIndigo}
						>
							Select All
						</Button>
						<Button
							size="sm"
							variant="subtle"
							onClick={handleDeselectAll}
							radius={rem(12)}
							styles={COMMON_STYLES.buttonSubtle}
						>
							Clear
						</Button>
					</Group>
				</Group>

				<Paper p="lg" radius={rem(16)} style={COMMON_STYLES.paperDark}>
					<Group justify="space-between">
						<Text size="sm" fw={600} c="#9CA3AF">
							{totalSelected} of {packages.length} packages selected
						</Text>
						<Badge
							size="lg"
							radius={rem(12)}
							styles={{
								root: {
									background:
										"linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
									color: "white",
									fontWeight: 600,
									padding: `${rem(8)} ${rem(16)}`,
								},
							}}
						>
							{totalSelected} / {packages.length}
						</Badge>
					</Group>
				</Paper>

				<Accordion
					multiple
					value={expandedCategories}
					onChange={setExpandedCategories}
					styles={{
						item: {
							background: "#0A0A0A",
							border: "1px solid #2A2A2A",
							borderRadius: rem(20),
							marginBottom: rem(12),
							overflow: "hidden",
						},
						control: { padding: rem(20), "&:hover": { background: "#1A1A1A" } },
						content: { padding: rem(20), paddingTop: 0 },
					}}
				>
					{Array.from(groups.entries()).map(([category, categoryPackages]) => {
						const selectedCount = selectedCountByCategory.get(category) || 0;
						const isSuspicious = category === "Suspicious Packages";
						const isSystem = category === "Other Installed Apps";
						const categoryColor = CATEGORY_COLORS[category] || "#6B7280";
						return (
							<Accordion.Item key={category} value={category}>
								<Accordion.Control>
									<Group justify="space-between" wrap="nowrap" pr="md">
										<Box>
											<Text fw={700} size="md" c="#FFFFFF">
												{category}
											</Text>
											<Text size="xs" c="#6B7280" mt={rem(4)} fw={500}>
												{selectedCount} of {categoryPackages.length} selected
											</Text>
										</Box>
										<Group gap="xs">
											<Badge
												size="lg"
												radius={rem(12)}
												styles={{
													root: {
														background: categoryColor,
														color: "white",
														fontWeight: 600,
													},
												}}
											>
												{categoryPackages.length}
											</Badge>
										</Group>
									</Group>
								</Accordion.Control>
								<Accordion.Panel>
									<Stack gap="md">
										<Paper
											p="sm"
											radius={rem(12)}
											style={{ background: "#1A1A1A", border: "none" }}
										>
											<Group justify="space-between">
												<Button
													size="xs"
													variant="subtle"
													onClick={() => handleToggleAll(category, true)}
													radius={rem(8)}
													styles={{
														root: {
															fontWeight: 600,
															color: categoryColor,
															"&:hover": { background: "#2A2A2A" },
														},
													}}
												>
													Select All in Category
												</Button>
												<Button
													size="xs"
													variant="subtle"
													onClick={() => handleToggleAll(category, false)}
													radius={rem(8)}
													styles={COMMON_STYLES.buttonSubtle}
												>
													Deselect All
												</Button>
											</Group>
										</Paper>
										<TextInput
											placeholder="Search by app ID, name, or description..."
											value={searchTerms[category] || ""}
											onChange={(e) =>
												handleSearchChange(category, e.currentTarget.value)
											}
											leftSection={<IconSearch size={16} />}
											size="md"
											radius={rem(12)}
											styles={{
												input: {
													background: "#0A0A0A",
													border: "1px solid #2A2A2A",
													color: "#FFFFFF",
													"&:focus": { borderColor: categoryColor },
												},
											}}
										/>

										{isSuspicious && (
											<Paper
												p="md"
												radius={rem(16)}
												style={{
													background: "#2D2510",
													border: "1px solid #92400E",
												}}
											>
												<Group gap="sm" align="flex-start">
													<IconAlertTriangle size={20} color="#FCD34D" />
													<Box style={{ flex: 1 }}>
														<Text size="sm" fw={700} c="#FCD34D" mb={rem(4)}>
															Suspicious Packages Detected
														</Text>
														<Text
															size="xs"
															c="#D1D5DB"
															style={{ lineHeight: 1.6 }}
														>
															These packages aren't in our database. Research
															carefully before removing.
														</Text>
													</Box>
												</Group>
											</Paper>
										)}
										{isSystem && (
											<Paper
												p="md"
												radius={rem(16)}
												style={{
													background: "#14261A",
													border: "1px solid #166534",
												}}
											>
												<Group gap="sm" align="flex-start">
													<IconShieldCheck size={20} color="#86EFAC" />
													<Box style={{ flex: 1 }}>
														<Text size="sm" fw={700} c="#86EFAC" mb={rem(4)}>
															Recognised Legitimate Apps
														</Text>
														<Text
															size="xs"
															c="#D1D5DB"
															style={{ lineHeight: 1.6 }}
														>
															These are recognised legitimate applications and
															system packages that are NOT bloatware. This
															includes core Android components, essential
															services, and legitimate apps like Google Chrome,
															Spotify, or YouTube. These packages are not
															selected by default, but can be removed if desired
															(e.g., Chrome if you use another browser).
														</Text>
													</Box>
												</Group>
											</Paper>
										)}

										<Stack gap="sm">
											{(filteredPackagesByCategory.get(category) || []).map(
												(pkg) => {
													const hasEnhancedInfo =
														pkg.safetyRating && pkg.removalImpact;
													const isSuspiciousPackage =
														pkg.category === "suspicious";
													return (
														<Paper
															key={pkg.packageName}
															p="md"
															radius={rem(16)}
															style={{
																border: pkg.selected
																	? `2px solid ${categoryColor}`
																	: "1px solid #2A2A2A",
																background: pkg.selected
																	? "#1A1A1A"
																	: "#0A0A0A",
																transition: "all 0.2s ease",
															}}
														>
															<Group gap="md" wrap="nowrap" align="flex-start">
																<Checkbox
																	checked={pkg.selected}
																	onChange={() =>
																		handleTogglePackage(pkg.packageName)
																	}
																	size="md"
																	color="indigo"
																	styles={{
																		input: {
																			cursor: "pointer",
																			borderRadius: rem(6),
																			background: "#0A0A0A",
																			borderColor: "#2A2A2A",
																		},
																	}}
																/>
																<Box style={{ flex: 1 }}>
																	<Group gap="xs" mb="xs" wrap="nowrap">
																		<Text size="sm" fw={700} c="#FFFFFF">
																			{pkg.appName}
																		</Text>
																		{hasEnhancedInfo && (
																			<Tooltip label="Verified information">
																				<IconShieldCheck
																					size={16}
																					color="#22C55E"
																				/>
																			</Tooltip>
																		)}
																		{pkg.safetyRating && (
																			<Badge
																				size="sm"
																				radius={rem(8)}
																				styles={{
																					root: {
																						...SAFETY_RATING_STYLES[
																							pkg.safetyRating
																						],
																						fontWeight: 700,
																						textTransform: "uppercase",
																						fontSize: rem(10),
																					},
																				}}
																			>
																				{pkg.safetyRating}
																			</Badge>
																		)}
																	</Group>

																	{isSuspiciousPackage ? (
																		<Tooltip label="Click to search on Google">
																			<Anchor
																				href={getGoogleSearchUrl(
																					pkg.packageName
																				)}
																				target="_blank"
																				rel="noopener noreferrer"
																				size="xs"
																				c="#3B82F6"
																				fw={500}
																				mb="xs"
																				style={{
																					fontFamily: "monospace",
																					wordBreak: "break-all",
																					textDecoration: "none",
																					display: "inline-flex",
																					alignItems: "center",
																					gap: rem(6),
																				}}
																				styles={{
																					root: {
																						"&:hover": {
																							textDecoration: "underline",
																							color: "#60A5FA",
																						},
																					},
																				}}
																			>
																				<IconSearch size={14} />
																				{pkg.packageName}
																			</Anchor>
																		</Tooltip>
																	) : (
																		<Text
																			size="xs"
																			c="#6B7280"
																			mb="xs"
																			style={{
																				fontFamily: "monospace",
																				wordBreak: "break-all",
																			}}
																		>
																			{pkg.packageName}
																		</Text>
																	)}

																	{pkg.description && hasEnhancedInfo && (
																		<Paper
																			p="sm"
																			radius={rem(12)}
																			mb="xs"
																			style={COMMON_STYLES.paper}
																		>
																			<Text
																				size="sm"
																				c="#D1D5DB"
																				style={{ lineHeight: 1.6 }}
																			>
																				{pkg.description}
																			</Text>
																		</Paper>
																	)}
																	{pkg.removalImpact && (
																		<Group gap="xs" mt="sm">
																			<IconInfoCircle
																				size={14}
																				color="#818CF8"
																			/>
																			<Text size="xs" c="#9CA3AF" fw={500}>
																				<Text component="span" fw={700}>
																					Impact:
																				</Text>{" "}
																				{pkg.removalImpact}
																			</Text>
																		</Group>
																	)}
																	{!hasEnhancedInfo && pkg.description && (
																		<Text
																			size="xs"
																			c="#9CA3AF"
																			mt="xs"
																			style={{ lineHeight: 1.6 }}
																		>
																			{pkg.description}
																		</Text>
																	)}
																	{pkg.packageCategory && (
																		<Badge
																			size="sm"
																			variant="dot"
																			mt="xs"
																			radius={rem(8)}
																			styles={{
																				root: {
																					background: "#2A2A2A",
																					color: "#9CA3AF",
																					fontWeight: 600,
																				},
																			}}
																		>
																			{pkg.packageCategory}
																		</Badge>
																	)}
																</Box>
															</Group>
														</Paper>
													);
												}
											)}
										</Stack>
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
						);
					})}
				</Accordion>
			</Stack>
		</Paper>
	);
}
