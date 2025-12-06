import { useMemo } from "react";
import {
	Alert,
	Button,
	Code,
	Group,
	Paper,
	Stack,
	Text,
	Box,
	rem,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
	IconAlertTriangle,
	IconCheck,
	IconCopy,
	IconTerminal,
	IconShieldCheck,
	IconBulb,
} from "@tabler/icons-react";

/**
 * Props for CommandsDisplay component.
 * @property commands - Array of ADB commands to display
 */
interface CommandsDisplayProps {
	commands: string[];
}

/**
 * Number of ADB commands generated per package.
 * Each selected package generates three commands: disable, clear, and uninstall.
 */
const COMMANDS_PER_PACKAGE = 3;

/**
 * Clipboard copy feedback timeout duration (milliseconds).
 */
const CLIPBOARD_TIMEOUT_MS = 2000;

/**
 * Displays ADB commands for selected packages with copy functionality and safety warnings.
 * @param commands - Array of ADB commands to display
 */
export function CommandsDisplay({ commands }: CommandsDisplayProps) {
	const clipboard = useClipboard({ timeout: CLIPBOARD_TIMEOUT_MS });
	const commandsText = useMemo(() => commands.join("\n"), [commands]);
	const packageCount = useMemo(
		() => Math.floor(commands.length / COMMANDS_PER_PACKAGE),
		[commands]
	);

	if (!commands.length) return null;

	return (
		<Paper
			shadow="sm"
			radius={rem(28)}
			p={rem(32)}
			style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
		>
			<Stack gap={rem(24)}>
				<Group justify="space-between" wrap="nowrap">
					<Group gap="md">
						<Box
							style={{
								width: rem(48),
								height: rem(48),
								borderRadius: rem(16),
								background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<IconTerminal size={24} color="white" />
						</Box>
						<Box>
							<Text size="xl" fw={700} c="#FFFFFF">
								ADB Commands Ready
							</Text>
							<Text size="sm" c="#9CA3AF" fw={500}>
								{packageCount} packages • {commands.length} commands
							</Text>
						</Box>
					</Group>
					<Button
						leftSection={
							clipboard.copied ? (
								<IconCheck size={18} />
							) : (
								<IconCopy size={18} />
							)
						}
						onClick={() => clipboard.copy(commandsText)}
						size="md"
						radius={rem(12)}
						styles={{
							root: {
								fontWeight: 700,
								background: clipboard.copied
									? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
									: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
								border: "none",
								color: "white",
							},
						}}
					>
						{clipboard.copied ? "Copied!" : "Copy All"}
					</Button>
				</Group>

				<Alert
					icon={<IconAlertTriangle size={20} />}
					color="red"
					radius={rem(16)}
					styles={{
						root: { background: "#2D1515", border: "1px solid #7F1D1D" },
						message: { color: "#FCA5A5" },
					}}
				>
					<Stack gap="sm">
						<Text size="sm" fw={700}>
							Critical Safety Warning
						</Text>
						<Text size="sm" style={{ lineHeight: 1.6 }}>
							Removing system packages can affect device stability. Before
							proceeding:
						</Text>
						<Box
							component="ul"
							style={{ margin: 0, paddingLeft: rem(20), lineHeight: 1.8 }}
						>
							{[
								"Create a complete backup of your device",
								"Research packages you're unsure about",
								"Start with a few packages to test",
								"Packages can be reinstalled if needed",
							].map((item, i) => (
								<li key={i}>
									<Text size="sm" fw={500}>
										{item}
									</Text>
								</li>
							))}
						</Box>
					</Stack>
				</Alert>

				<Box>
					<Text
						size="sm"
						fw={600}
						c="#9CA3AF"
						tt="uppercase"
						mb="md"
						style={{ letterSpacing: "0.05em" }}
					>
						Execute via ADB Shell
					</Text>
					<Code
						block
						style={{
							maxHeight: "400px",
							overflow: "auto" as const,
							background: "#0A0A0A",
							color: "#22C55E",
							padding: rem(20),
							borderRadius: rem(16),
							fontSize: rem(13),
							lineHeight: 1.8,
							fontFamily: "ui-monospace, monospace",
							border: "1px solid #2A2A2A",
						}}
					>
						{commandsText}
					</Code>
				</Box>
				<Paper
					p="lg"
					radius={rem(16)}
					style={{ background: "#1E1B3C", border: "1px solid #3730A3" }}
				>
					<Group gap="md" align="flex-start">
						<IconShieldCheck size={24} color="#818CF8" />
						<Box style={{ flex: 1 }}>
							<Text size="sm" fw={700} c="#FFFFFF" mb={rem(8)}>
								How to Execute
							</Text>
							<Stack gap={rem(6)}>
								<Text size="sm" c="#D1D5DB">
									1. Connect your device via USB
								</Text>
								<Text size="sm" c="#D1D5DB">
									2. Open terminal and run:{" "}
									<Code
										style={{
											fontSize: rem(12),
											background: "#0A0A0A",
											color: "#22C55E",
											padding: "2px 6px",
											borderRadius: rem(4),
											border: "1px solid #2A2A2A",
										}}
									>
										adb shell
									</Code>
								</Text>
								<Text size="sm" c="#D1D5DB">
									3. Paste all commands at once
								</Text>
								<Text size="sm" c="#D1D5DB">
									4. Wait for completion (1-2 minutes)
								</Text>
								<Text size="sm" c="#D1D5DB">
									5. Exit shell:{" "}
									<Code
										style={{
											fontSize: rem(12),
											background: "#0A0A0A",
											color: "#22C55E",
											padding: "2px 6px",
											borderRadius: rem(4),
											border: "1px solid #2A2A2A",
										}}
									>
										exit
									</Code>
								</Text>
								<Text size="sm" c="#D1D5DB">
									6. Disconnect USB and reboot your device from the phone
								</Text>
							</Stack>
						</Box>
					</Group>
				</Paper>
				<Paper
					p="lg"
					radius={rem(12)}
					style={{ background: "#1F1F1F", border: "1px solid #3A3A3A" }}
				>
					<Group gap="md" wrap="nowrap" align="flex-start">
						<Box
							style={{
								width: rem(44),
								height: rem(44),
								borderRadius: rem(12),
								background: "linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								boxShadow: "0 4px 12px rgba(251, 191, 36, 0.2)",
							}}
						>
							<IconBulb size={22} color="#1F1F1F" stroke={2.5} />
						</Box>
						<Box style={{ flex: 1 }}>
							<Text size="md" fw={700} c="#FFFFFF" mb="xs">
								Quick Recovery Tip
							</Text>
							<Text size="sm" c="#D1D5DB" style={{ lineHeight: 1.7 }}>
								Need to restore a package? Use{" "}
								<Code
									style={{
										fontSize: rem(12),
										background: "#0A0A0A",
										color: "#22C55E",
										padding: "3px 8px",
										borderRadius: rem(4),
										border: "1px solid #2A2A2A",
										fontWeight: 600,
									}}
								>
									cmd package install-existing [package-name]
								</Code>
							</Text>
						</Box>
					</Group>
				</Paper>
			</Stack>
		</Paper>
	);
}
