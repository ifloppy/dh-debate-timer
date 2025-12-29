<script lang="ts">
	import "./layout.css";
	import "./common.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	let { children } = $props();

	// Import onDestroy for cleanup
	import { onDestroy } from "svelte";

	// Screen Wake Lock API to prevent screen timeout on mobile
	let wakeLock: WakeLockSentinel | null = null;

	const requestWakeLock = async () => {
		if ("wakeLock" in navigator) {
			try {
				wakeLock = await navigator.wakeLock.request("screen");
				console.log("Wake Lock is active");

				// Update the wake lock in case the user switches tabs or the screen turns off
				const handleVisibilityChange = async () => {
					if (
						wakeLock !== null &&
						document.visibilityState === "visible"
					) {
						wakeLock = await navigator.wakeLock.request("screen");
					}
				};

				document.addEventListener(
					"visibilitychange",
					handleVisibilityChange,
				);

				// Release wake lock when component is destroyed
				onDestroy(async () => {
					if (wakeLock) {
						try {
							await wakeLock.release();
							wakeLock = null;
							console.log("Wake Lock released");
						} catch (err) {
							console.error("Error releasing wake lock:", err);
						}
					}
					document.removeEventListener(
						"visibilitychange",
						handleVisibilityChange,
					);
				});
			} catch (err) {
				console.error("Failed to acquire wake lock:", err);
			}
		} else {
			console.log("Screen Wake Lock API not supported");
		}
	};

	// Request wake lock when component mounts
	requestWakeLock();
</script>

<ModeWatcher />
<Toaster />
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
