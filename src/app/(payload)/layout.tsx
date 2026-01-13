/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
"use server";

import config from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import type React from "react";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

// @ts-ignore
async function serverAction(args) {
	"use server";
	return handleServerFunctions({
		...args,
		config,
		importMap,
	});
}

const serverFunction: ServerFunctionClient = serverAction;

type Args = {
	children: React.ReactNode;
};

const Layout = ({ children }: Args) => (
	<RootLayout
		config={config}
		importMap={importMap}
		serverFunction={serverFunction}
	>
		{children}
	</RootLayout>
);

export default Layout;
