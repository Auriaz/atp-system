export interface Media {
  id: number
  index?: number
  name: string
  title?: string
  description: string
  previewUrl: string
  mimeType: string
  fileSize: number
  pathUrl: string | null
  visibility: MediaVisibility
  author: {
    id: number
    email: string
    username: string
    firstname?: string
    lastname?: string
    avatarUrl?: string
  }
  movieUrl: string
  createdAtAgo: string
  updatedAtAgo: string
  selected?: boolean
  statusInfo: MediaStatusInfo
  status?: MediaStatus
}
export interface MediaList {
  items: Media[]
  total: number
  page: number
  limit: number
}
export interface MediaListResponse {
  data: MediaList
  error: string | null
}
export interface MediaListRequest {
  page: number
  limit: number
  sortBy: string
  sortOrder: string
  search: string
  filter: {
    status: MediaStatus[]
    visibility: MediaVisibility[]
    authorId: number | null
    createdAtFrom: string | null
    createdAtTo: string | null
  }
}

export type MediaStatus = 'active' | 'pending' | 'blocked' | 'reported'

export type MediaVisibility = 'public' | 'premium' | 'private'

export interface MediaStatusInfo {
  status: MediaStatus
  label: string
  class: string
  note: string | null
  moderatedAt: string | null
  moderatedBy: {
    id: number
    username: string
  } | null
  isBlocked: boolean
}