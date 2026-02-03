import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { Chainring, ChainringInsert, ChainringUpdate } from '../types'

export function useChainrings() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['chainrings', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('chainrings')
        .select('*')
        .eq('user_id', user.id)
        .order('teeth', { ascending: true })
      if (error) throw error
      return data as Chainring[]
    },
    enabled: !!user,
  })
}

export function useAddChainring() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (chainring: Omit<ChainringInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('chainrings')
        .insert({ ...chainring, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Chainring
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chainrings'] })
    },
  })
}

export function useUpdateChainring() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ChainringUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('chainrings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Chainring
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chainrings'] })
    },
  })
}

export function useDeleteChainring() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('chainrings').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chainrings'] })
    },
  })
}
