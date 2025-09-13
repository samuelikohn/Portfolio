import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";

interface Props {
	project: Project;
}

export function ProjectCard({ project }: Props) {
	const { name, href, description, image, tags, links } = project;

	return (
		<Card className="flex flex-col">
			<CardHeader className="relative">
				<Link href={href} className="absolute inset-0" />
				{image && (
					<Image
						src={image}
						alt={name}
						width={500}
						height={300}
						className="h-48 w-full object-cover object-center"
					/>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-2 relative">
				<Link href={href} className="absolute inset-0" />
				<CardTitle>{name}</CardTitle>
				<Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
					{description}
				</Markdown>
			</CardContent>
			<CardFooter className="flex h-full flex-col items-start justify-between gap-4">
				{tags && tags.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{tags.toSorted().map((tag) => (
							<Badge
								key={tag}
								className="px-1 py-0 text-[12px]"
								variant="secondary"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
				{links && links.length > 0 && (
					<div className="flex flex-row flex-wrap items-start gap-1">
						{links.toSorted().map((link, idx) => (
							<Link href={link?.href} key={idx} target="_blank">
								<Badge key={idx} className="flex gap-2 px-2 py-1 text-[12px]">
									<Icon name={link.icon} className="size-4" />
									{link.name}
								</Badge>
							</Link>
						))}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}