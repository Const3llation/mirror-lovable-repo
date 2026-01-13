import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as RichTextWithoutBlocks } from "@payloadcms/richtext-lexical/react";

type Props = {
	data: SerializedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
	const { className, ...rest } = props;

	return <RichTextWithoutBlocks className={className} {...rest} />;
}
