"use client";

import RichText from "@/components/rich-text";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import type {
	SerializedEditorState,
	SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";
import { useState } from "react";

type Props = {
	description: SerializedEditorState<SerializedLexicalNode>;
};

export default function CategoryDescription({ description }: Props) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleCollapse = () => {
		setIsCollapsed((prev) => !prev);
	};

	return (
		<div className="flex flex-col gap-6 items-start">
			<RichText
				data={description}
				className={cn(
					"rich-text-component max-w-4xl text-text-200",
					isCollapsed ? "max-h-[475px] overflow-auto" : "line-clamp-3",
				)}
			/>
			<Button
				className="flex flex-row gap-2 cursor-pointer !p-0"
				variant="link"
				onClick={toggleCollapse}
			>
				<Body variants="16-regular" className="text-primary-100">
					{isCollapsed ? "Show less" : "Show more"}
				</Body>
				<Icon
					name="ArrowRight"
					className="h-4 w-4 text-primary-100 self-center"
				/>
			</Button>
		</div>
	);
}
