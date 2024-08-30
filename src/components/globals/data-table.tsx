'use client'

import * as React from 'react'
import { Table, flexRender } from '@tanstack/react-table'
import {
  TableBody,
  Table as TableC,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'

import useQueryParams from '../hooks/use-params'

interface DataTableProps<TData> {
  table: Table<TData>
}

export function DataTable<TData>({ table }: DataTableProps<TData>) {
  const { setParams, getParam } = useQueryParams()
  const [page, setPage] = React.useState(parseInt(getParam('page')!) || 1)

  const pageNext = () => {
    setPage((prev) => {
      const newPage = prev + 1
      if (newPage > table.getPageCount()) return prev
      setParams('page', newPage)
      return newPage
    })
    table.nextPage()
  }

  const pagePrev = () => {
    setPage((prev) => {
      const newPage = prev - 1
      if (newPage < 1) return prev
      setParams('page', newPage)
      return newPage
    })
    table.previousPage()
  }

  React.useEffect(() => {
    setParams('page', page)
  }, [page])

  return (
    <div className="w-full">
      <div className="rounded-md border bg-white/80">
        <TableC className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table?.getAllColumns().length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableC>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between space-x-2 p-2 max-sm:flex-col">
        <p className="flex flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} total de linha(s).
        </p>
        <div className='flex flex-wrap'>
          {table.getRowModel().rows?.length > 0 && (
            <Pagination className="inline-flex">
              <PaginationContent className="space-x-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={`hidden md:flex items-center justify-center border ${page == table.getPageCount() && 'sr-only'}`}
                    onClick={pagePrev}
                  />
                </PaginationItem>
                <PaginationItem
                  className={`${page == 1 && 'sr-only'}`}
                  onClick={() => setPage(1)}
                >
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem className={`${!(page > 2) && 'sr-only'}`}>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className={`${page - 1 <= 1 && 'sr-only'}`}
                    onClick={() => setPage(page - 1)}
                  >
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem
                  className={`${page + 1 >= table.getPageCount() && 'sr-only'}`}
                  onClick={() => setPage(page + 1)}
                >
                  <PaginationLink href="#">{page + 1}</PaginationLink>
                </PaginationItem>
                <PaginationItem
                  className={`${page == table.getPageCount() && 'sr-only'}`}
                >
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem
                  className={`${page == table.getPageCount() && 'sr-only'}`}
                  onClick={() => setPage(table.getPageCount())}
                >
                  <PaginationLink href="#">
                    {table.getPageCount()}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem
                  className={`${page == table.getPageCount() && 'sr-only'} hidden md:flex`}
                  onClick={pageNext}
                >
                  <PaginationNext
                    href="#"
                    className="flex items-center justify-center border"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}
