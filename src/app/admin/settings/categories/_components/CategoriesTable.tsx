'use client';

import * as React from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	ChevronDown,
	Loader2,
	MoreHorizontal,
	Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState, useTransition } from 'react';
import { Category } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '../_actions/deleteCategory';

export default function CategoriesTable({
	data,
}: {
	data: Partial<Category>[];
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	const columns: ColumnDef<Partial<Category>>[] = [
		{
			accessorKey: 'name',
			header: () => (
				<div className='text-right'>الاسم</div>
			),
			cell: ({ row }) => (
				<div className='capitalize'>
					{row.getValue('name' as string)}
				</div>
			),
		},
		{
			accessorKey: 'categoryImage',
			header: () => (
				<div className='text-right'>صورة القسم</div>
			),
			cell: ({ row }) => (
				<Image
					alt={row.getValue('name')}
					src={row.getValue('categoryImage')}
					width={100}
					height={100}
					className='h-20 w-24'
				/>
			),
		},
		{
			accessorKey: 'bannerImage',
			header: () => (
				<div className='text-right'>اللافتة</div>
			),
			cell: ({ row }) =>
				row.getValue('bannerImage') ? (
					row.getValue('bannerImage') !==
					'no image' ? (
						<Image
							alt='banner image'
							src={row.getValue('bannerImage')}
							width={100}
							height={100}
							className='h-20 w-24'
						/>
					) : (
						'لا يوجد صورة'
					)
				) : (
					'لا يوجد لافتات'
				),
		},
		{
			id: 'الخيارات',
			enableHiding: false,
			cell: ({ row }) => {
				const category = row.original;
				return (
					<Dialog>
						<DropdownMenu dir='rtl'>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									className='h-8 w-8 p-0'
								>
									<span className='sr-only'>
										Open menu
									</span>
									<MoreHorizontal className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<Link
									href={`/admin/settings/categories/${category.id}`}
								>
									<DropdownMenuItem className='text-rayanWarning-dark'>
										تعديل
									</DropdownMenuItem>
								</Link>
								<DropdownMenuSeparator />

								<DialogTrigger asChild>
									<DropdownMenuItem className='text-rayanError-light'>
										حذف{' '}
									</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className='text-destructive'>
									حذف قسم {category.name}
								</DialogTitle>
							</DialogHeader>
							<DialogFooter>
								<Button
									variant='outline'
									className='w-full text-destructive bg-none hover:bg-destructive hover:text-white'
									onClick={() => {
										startTransition(
											async () => {
												await deleteCategory(
													category.id as string,
												);
												router.refresh();
											},
										);
									}}
								>
									{isPending ? (
										<Loader2 className='animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
									) : (
										'حذف'
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className='w-full'>
			<div className='flex items-center py-4'>
				<Input
					placeholder='اكتب اسم القسم'
					onChange={(event) =>
						table
							.getColumn('name')
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm ml-2'
				/>

				<Link href='/admin/settings/categories/new'>
					<Button variant='outline'>
						<Plus className='ml-2 h-4 w-4' />
					</Button>
				</Link>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='outline'
							className='ml-auto px-2'
						>
							<ChevronDown className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter((column) =>
								column.getCanHide(),
							)
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(
											value,
										) =>
											column.toggleVisibility(
												!!value,
											)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table
							.getHeaderGroups()
							.map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(
										(header) => {
											return (
												<TableHead
													key={
														header.id
													}
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header
																	.column
																	.columnDef
																	.header,
																header.getContext(),
														  )}
												</TableHead>
											);
										},
									)}
								</TableRow>
							))}
					</TableHeader>

					<TableBody>
						{!isPending ? (
							table.getRowModel().rows?.length ? (
								table
									.getRowModel()
									.rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={
												row.getIsSelected() &&
												'selected'
											}
										>
											{row
												.getVisibleCells()
												.map((cell) => (
													<TableCell
														key={
															cell.id
														}
													>
														{flexRender(
															cell
																.column
																.columnDef
																.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
										</TableRow>
									))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'
									>
										لا يوجد أقسام
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									<Loader2 className='size-20 animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light' />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
