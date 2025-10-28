import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, Review } from '@/services/reviewService';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import StarRating from './StarRating';
import { ThumbsUp, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => reviewService.getProductReviews(productId),
  });

  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: string) => reviewService.markHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
      toast({
        title: 'Success',
        description: 'Thank you for your feedback!',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to mark review as helpful',
        variant: 'destructive',
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      setDeleteReviewId(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    );
  }

  const handleMarkHelpful = (reviewId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please sign in to mark reviews as helpful',
        variant: 'destructive',
      });
      return;
    }
    markHelpfulMutation.mutate(reviewId);
  };

  const handleDeleteReview = (reviewId: string) => {
    setDeleteReviewId(reviewId);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Summary */}
        <div className="flex items-center gap-6 p-6 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold">{(data.averageRating || 0).toFixed(1)}</div>
            <StarRating rating={Math.round(data.averageRating || 0)} readonly size="sm" />
            <p className="text-sm text-muted-foreground mt-1">
              {data.totalReviews} {data.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {data.reviews.map((review: Review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.user.name}</p>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {user && user._id === review.user._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <StarRating rating={review.rating} readonly size="sm" />

                <p className="mt-3 text-sm">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {review.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Review ${idx + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkHelpful(review._id)}
                    disabled={markHelpfulMutation.isPending}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReviewId && deleteReviewMutation.mutate(deleteReviewId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewList;
