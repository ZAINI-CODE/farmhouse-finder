import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type ItemType = 'property' | 'vendor';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<{ itemId: string; itemType: ItemType }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('item_id, item_type')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(data.map(f => ({ itemId: f.item_id, itemType: f.item_type as ItemType })));
    }
    setLoading(false);
  };

  const isFavorite = (itemId: string, itemType: ItemType) => {
    return favorites.some(f => f.itemId === itemId && f.itemType === itemType);
  };

  const toggleFavorite = async (itemId: string, itemType: ItemType) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    const isCurrentlyFavorite = isFavorite(itemId, itemType);

    if (isCurrentlyFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType);

      if (error) {
        toast.error('Failed to remove from favorites');
        console.error('Error removing favorite:', error);
      } else {
        setFavorites(prev => prev.filter(f => !(f.itemId === itemId && f.itemType === itemType)));
        toast.success('Removed from favorites');
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        });

      if (error) {
        toast.error('Failed to add to favorites');
        console.error('Error adding favorite:', error);
      } else {
        setFavorites(prev => [...prev, { itemId, itemType }]);
        toast.success('Added to favorites');
      }
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
  };
}