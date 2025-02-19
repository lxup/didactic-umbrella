'use client';

import { getResultById } from "@/actions/quiz/queries";
import { Button } from "@/components/ui/button";
import Icons from "@/constants/icons";
import copyToClipboard from "@/hooks/copy-to-clipboard";
import { cn } from "@/lib/utils";
import { forwardRef, useMemo } from "react";
import download from 'downloadjs';
import toast from "react-hot-toast";
import { toCanvas } from 'html-to-image';
import { useTranslations } from "next-intl";

const LOGO_SIZE = 0.3;
const PADDING = 20;
const SPACE_BETWEEN = 10;

interface ShareResultsProps
	extends React.ComponentProps<'div'> {
		result: NonNullable<Awaited<ReturnType<typeof getResultById>>>;
	}

const ShareResults = forwardRef<
	HTMLDivElement,
	ShareResultsProps
>(({ result, className, ...props }, ref) => {
	const t = useTranslations('common');
	const shareOptions = useMemo(() => ([
		{
			icon: Icons.link,
			name: t('copy_link'),
			className: 'bg-blue-500 hover:bg-blue-500/80',
			onClick: () => copyToClipboard(`${location.origin}/quiz/${result.quiz.slug}/results/${result.id}`),
		},
		{
			icon: Icons.download,
			name: t('download_image'),
			className: 'bg-green-500 hover:bg-green-500/80',
			onClick: async () => await captureImage(),
		}
	]), []);

	const captureImage = async () => {
		try {
			const element = document.getElementById(`quiz-results-${result.id}`);
			if (!element) throw new Error('Failed to find element');
		
			const canvas = document.createElement('canvas');
			canvas.width = 1080;
			canvas.height = 1920;
			// canvas.width = window.innerWidth;
			// canvas.height = window.innerHeight >= 1080 ? 1080 : window.innerHeight;
		
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Failed to get canvas context');
			
			// Add a black background
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		
			const logo = new Image();
			logo.src = '/test.png';
			logo.onerror = () => {
				throw new Error('Failed to load logo');
			};
	  
		  logo.onload = async () => {
			// Calculer la taille du logo proportionnellement à la largeur du canvas
			const logoWidth = canvas.width * LOGO_SIZE; // 30% de la largeur du canvas
			const logoHeight = (logo.height / logo.width) * logoWidth; // Maintenir le ratio de l'image
			// get the position to center the logo
			const logoX = (canvas.width - logoWidth) / 2;
			const logoY = 10; // space of 10px from the top
			ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
	  
			const elementYPosition = logoY + logoHeight + SPACE_BETWEEN; // space of 10px from the logo
			const availableHeight = canvas.height - elementYPosition;
			const { width: elementWidth, height: elementHeight } = element.getBoundingClientRect();
			const totalWidth = canvas.width - PADDING * 2; // Largeur totale après padding
			let scaleFactor = Math.min(totalWidth / elementWidth, availableHeight / elementHeight);

			// Redimensionner l'élément en fonction de l'espace disponible
			if (elementWidth * scaleFactor > totalWidth) {
				scaleFactor = totalWidth / elementWidth;
			}

			// Calculer la position horizontale pour centrer l'élément avec padding
			const elementXPosition = PADDING; // Positionner à partir du padding à gauche

			const data = await toCanvas(element);
			
			ctx.drawImage(
				data,
				elementXPosition, // Position X avec padding
				elementYPosition, // Position Y sous le logo
				elementWidth * scaleFactor, // Redimensionner la largeur
				elementHeight * scaleFactor // Redimensionner la hauteur
			);

			const dataUrl = canvas.toDataURL('image/png');
			download(dataUrl, `quiz-results-${result.id}.png`);
		  };
		} catch {
		  toast.error('Failed to download image');
		}
	};

	return (
		<div
		ref={ref}
		className={cn('space-y-2', className)}
		{...props}
		>
			<h2 className="text-center text-lg font-semibold">{t('share_your_results')}</h2>
			<div className="flex justify-center items-center gap-2">
				{shareOptions.map((option, i) => (
					<Button
					key={i}
					size="sm"
					className={cn(' h-8 group overflow-hidden gap-0', option.className)}
					onClick={option.onClick}
					>
						<option.icon className='h-4 w-4 mr-0 group-hover:mr-2 transition-all duration-300' />
						<span className='group-hover:max-w-[100px] max-w-0 group-hover:opacity-100 opacity-0 transition-all duration-500'>
						{option.name}
						</span>
					</Button>
				))}
			</div>
		</div>
	)
});
ShareResults.displayName = 'ShareResults';

export default ShareResults;