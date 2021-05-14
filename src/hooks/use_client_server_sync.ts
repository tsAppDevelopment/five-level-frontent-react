import { isEqual } from "lodash"
import { useEffect } from "react"
import { usePolling, useUserAirs } from './query'
import create, {State} from 'zustand'

interface IClientServerSyncStore extends State {
  lastSyncEpoch: number | undefined
  isClientCacheEqualToSwRes: boolean
  isClientOnline: boolean

  setLastSyncEpoch: (x:number) => void
  setIsClientCacheEqualToSwRes: (x: boolean) => void
  setIsClientOnline: (x: boolean) => void
}

export const ClientServerSyncStore = create<IClientServerSyncStore>(set => ({
  lastSyncEpoch: undefined,
  isClientCacheEqualToSwRes: true,
  isClientOnline: false,

  setLastSyncEpoch: (x) => set(s => {s.lastSyncEpoch = x}),
  setIsClientCacheEqualToSwRes: (x) => set(s => {s.isClientCacheEqualToSwRes = x}),
  setIsClientOnline: (x) => set(s => {s.isClientOnline = x})
}))

// use this for stateless updating functions
const ss = ClientServerSyncStore.getState()

export const useClientServerSync = () => {
  // the data that the client has loaded on init state
  const { data: clientCache } = useUserAirs()

  // poll the server | service worker 
  const { data: swRes } = usePolling('aircraft/lastUpdated',10000)

  useEffect(() => {

    // fallback if service worker does not return cache
    if (!swRes) {
      ss.setIsClientCacheEqualToSwRes(true)
      ss.setIsClientOnline(false)
    }

    if (swRes) {
      const gs = ClientServerSyncStore.getState()

      // are the preloaded aircraft stale?
      const isClientCacheEqualToSwRes = isEqual(clientCache.data, swRes.data)

      // if serverEpoch is more than x secs
      const isClientOnline = (Date.now() - swRes.serverEpoch) < 20000

      // client res equality does not mean client is synced with server because the res could have been cached 
      const isClientSyncedWithServer = isClientCacheEqualToSwRes && isClientOnline

      ss.setLastSyncEpoch(isClientSyncedWithServer ? swRes.serverEpoch : gs.lastSyncEpoch)
      ss.setIsClientCacheEqualToSwRes(isClientCacheEqualToSwRes)
      ss.setIsClientOnline(isClientOnline)
    }
    // key is unique to each res regardless is it is from service worker cache
  }, [swRes?.clientReqKey])

  const gs = ClientServerSyncStore.getState()

  return {
    isClientOnline: gs.isClientOnline,
    isClientCacheEqualToSwRes: gs.isClientCacheEqualToSwRes,
    lastSyncEpoch: gs.lastSyncEpoch,
    serverData: swRes,

    // was the client synced with the server over 48 hours ago?
    isClientStale: Date.now() - (gs.lastSyncEpoch as number) > 172800000,

    // client res equality does not mean client is synced with server because the res could have been cached 
    isClientSyncedWithServer: gs.isClientCacheEqualToSwRes && gs.isClientOnline,
  }
}