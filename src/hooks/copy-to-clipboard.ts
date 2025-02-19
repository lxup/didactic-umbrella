import { toast } from 'react-hot-toast';

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
	toast.success('Copied');
	return text;
};

export default copyToClipboard;