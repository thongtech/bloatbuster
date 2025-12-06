import { useState } from "react";
import {
	Code,
	List,
	Paper,
	Stack,
	Text,
	Box,
	Group,
	Collapse,
	Button,
	rem,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
	IconRocket,
	IconUsb,
	IconWifi,
	IconChevronDown,
	IconChevronUp,
	IconTerminal,
	IconCopy,
	IconCheck,
} from "@tabler/icons-react";

/**
 * Base styling configuration for code blocks in instructions.
 * Provides consistent terminal-style appearance for ADB commands.
 */
const CODE_BASE_STYLE = {
	background: "#0A0A0A",
	color: "#22C55E",
	borderRadius: rem(8),
	fontWeight: 600,
	fontSize: rem(13),
	border: "1px solid #2A2A2A",
};

/**
 * Inline code styling variant for embedded command references.
 * Smaller padding and font size for inline usage.
 */
const CODE_INLINE_STYLE = {
	...CODE_BASE_STYLE,
	fontSize: rem(11),
	padding: `${rem(2)} ${rem(4)}`,
	background: "#1A1A1A",
};

/**
 * Clipboard copy feedback timeout duration (milliseconds).
 */
const CLIPBOARD_TIMEOUT_MS = 2000;

/**
 * Displays comprehensive instructions for connecting Android devices via USB or wireless ADB.
 * Provides step-by-step guidance for enabling developer options, pairing devices, and obtaining package lists.
 * Supports phones, watches, and TVs with device-specific instructions.
 */
