import { Paper, Stack, Text, Box, Group, rem, Badge } from "@mantine/core";
import {
	IconShieldCheck,
	IconAlertTriangle,
	IconAlertCircle,
	IconBulb,
} from "@tabler/icons-react";

/**
 * Safety rating configuration data for package removal guidance.
 * Defines visual styling and descriptions for safe, caution, and risky package categories.
 */
const RATINGS = [
	{
		key: "safe",
		label: "SAFE",
		title: "Safe to Remove",
		icon: IconShieldCheck,
		bg: "#14261A",
		border: "#166534",
		gradient: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
		color: "#86EFAC",
		text: "Bloatware, pre-installed apps, optional services, and non-essential features. Can be safely removed without affecting core device functionality. Includes social media, shopping apps, games, and vendor-specific features.",
	},
	{
		key: "caution",
		label: "CAUTION",
		title: "Review Before Removing",
		icon: IconAlertTriangle,
		bg: "#2D2510",
		border: "#92400E",
		gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
		color: "#FCD34D",
		text: "System services and features that enhance device functionality but aren't critical. Removal may affect specific features, UI elements, or device capabilities. Review carefully—some features like emergency alerts or biometric authentication may be important to you.",
	},
	{
		key: "risky",
		label: "RISKY",
		title: "Risky to Remove — Advanced Users Only",
		icon: IconAlertCircle,
		bg: "#2D1515",
		border: "#7F1D1D",
		gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
		color: "#FCA5A5",
		text: "Critical system services and core functionality. Removal will break critical features or make device unstable/unusable. Includes phone services, system UI, network stack, Bluetooth, location services, and storage management. Never remove unless you understand the consequences.",
	},
];

/**
 * Displays comprehensive safety rating guide explaining package removal safety levels.
 * Provides visual indicators and detailed descriptions for safe, caution, and risky package categories.
 */
export function SafetyRatingGuide() {
	return (
		<Paper shadow="sm" radius={rem(20)} p={rem(24)} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
			<Stack gap="lg">
				<Group gap="sm">
					<IconShieldCheck size={24} color="#22C55E" />
					<Text size="lg" fw={700} c="#FFFFFF">Safety Rating Guide</Text>
				</Group>
				<Text size="sm" c="#9CA3AF" style={{ lineHeight: 1.6 }}>
					Safety ratings indicate how safe it is to <Text component="span" fw={700} c="#FFFFFF">remove</Text> a package. Review ratings carefully before removing packages.
				</Text>
				<Stack gap="md">
					{RATINGS.map((rating) => {
						const Icon = rating.icon;
						return (
							<Paper key={rating.key} p="md" radius={rem(12)} style={{ background: rating.bg, border: `1px solid ${rating.border}` }}>
								<Group gap="md" wrap="nowrap" align="flex-start">
									<Box style={{ width: rem(40), height: rem(40), borderRadius: rem(10), background: rating.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
										<Icon size={20} color="white" />
									</Box>
									<Box style={{ flex: 1 }}>
										<Group gap="xs" mb="xs">
											<Badge size="sm" radius={rem(8)} styles={{ root: { background: rating.bg, color: rating.color, fontWeight: 700, textTransform: "uppercase", fontSize: rem(10), border: `1px solid ${rating.border}` } }}>
												{rating.label}
											</Badge>
											<Text size="sm" fw={700} c={rating.color}>{rating.title}</Text>
										</Group>
										<Text size="xs" c="#9CA3AF" style={{ lineHeight: 1.6 }}>{rating.text}</Text>
									</Box>
								</Group>
							</Paper>
						);
					})}
				</Stack>
				<Paper p="lg" radius={rem(12)} style={{ background: "#1F1F1F", border: "1px solid #3A3A3A" }}>
					<Group gap="md" wrap="nowrap" align="flex-start">
						<Box style={{ width: rem(44), height: rem(44), borderRadius: rem(12), background: "linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(251, 191, 36, 0.2)" }}>
							<IconBulb size={22} color="#1F1F1F" stroke={2.5} />
						</Box>
						<Box style={{ flex: 1 }}>
							<Text size="md" fw={700} c="#FFFFFF" mb="xs">Pro Tip</Text>
							<Text size="sm" c="#D1D5DB" style={{ lineHeight: 1.7 }}>
								Start with packages marked as <Text component="span" fw={700} c="#86EFAC">SAFE</Text>. Only proceed to <Text component="span" fw={700} c="#FCD34D">CAUTION</Text> packages after researching their specific impact. Avoid <Text component="span" fw={700} c="#FCA5A5">RISKY</Text> packages unless you're an advanced user who understands the consequences.
							</Text>
						</Box>
					</Group>
				</Paper>
			</Stack>
		</Paper>
	);
}
