import ThemeToggle from "./ThemeToggle";

const Header = () => {
	return (
		<div className="flex justify-between items-center w-full p-4 bg-red-500/10">
			<h1>Header</h1>
			<ThemeToggle />
		</div>
	)
};

export default Header;