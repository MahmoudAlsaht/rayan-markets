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
	const [showNavigation, setShowNavigation] = useState(false);
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
		<div
			className='container mb-6 mt-4 sm:mt-8'
			onMouseOver={() =>
				images.length >= 2 && setShowNavigation(true)
			}
			onMouseLeave={() =>
				images.length >= 2 && setShowNavigation(false)
			}
		>
			<div className='relative'>
				{images.map((image, index) => (
					<div
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
						key={image.id}
						className={`${
							index !== targetedIndex && 'hidden'
						} relative w-full h-32 sm:h-52 md:h-80 transition-opacity ease-in duration-700 opacity-100`}
					>
						<Image
							src={image.path || ''}
							fill
							alt={`banner's image`}
							className='rounded-2xl cursor-pointer object-cover'
							priority
						/>
					</div>
				))}

				{true && (
					<>
						<CarouselNavButton
							next
							onClick={nextImage}
						/>
						<CarouselNavButton
							prev
							onClick={prevImage}
						/>
					</>
				)}
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
		</div>
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
			} w-9 h-8 md:w-14 md:h-10 absolute top-1/2 p-1 md:p-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white hover:text-rayanPrimary-dark cursor-pointer rounded-xl`}
			variant='ghost'
			onClick={onClick}
		>
			{prev && <ArrowLeft className='size-5 md:size-8' />}
			{next && <ArrowRight className='size-5 md:size-8' />}
		</Button>
	);
}
