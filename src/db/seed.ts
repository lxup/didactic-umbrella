import * as seeds from "./seeds";
import db from "./";

const main = async () => {
	console.log("Seeding started");
	await seeds.answer(db);
	await seeds.quiz(db);
};

main().then(() => {
	console.log("Seeding completed");
	process.exit(0);
}).catch((error) => {
	console.error("Seeding failed");
	console.error(error);
	process.exit(1);
});
