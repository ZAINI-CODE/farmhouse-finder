import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReviewFormProps {
  itemId: string;
  itemType: 'property' | 'vendor';
  onReviewSubmitted: () => void;
}

export function ReviewForm({ itemId, itemType, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('reviews')
      .upsert({
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
        rating,
        title: title || null,
        comment: comment || null,
      }, {
        onConflict: 'user_id,item_id,item_type'
      });

    setSubmitting(false);

    if (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    onReviewSubmitted();
  };

  if (!user) {
    return (
      <div className="bg-secondary/50 rounded-xl p-6 text-center">
        <p className="text-muted-foreground mb-4">Log in to leave a review</p>
        <Button variant="outline" onClick={() => window.location.href = '/login'}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-heading text-lg font-semibold mb-4">Write a Review</h3>
      
      <div className="space-y-4">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Your Rating *</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="review-title">Review Title (optional)</Label>
          <Input
            id="review-title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="review-comment">Your Review (optional)</Label>
          <Textarea
            id="review-comment"
            placeholder="Share your experience with others..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
          />
        </div>

        <Button type="submit" disabled={submitting || rating === 0}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>
      </div>
    </form>
  );
}
