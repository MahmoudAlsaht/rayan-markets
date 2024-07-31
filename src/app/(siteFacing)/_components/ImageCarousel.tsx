'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Dot } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ImageCarouselProps = {
	images: {
		id: string;
		path: string;
		link: string;
	}[];
};

export default function ImageCarousel({
	images,
}: ImageCarouselProps) {
	const [targetedIndex, setTargetedIndex] = useState(0);
	const [touchStart, setTouchStart] = useState<number | null>(
		null,
	);
	const [touchEnd, setTouchEnd] = useState(null);
	const minSwipeDistance = 50;

	const onTouchStart = (e) => {
		setTouchEnd(null); // Prevent firing swipe with usual touch events
		setTouchStart(e.targetTouches[0].clientX);
	};
	const onTouchMove = (e) =>
		setTouchEnd(e.targetTouches[0].clientX);

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe || isRightSwipe) {
			if (isRightSwipe) prevImage();

			if (isLeftSwipe) nextImage();
		}
	};

	const prevImage = () => {
		if (targetedIndex + 1 === images.length) {
			setTargetedIndex(0);
			return;
		}
		setTargetedIndex((prevIndex) => prevIndex + 1);
	};

	const nextImage = () => {
		if (targetedIndex === 0) {
			setTargetedIndex(images.length - 1);
			return;
		}
		setTargetedIndex((prevIndex) => prevIndex - 1);
	};

	const goToImage = (index: number) => {
		setTargetedIndex(index);
	};

	useEffect(() => {
		const intervalId = setInterval(async () => {
			setTargetedIndex((prevIndex) =>
				prevIndex === 0
					? images.length - 1
					: prevIndex - 1,
			);
		}, 4000);

		return () => clearInterval(intervalId);
	}, [images.length]);

	return (
		<>
			<div className='relative'>
				{images.map((image, index) => (
					<div
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
						key={image.id}
						className={`${
							index !== targetedIndex && 'hidden'
						} relative w-full max-w-[1481.6px] mx-auto h-44 sm:h-56 md:h-72 transition-opacity ease-in duration-700 opacity-100`}
					>
						<Image
							src={image.path || ''}
							fill
							alt={`banner's image`}
							className='mx-auto cursor-pointer object-cover'
							priority
						/>
					</div>
				))}

				<CarouselNavButton next onClick={nextImage} />
				<CarouselNavButton prev onClick={prevImage} />
			</div>
			<br />
			<div className='flex justify-center items-center'>
				{images.map((image, index) => (
					<div
						key={image.id}
						onClick={() => goToImage(index)}
					>
						<Dot
							className={`w-10 h-10 rounded-full cursor-pointer ${
								index !== targetedIndex &&
								'text-black'
							}`}
						/>
					</div>
				))}
			</div>
		</>
	);
}

function CarouselNavButton({
	next = false,
	prev = false,
	onClick,
}: {
	next?: boolean;
	prev?: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			className={`${prev && 'left-0'} ${
				next && 'right-0'
			} absolute top-1/2 p-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white hover:text-rayanPrimary-dark cursor-pointer rounded-xl`}
			variant='ghost'
			onClick={onClick}
		>
			{prev && <ArrowLeft />}
			{next && <ArrowRight />}
		</Button>
	);
}