export function InstructionsAlert() {
	const [usbOpened, setUsbOpened] = useState(false);
	const [wifiOpened, setWifiOpened] = useState(false);
	const clipboard = useClipboard({ timeout: CLIPBOARD_TIMEOUT_MS });
	const commandText = "adb shell pm list packages";

	return (
		<Paper
			shadow="sm"
			radius={rem(16)}
			p={rem(20)}
			style={{ background: "#1E1B3C", border: "1px solid #3730A3" }}
		>
			<Stack gap="md">
				<Group gap="md" align="flex-start">
					<Box
						style={{
							width: rem(56),
							height: rem(56),
							borderRadius: rem(16),
							background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<IconRocket size={28} stroke={2.5} color="#FFFFFF" />
					</Box>
					<Box style={{ flex: 1 }}>
						<Text
							size="xl"
							fw={800}
							style={{
								background: "linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
								letterSpacing: "-0.02em",
								lineHeight: 1.2,
							}}
						>
							Quick Start Guide
						</Text>
						<Text size="sm" c="#9CA3AF" fw={500} mt={rem(4)}>
							Works for all Android devices: Phones, Watches, and TVs
						</Text>
					</Box>
				</Group>
				<Box>
					<Group justify="space-between" mb="xs">
						<Group gap="xs">
							<IconUsb size={20} stroke={2} color="#818CF8" />
							<Text size="md" fw={700} c="#FFFFFF">
								Method 1: USB Connection (Phones Only)
							</Text>
						</Group>
						<Button
							variant="subtle"
							size="xs"
							onClick={() => setUsbOpened(!usbOpened)}
							rightSection={
								usbOpened ? (
									<IconChevronUp size={14} />
								) : (
									<IconChevronDown size={14} />
								)
							}
							style={{ color: "#818CF8" }}
						>
							{usbOpened ? "Hide" : "Show"}
						</Button>
					</Group>

					<Collapse in={usbOpened}>
						<List spacing="sm" size="sm" style={{ color: "#D1D5DB" }} mt="xs">
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									Enable Developer Options
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Settings → About Device → Tap{" "}
									<Text component="span" fw={600} c="#FFFFFF">
										Software Version
									</Text>{" "}
									(or Build Number) 7 times
								</Text>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									Enable USB Debugging
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Settings → Developer Options → Toggle{" "}
									<Text component="span" fw={600} c="#FFFFFF">
										USB Debugging
									</Text>
								</Text>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									Connect and Authorise
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Connect USB cable and accept debugging authorisation on
									device
								</Text>
							</List.Item>
						</List>
					</Collapse>
				</Box>

				<Box>
					<Group justify="space-between" mb="xs">
						<Group gap="xs">
							<IconWifi size={20} stroke={2} color="#22C55E" />
							<Text size="md" fw={700} c="#FFFFFF">
								Method 2: Wireless Connection (All Devices)
							</Text>
						</Group>
						<Button
							variant="subtle"
							size="xs"
							onClick={() => setWifiOpened(!wifiOpened)}
							rightSection={
								wifiOpened ? (
									<IconChevronUp size={14} />
								) : (
									<IconChevronDown size={14} />
								)
							}
							style={{ color: "#22C55E" }}
						>
							{wifiOpened ? "Hide" : "Show"}
						</Button>
					</Group>

					<Collapse in={wifiOpened}>
						<Text size="xs" fw={600} c="#F59E0B" mb="sm" mt="xs">
							📱 Requires Android 11+ and ADB 1.0.41 (platform-tools v30.0.0+)
						</Text>

						<List spacing="sm" size="sm" style={{ color: "#D1D5DB" }}>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									1. Enable Developer Options
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Settings → About Device → Tap{" "}
									<Text component="span" fw={600} c="#FFFFFF">
										Software Version
									</Text>{" "}
									(or Build Number) 7 times (5 times for some watches)
								</Text>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									2. Connect to Wi-Fi
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Ensure device and computer are on the{" "}
									<Text component="span" fw={600} c="#FFFFFF">
										same Wi-Fi network
									</Text>
								</Text>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									3. Enable Wireless Debugging
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Settings → Developer Options → Enable{" "}
									<Text component="span" fw={600} c="#FFFFFF">
										Wireless Debugging
									</Text>
								</Text>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									4. Get Pairing Code
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Tap{" "}
									<Text component="span" fw={600} c="#FFFFFF">
										Pair device with pairing code
									</Text>{" "}
									and note the 6-digit code, IP, and port
								</Text>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									5. Pair Device
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— On your computer, run:
								</Text>
								<Box mt="xs">
									<Code
										style={{
											...CODE_BASE_STYLE,
											padding: `${rem(6)} ${rem(10)}`,
											display: "block",
										}}
									>
										adb pair IP:PORT 123456
									</Code>
									<Text size="xs" c="#9CA3AF" mt="xs">
										Replace with your values from device
									</Text>
								</Box>
							</List.Item>
							<List.Item>
								<Text component="span" fw={600} c="#FFFFFF">
									6. Connect After Pairing
								</Text>
								<Text component="span" c="#9CA3AF">
									{" "}
									— Once paired successfully:
								</Text>
								<Box mt="xs">
									<Code
										style={{
											...CODE_BASE_STYLE,
											padding: `${rem(6)} ${rem(10)}`,
											display: "block",
										}}
									>
										adb connect IP:PORT
									</Code>
								</Box>
							</List.Item>
						</List>
						<Box
							p="sm"
							mt="sm"
							style={{
								background: "#0A0A0A",
								border: "1px solid #2A2A2A",
								borderRadius: rem(8),
							}}
						>
							<Text size="xs" c="#9CA3AF" fw={500}>
								💡{" "}
								<Text component="span" fw={600} c="#FFFFFF">
									Android 10 and below:
								</Text>{" "}
								Use USB first, then{" "}
								<Code style={CODE_INLINE_STYLE}>adb tcpip 5555</Code> and{" "}
								<Code style={CODE_INLINE_STYLE}>adb connect IP:5555</Code>
							</Text>
						</Box>
					</Collapse>
				</Box>

				<Paper
					p="md"
					radius={rem(12)}
					style={{
						background: "linear-gradient(135deg, #1E3A28 0%, #1E2A3C 100%)",
						border: "2px solid #22C55E",
					}}
				>
					<Group gap="xs" mb="sm">
						<IconTerminal size={24} stroke={2} color="#22C55E" />
						<Text size="md" fw={700} c="#FFFFFF">
							Get Package List
						</Text>
					</Group>
					<Text size="sm" c="#9CA3AF" mb="sm">
						After connecting (USB or wireless), run this command:
					</Text>
					<Group gap="xs" align="stretch">
						<Code
							style={{
								...CODE_BASE_STYLE,
								padding: `${rem(10)} ${rem(14)}`,
								fontSize: rem(15),
								border: "1px solid #22C55E",
								flex: 1,
								display: "flex",
								alignItems: "center",
							}}
						>
							{commandText}
						</Code>
						<Button
							onClick={() => clipboard.copy(commandText)}
							size="md"
							radius={rem(8)}
							leftSection={
								clipboard.copied ? (
									<IconCheck size={18} />
								) : (
									<IconCopy size={18} />
								)
							}
							styles={{
								root: {
									background: clipboard.copied
										? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
										: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
									border: "1px solid #22C55E",
									fontWeight: 600,
									"&:hover": {
										background: clipboard.copied
											? "linear-gradient(135deg, #16A34A 0%, #15803D 100%)"
											: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
									},
								},
							}}
						>
							{clipboard.copied ? "Copied!" : "Copy"}
						</Button>
					</Group>
					<Text size="sm" c="#86EFAC" fw={600} mt="sm">
						Copy ALL output and paste into the field below
					</Text>
				</Paper>
			</Stack>
		</Paper>
	);
}
