import { useState } from 'react';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ReviewsList } from './ReviewsList';
import { ReviewForm } from './ReviewForm';

interface ReviewsSectionProps {
  itemId: string;
  itemType: 'property' | 'vendor';
  rating: number | null;
  reviewsCount: number | null;
}

export function ReviewsSection({ itemId, itemType, rating, reviewsCount }: ReviewsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-accent text-accent" />
          <span className="font-semibold text-lg">{rating || 0}</span>
          <span className="text-muted-foreground">({reviewsCount || 0} reviews)</span>
        </div>
      </div>

      <Separator />

      <ReviewForm 
        itemId={itemId} 
        itemType={itemType} 
        onReviewSubmitted={handleReviewSubmitted}
      />

      <ReviewsList 
        itemId={itemId} 
        itemType={itemType} 
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
