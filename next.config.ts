import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "via.assets.so",
			},
			{
				protocol: "https",
				hostname: "s3-alpha-sig.figma.com",
			},
			{
				protocol: "https",
				hostname: "storage.const3llation.com",
			},
			{
				protocol: "https",
				hostname: "img.shgstatic.com",
			},
		],
	},
};

export default withPayload(nextConfig);
