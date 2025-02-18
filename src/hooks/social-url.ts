interface SocialUrlProps {
	username: string;
	platform: 
		"github"
}

const socialUrl = ({ username, platform } : SocialUrlProps) => {
	let url = "https://";
	switch (platform) {
		case "github":
			url += `github.com/${username}`;
		default:
			break;
	}
	return url;
}

export default socialUrl;