import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Posts from "@/components/Posts";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { getPosts } from "@/lib/posts";
import {
	ArrowDown,
	ArrowDownRight,
	ArrowRightIcon,
	FileDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");
const LIMIT = 2; // max cards per homepage section

export default async function Home() {
	const posts = await getPosts(blogDirectory, LIMIT);

	return (
		<article className="mt-8 flex flex-col gap-16 pb-16">
			<section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
				<Image
					className="rounded-lg"
					src="/sam.jpg"
					alt="Photo of Sam"
					width={175}
					height={175}
					priority
				/>
				<div className="flex max-w-[320px] flex-col sm:max-w-full">
					<h1 className="title text-balance text-4xl sm:text-5xl">
						Hi I&apos;m Sam!
					</h1>

					<p className="mt-2 whitespace-nowrap text-sm font-medium sm:text-base">
						I&apos;m a software developer based in Chicago, IL
					</p>

					<p className="mt-4 max-w-sm text-balance text-sm sm:text-base">
						I specialize in AI integration and application development.
					</p>

					<div className="mt-6 flex items-center gap-1">
						<p className="text-balance text-sm font-semibold sm:text-base">
							Have a question? Ask I-AM!
						</p>
						<ArrowDownRight className="hidden size-5 animate-bounce sm:block" />
						<ArrowDown className="block size-5 animate-bounce sm:hidden" />
					</div>

					<section className="mt-6 flex flex-wrap items-center gap-4">
						<Link href="/resume_web.pdf" target="_blank">
							<Button variant="outline">
								<span className="font-semibold">Resume</span>
								<FileDown className="ml-2 size-5" />
							</Button>
						</Link>
						<Socials />
					</section>
				</div>
			</section>

			<Experience />

			<section className="flex flex-col gap-8">
				<div className="flex justify-between">
					<h2 className="title text-2xl sm:text-3xl">Featured projects</h2>
					<LinkWithIcon
						href="/projects"
						position="right"
						icon={<ArrowRightIcon className="size-5" />}
						text="View more"
					/>
				</div>
				<Projects limit={LIMIT} />
			</section>

			<section className="flex flex-col gap-8">
				<div className="flex justify-between">
					<h2 className="title text-3xl">Recent posts</h2>
					<LinkWithIcon
						href="/blog"
						position="right"
						icon={<ArrowRightIcon className="size-5" />}
						text="View more"
					/>
				</div>
				<Posts posts={posts} />
			</section>
		</article>
	);
}
