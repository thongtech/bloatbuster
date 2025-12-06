import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
	Alert,
	Button,
	Container,
	Group,
	Paper,
	Stack,
	Text,
	Textarea,
	Title,
	Box,
	rem,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconDeviceMobile,
	IconSearch,
	IconBrandGithub,
	IconBrandAndroid,
	IconClipboard,
	IconArrowDown,
} from "@tabler/icons-react";
import type { DetectedPackage } from "./types";
import { bloatwareData } from "./data";
import { parsePackageList, detectBloatware } from "./utils/packageUtils";
import { InstructionsAlert } from "./components/InstructionsAlert";
import { PackageList } from "./components/PackageList";
import { CommandsDisplay } from "./components/CommandsDisplay";
import { SafetyRatingGuide } from "./components/SafetyRatingGuide";

/**
 * Processing delay to allow UI updates (milliseconds).
 */
const PROCESSING_DELAY_MS = 100;

/**
 * Animation delay for smooth transitions (milliseconds).
 */
const ANIMATION_DELAY_MS = 300;

/**
 * Scroll threshold for showing scroll-to-bottom button (pixels).
 */
const SCROLL_THRESHOLD_PX = 100;

export function App() {
	const [packageInput, setPackageInput] = useState("");
	const [detectedPackages, setDetectedPackages] = useState<DetectedPackage[]>(
		[]
	);
	const [error, setError] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentStep, setCurrentStep] = useState<1 | 2>(1);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const resultsRef = useRef<HTMLDivElement>(null);

	/**
	 * Processes package list input and detects bloatware packages.
	 * Validates input, parses packages, and updates application state.
	 */
	const handleDetectBloatware = useCallback(async () => {
		setError(null);
		if (!packageInput.trim()) {
			setError("Please paste your package list");
			return;
		}
		setIsProcessing(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, PROCESSING_DELAY_MS));
			const installedPackages = parsePackageList(packageInput);
			if (installedPackages.length === 0) {
				setError("No valid packages found in the input");
				setIsProcessing(false);
				return;
			}
			const detected = detectBloatware(installedPackages, bloatwareData);
			await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAY_MS));
			setDetectedPackages(detected);
			setCurrentStep(2);
			setTimeout(() => {
				resultsRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, PROCESSING_DELAY_MS);
		} catch (err) {
			setError(
				`An error occurred whilst processing: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
		} finally {
			setIsProcessing(false);
		}
	}, [packageInput]);

	/**
	 * Generates ADB commands and calculates package statistics.
	 * Processes detected packages to create removal commands and category counts.
	 */
	const {
		commands,
		selectedCount,
		bloatwareCount,
		suspiciousCount,
		systemCount,
	} = useMemo(() => {
		let selectedCount = 0;
		let bloatwareCount = 0;
		let suspiciousCount = 0;
		let systemCount = 0;
		const commands: string[] = [];

		for (const pkg of detectedPackages) {
			if (pkg.selected) {
				selectedCount++;
				commands.push(
					`pm disable-user --user 0 ${pkg.packageName}`,
					`pm clear --user 0 ${pkg.packageName}`,
					`pm uninstall --user 0 ${pkg.packageName}`
				);
			}

			if (pkg.category === "suspicious") {
				suspiciousCount++;
			} else if (pkg.category === "system") {
				systemCount++;
			} else {
				bloatwareCount++;
			}
		}

		return {
			commands,
			selectedCount,
			bloatwareCount,
			suspiciousCount,
			systemCount,
		};
	}, [detectedPackages]);

	/**
	 * Scrolls the page to the bottom with smooth animation.
	 */
	const scrollToBottom = useCallback(() => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: "smooth",
		});
	}, []);

	/**
	 * Monitors scroll position to show/hide scroll-to-bottom button.
	 * Button appears when user is not near the bottom of the page.
	 */
	useEffect(() => {
		const handleScroll = () => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const isNearBottom =
				documentHeight - scrollTop - windowHeight < SCROLL_THRESHOLD_PX;
			setShowScrollButton(!isNearBottom);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<Box style={{ minHeight: "100vh", background: "#0A0A0A" }}>
			<Container size="lg" py={rem(24)}>
				<Stack gap={rem(24)}>
					<Group gap={rem(32)} mb="md" align="flex-start">
						<Box style={{ position: "relative" as const, flexShrink: 0 }}>
							<Box
								style={{
									width: rem(72),
									height: rem(72),
									borderRadius: rem(20),
									background: "#0A0A0A",
									border: "3px solid #6366F1",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									position: "relative" as const,
									boxShadow:
										"0 0 0 2px #0A0A0A, 0 0 24px rgba(99, 102, 241, 0.4), 0 0 48px rgba(99, 102, 241, 0.2)",
								}}
							>
								<IconDeviceMobile size={40} stroke={2.5} color="#6366F1" />
							</Box>
							<Box
								style={{
									position: "absolute" as const,
									top: rem(-4),
									right: rem(-4),
									width: rem(20),
									height: rem(20),
									borderRadius: "50%",
									background:
										"linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
									border: "2px solid #0A0A0A",
									boxShadow: "0 0 12px rgba(239, 68, 68, 0.6)",
								}}
							/>
						</Box>
						<Box style={{ flex: 1, paddingTop: rem(4) }}>
							<Title
								order={1}
								size={rem(42)}
								fw={900}
								style={{
									background:
										"linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
									letterSpacing: "-0.03em",
									margin: 0,
									lineHeight: 1.1,
									textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
								}}
							>
								BloatBuster
							</Title>
							<Text size="sm" c="#9CA3AF" fw={500} mt={rem(4)}>
								Take back control of your Android
							</Text>
						</Box>
					</Group>

					<InstructionsAlert />

					<Paper
						shadow="sm"
						radius={rem(16)}
						p={rem(20)}
						style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
					>
						<Stack gap={rem(16)}>
							<Group gap="md" align="flex-start" mb="xs">
								<Box
									style={{
										width: rem(48),
										height: rem(48),
										borderRadius: rem(16),
										background:
											"linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}
								>
									<IconClipboard size={24} color="white" />
								</Box>
								<Box style={{ flex: 1 }}>
									<Text size="xl" fw={700} c="#FFFFFF" mb={rem(4)}>
										Paste Package List
									</Text>
									<Text size="sm" c="#9CA3AF" fw={500}>
										Paste the complete output from ADB command
									</Text>
								</Box>
							</Group>
							<Textarea
								size="md"
								placeholder={`package:android\npackage:com.android.systemui\npackage:com.google.android.gms\npackage:com.samsung.android.bixby.service\npackage:com.miui.analytics\n...`}
								value={packageInput}
								onChange={(e) => setPackageInput(e.target.value)}
								minRows={12}
								maxRows={12}
								autosize
								required
								styles={{
									input: {
										borderRadius: rem(12),
										border: "2px solid #2A2A2A",
										background: "#0A0A0A",
										color: "#FFFFFF",
										fontFamily: "monospace",
										fontSize: rem(13),
										"&:focus": { borderColor: "#6366F1" },
									},
								}}
							/>
							<Button
								size="md"
								leftSection={<IconSearch size={18} />}
								onClick={handleDetectBloatware}
								loading={isProcessing}
								radius={rem(12)}
								styles={{
									root: {
										background:
											"linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
										border: "none",
										height: rem(44),
										fontSize: rem(15),
										fontWeight: 600,
										"&:hover": {
											background:
												"linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
										},
									},
								}}
							>
								Detect Bloatware
							</Button>
						</Stack>
					</Paper>

					{error && (
						<Alert
							icon={<IconAlertCircle size={18} />}
							color="red"
							withCloseButton
							onClose={() => setError(null)}
							radius={rem(12)}
							styles={{
								root: {
									background: "#2D1515",
									border: "1px solid #7F1D1D",
									color: "#FCA5A5",
									padding: rem(12),
								},
							}}
						>
							{error}
						</Alert>
					)}

					{currentStep === 2 && detectedPackages.length > 0 && (
						<>
							<Paper
								ref={resultsRef}
								shadow="sm"
								radius={rem(16)}
								p={rem(20)}
								style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
							>
								<Text
									size="xs"
									fw={600}
									c="#9CA3AF"
									tt="uppercase"
									mb="md"
									style={{ letterSpacing: "0.05em" }}
								>
									Detection Summary
								</Text>
								<Group grow>
									{[
										{
											label: "Total",
											value: detectedPackages.length,
											bg: "#0A0A0A",
											border: "#2A2A2A",
											labelColor: "#9CA3AF",
											valueColor: "#FFFFFF",
										},
										{
											label: "Bloatware",
											value: bloatwareCount,
											bg: "#2D1515",
											border: "#7F1D1D",
											labelColor: "#FCA5A5",
											valueColor: "#EF4444",
										},
										{
											label: "Suspicious",
											value: suspiciousCount,
											bg: "#2D2510",
											border: "#92400E",
											labelColor: "#FCD34D",
											valueColor: "#F59E0B",
										},
										{
											label: "Safe",
											value: systemCount,
											bg: "#0F3A26",
											border: "#065F46",
											labelColor: "#6EE7B7",
											valueColor: "#10B981",
										},
										{
											label: "Selected",
											value: selectedCount,
											bg: "#14261A",
											border: "#166534",
											labelColor: "#86EFAC",
											valueColor: "#22C55E",
										},
									].map((stat) => (
										<Paper
											key={stat.label}
											p="md"
											radius={rem(12)}
											style={{
												background: stat.bg,
												border: `1px solid ${stat.border}`,
											}}
										>
											<Text
												size="xs"
												fw={600}
												c={stat.labelColor}
												tt="uppercase"
												mb="xs"
											>
												{stat.label}
											</Text>
											<Text size={rem(28)} fw={700} c={stat.valueColor}>
												{stat.value}
											</Text>
										</Paper>
									))}
								</Group>
							</Paper>

							<SafetyRatingGuide />
							<PackageList
								packages={detectedPackages}
								onPackagesChange={setDetectedPackages}
							/>
							{selectedCount > 0 && <CommandsDisplay commands={commands} />}
						</>
					)}

					<Paper
						p="lg"
						radius={rem(20)}
						style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
					>
						<Group justify="space-between" align="center" wrap="wrap">
							<Group gap="xs">
								<IconBrandGithub size={24} color="#9CA3AF" />
								<Text
									component="a"
									href="https://github.com/thongtech/bloatbuster"
									target="_blank"
									rel="noopener noreferrer"
									size="sm"
									c="#6366F1"
									styles={{
										root: {
											textDecoration: "none",
											cursor: "pointer",
											"&:hover": { textDecoration: "underline" },
										},
									}}
								>
									Contribute or Report Issues
								</Text>
							</Group>
							<Group gap="xs">
								<Text size="sm" c="#9CA3AF">
									Made with
								</Text>
								<Text size="lg" c="#EF4444" style={{ lineHeight: 1 }}>
									♥
								</Text>
								<Text size="sm" c="#9CA3AF">
									in
								</Text>
								<IconBrandAndroid size={24} color="#3DDC84" />
								<Text size="sm" c="#9CA3AF">
									Android
								</Text>
							</Group>
						</Group>
					</Paper>
				</Stack>
			</Container>
			{showScrollButton && (
				<Button
					onClick={scrollToBottom}
					style={{
						position: "fixed",
						bottom: rem(24),
						right: rem(24),
						width: rem(56),
						height: rem(56),
						borderRadius: "50%",
						padding: 0,
						zIndex: 1000,
						boxShadow:
							"0 4px 16px rgba(0, 0, 0, 0.4), 0 0 24px rgba(99, 102, 241, 0.3)",
					}}
					styles={{
						root: {
							background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
							border: "none",
							"&:hover": {
								background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
								transform: "scale(1.05)",
							},
							transition: "all 0.2s ease",
						},
					}}
				>
					<IconArrowDown size={24} color="white" />
				</Button>
			)}
		</Box>
	);
}
