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
import { useEffect, useState } from 'react';
import { getAllUsers } from '../_actions/getAllUsers';
import { User } from '@prisma/client';
import Link from 'next/link';
import EditRoleForm from './EditRoleForm';

export default function UsersTable({
	data,
}: {
	data: Partial<User>[];
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const columns: ColumnDef<Partial<User>>[] = [
		{
			accessorKey: 'username',
			header: () => (
				<div className='text-right'>الاسم</div>
			),
			cell: ({ row }) => (
				<div className='capitalize'>
					{row.getValue('username' as string)}
				</div>
			),
		},
		{
			accessorKey: 'phone',
			header: () => (
				<div className='text-right'>الهاتف</div>
			),
			cell: ({ row }) => (
				<div className='capitalize'>
					{row.getValue('phone' as string)}
				</div>
			),
		},
		{
			accessorKey: 'role',
			header: () => (
				<div className='text-right'>الدور</div>
			),
			cell: ({ row }) => (
				<div className='lowercase'>
					{row.getValue('role' as string)}
				</div>
			),
		},
		{
			id: 'الخيارات',
			enableHiding: false,
			cell: ({ row }) => {
				const user = row.original;
				return <EditRoleForm user={user} />;
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
					placeholder='اكتب اسم المستخدم'
					onChange={(event) =>
						table
							.getColumn('username')
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm ml-2'
				/>

				<Link href='/admin/settings/users/new'>
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
						{table.getRowModel().rows?.length ? (
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
													key={cell.id}
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
									لا يوجد مستخدمين
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
