import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { Sprocket, SprocketInsert, SprocketUpdate } from '../types'

export function useSprockets() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['sprockets', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('sprockets')
        .select('*')
        .eq('user_id', user.id)
        .order('teeth', { ascending: true })
      if (error) throw error
      return data as Sprocket[]
    },
    enabled: !!user,
  })
}

export function useAddSprocket() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (sprocket: Omit<SprocketInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('sprockets')
        .insert({ ...sprocket, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Sprocket
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprockets'] })
    },
  })
}

export function useUpdateSprocket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: SprocketUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('sprockets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Sprocket
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprockets'] })
    },
  })
}

export function useDeleteSprocket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sprockets').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprockets'] })
    },
  })
}
