'use client';
import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { useFormState } from 'react-dom';
import { searchProducts, TProduct } from '../_actions/product';
import { ProductCard } from './ProductCard';
import SubmitButton from '@/components/SubmitButton';
import { useEffect, useState } from 'react';

export default function SearchProducts({
	allProducts,
}: {
	allProducts?: TProduct[];
}) {
	const formRef = React.useRef<HTMLFormElement | null>(null);
	const [value, setValue] = useState<null | string>();
	const [{ noProducts, products }, searchAction] =
		useFormState(searchProducts, {
			noProducts: true,
			products: [],
		});

	useEffect(() => {
		if (formRef.current) formRef.current.reset();
	}, []);

	return (
		<Drawer>
			<DrawerTrigger>
				<Search />
			</DrawerTrigger>
			<DrawerContent dir='ltr' className='h-screen'>
				<div className='overflow-auto md:p-4 rounded-t-[10px]'>
					<DrawerHeader>
						<DrawerTitle>
							<nav>
								<form
									action={searchAction}
									ref={formRef}
								>
									<div className='flex md:flex-wrap items-center justify-between md:mx-auto md:p-4'>
										<div className='flex'>
											<div className='relative'>
												<div className='absolute inset-y-0 -start-3 flex items-center ps-3'>
													<SubmitButton
														body={
															<Search className='text-white' />
														}
														size='sm'
														className='bg-inherit'
														handleClick={() => {
															formRef.current?.requestSubmit();
															setValue(
																null,
															);
														}}
													/>
												</div>
												<input
													type='text'
													id='search-navbar'
													name='query'
													className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
													placeholder='...منتج،قسم،علامة تجارية'
													onChange={(
														e,
													) => {
														if (
															e
																.target
																.value
														) {
															setValue(
																e
																	.target
																	.value,
															);
														}
													}}
													onKeyDown={(
														e,
													) => {
														if (
															e.code ===
															'Enter'
														) {
															formRef.current?.requestSubmit();
															setValue(
																null,
															);
														}
													}}
												/>
											</div>
										</div>
										<DrawerClose
											asChild
											className='order-2'
										>
											<Button
												type='button'
												variant='outline'
												size='icon'
											>
												<X />
											</Button>
										</DrawerClose>
									</div>
								</form>
							</nav>
						</DrawerTitle>
					</DrawerHeader>
					<DrawerDescription />

					<>
						{!allProducts && noProducts && (
							<h1 className='text-center'>
								لم يتم العثور على نتائج
							</h1>
						)}
						{!allProducts &&
							noProducts &&
							products && (
								<h1 className='text-center mb-8'>
									انظر منتجاتنا الأخرى
								</h1>
							)}
						{products && (
							<>
								<div className='grid grid-cols-2 md:grid-cols-4'>
									{products?.map((product) => (
										<ProductCard
											key={product.id}
											{...product}
										/>
									))}
								</div>
								<hr className='my-4' />
							</>
						)}
						{value == null && allProducts && (
							<div className='grid grid-cols-2 md:grid-cols-4'>
								{allProducts?.map((product) => (
									<ProductCard
										key={product.id}
										{...product}
									/>
								))}
							</div>
						)}
					</>
				</div>
				<div className='h-20'></div>
			</DrawerContent>
		</Drawer>
	);
}
