import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Arial from "next/font/local";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Sam Kohn",
	description: "My personal site to showcase my developer work.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					inter.variable,
				)}
			>
				<Providers>
					<Header />
					<div className="mx-auto flex max-w-4xl flex-col px-8">
						<main className="grow">{children}</main>
					</div>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}