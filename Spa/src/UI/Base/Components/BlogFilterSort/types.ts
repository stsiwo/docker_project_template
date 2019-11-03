import * as React from 'react'

export declare type BlogFilterSortPropType = {
  filters: FilterType
  sort: number
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  setSort: React.Dispatch<React.SetStateAction<number>>
}

export declare type TagType = {
  name: string
}

export declare type DateRangeType = {
  start?: Date
  end?: Date
}

export declare type FilterType = {
  tags: TagType[]
  creationDate: DateRangeType
  keyword: string
}

export declare type SortType = {
  value: number
  title: string
}

export declare type UseBlogFilterSortInput = {
}

export declare type UseBlogFilterSortOutput = {
  filters: FilterType
  sort: number
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  setSort: React.Dispatch<React.SetStateAction<number>>
}
