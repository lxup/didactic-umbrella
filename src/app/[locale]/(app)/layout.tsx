import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
	return (
	<div className="min-h-screen flex flex-col">
		<Header />
		<main className="flex-1 flex flex-col">
		{children}
		</main>
		<Footer />
	</div>
	);
}
