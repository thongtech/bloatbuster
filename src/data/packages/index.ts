/**
 * Combined package database consolidating all categorised packages for bloatware detection.
 */

import type { DeviceData } from "../../types";

import { androidSystemPackages } from "./recognised/android";
import { googleSystemPackages } from "./recognised/google";
import { samsungSystemPackages } from "./recognised/samsung";
import { xiaomiSystemPackages } from "./recognised/xiaomi";
import { qualcommSystemPackages } from "./recognised/qualcomm";
import { mediatekSystemPackages } from "./recognised/mediatek";
import { vivoSystemPackages } from "./recognised/vivo";
import { honorSystemPackages } from "./recognised/honor";
import { miscSystemPackages } from "./recognised/misc";
import { userApps } from "./recognised/user";

import { samsungBloatwarePackages } from "./bloatware/samsung";
import { xiaomiBloatwarePackages } from "./bloatware/xiaomi";
import { googleBloatwarePackages } from "./bloatware/google";
import { qualcommBloatwarePackages } from "./bloatware/qualcomm";
import { mediatekBloatwarePackages } from "./bloatware/mediatek";
import { vivoBloatwarePackages } from "./bloatware/vivo";
import { honorBloatwarePackages } from "./bloatware/honor";
import { microsoftBloatwarePackages } from "./bloatware/microsoft";
import { amazonBloatwarePackages } from "./bloatware/amazon";
import { carrierBloatwarePackages } from "./bloatware/carrier";
import { gamesBloatwarePackages } from "./bloatware/games";
import { factoryTestingBloatwarePackages } from "./bloatware/factory-testing";
import { androidBloatwarePackages } from "./bloatware/android";
import { miscBloatwarePackages } from "./bloatware/misc";

/**
 * Unified package database for bloatware detection.
 * @property recognisedPackages - Legitimate system packages and apps
 * @property bloatwarePackages - Pre-installed bloatware apps with optional safety ratings
 */
export const packageDatabase: DeviceData = {
	recognisedPackages: [
		...androidSystemPackages,
		...googleSystemPackages,
		...samsungSystemPackages,
		...xiaomiSystemPackages,
		...qualcommSystemPackages,
		...mediatekSystemPackages,
		...vivoSystemPackages,
		...honorSystemPackages,
		...miscSystemPackages,
		...userApps,
	],

	bloatwarePackages: [
		...samsungBloatwarePackages,
		...xiaomiBloatwarePackages,
		...googleBloatwarePackages,
		...qualcommBloatwarePackages,
		...mediatekBloatwarePackages,
		...vivoBloatwarePackages,
		...honorBloatwarePackages,
		...microsoftBloatwarePackages,
		...amazonBloatwarePackages,
		...carrierBloatwarePackages,
		...gamesBloatwarePackages,
		...factoryTestingBloatwarePackages,
		...androidBloatwarePackages,
		...miscBloatwarePackages,
	],
};
