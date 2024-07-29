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
import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';

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
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { District } from '@prisma/client';
import { deleteDistrict } from '../_actions/deleteDistrict';
import { useRouter } from 'next/navigation';

export default function DistrictsTable({
	data,
}: {
	data: Partial<District>[];
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const columns: ColumnDef<Partial<District>>[] = [
		{
			accessorKey: 'index',
			header: () => (
				<div className='text-right'>{data.length}</div>
			),
			cell: ({ row }) => (
				<div className='capitalize'>
					{row.getValue('index')}
				</div>
			),
		},
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
			accessorKey: 'shippingFees',
			header: () => (
				<div className='text-right'>تكلفة التوصيل</div>
			),
			cell: ({ row }) => (
				<div className='capitalize'>
					{row.getValue('shippingFees' as string)}
				</div>
			),
		},
		{
			id: 'الخيارات',
			enableHiding: false,
			cell: ({ row }) => {
				const district = row.original;
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
									href={`/admin/settings/districts/${district.id}`}
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
									حذف المنطقة {district.name}
								</DialogTitle>
							</DialogHeader>
							<DialogFooter>
								<Button
									disabled={isPending}
									variant='outline'
									className='w-full text-destructive bg-none hover:bg-destructive hover:text-white'
									onClick={() => {
										startTransition(
											async () => {
												await deleteDistrict(
													district?.id as string,
												);
												router.refresh();
											},
										);
									}}
								>
									حذف
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
					placeholder='اكتب اسم المنطقة'
					onChange={(event) =>
						table
							.getColumn('name')
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm ml-2'
				/>

				<Link href='/admin/settings/districts/new'>
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
										لا يوجد مناطق
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									جار الحذف...
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
