import * as React from "react"

export type Device = "mobile" | "tablet" | "desktop"


export function useDevice() {
	const getDevice: () => Device = () => {
		const userAgent = navigator.userAgent.toLowerCase();
		const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
		const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);
		
		if (isMobile) {
		  return "mobile";
		} else if (isTablet) {
		  return "tablet";
		} else {
		  return "desktop";
		}
	}
	
	const [device, setDevice] = React.useState(getDevice());

	  React.useEffect(() => {
		const handleResize = () => {
		  setDevice(getDevice());
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	  }, []);

	  return device;
}