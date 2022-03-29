import { fetchPlaylist } from '@/api/playlist'
import { PlaylistApiNames } from '@/api/playlist'
import type { FetchPlaylistParams, FetchPlaylistResponse } from '@/api/playlist'
import reactQueryClient from '@/utils/reactQueryClient'

const fetch = (params: FetchPlaylistParams, noCache?: boolean) => {
  return fetchPlaylist(params, !!noCache)
}

export default function usePlaylist(
  params: FetchPlaylistParams,
  noCache?: boolean
) {
  return useQuery(
    [PlaylistApiNames.FETCH_PLAYLIST, params],
    () => fetch(params, noCache),
    {
      enabled: !!(params.id && params.id > 0 && !isNaN(Number(params.id))),
      refetchOnWindowFocus: true,
      placeholderData: (): FetchPlaylistResponse | undefined =>
        window.ipcRenderer?.sendSync('getApiCacheSync', {
          api: 'playlist/detail',
          query: {
            id: params.id,
          },
        }),
    }
  )
}

export async function prefetchPlaylist(params: FetchPlaylistParams) {
  await reactQueryClient.prefetchQuery(
    [PlaylistApiNames.FETCH_PLAYLIST, params],
    () => fetch(params),
    {
      staleTime: 3600000,
    }
  )
}
