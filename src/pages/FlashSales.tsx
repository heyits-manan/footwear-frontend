import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flashSaleService, FlashSale } from '@/services/flashSaleService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const FlashSales: React.FC = () => {
  const navigate = useNavigate();

  const { data: activeFlashSales, isLoading: loadingActive } = useQuery({
    queryKey: ['flashSales', 'active'],
    queryFn: flashSaleService.getActiveFlashSales,
  });

  const { data: upcomingFlashSales, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['flashSales', 'upcoming'],
    queryFn: flashSaleService.getUpcomingFlashSales,
  });

  const CountdownTimer: React.FC<{ endTime: Date }> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const updateTimer = () => {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const distance = end - now;

        if (distance < 0) {
          setTimeLeft('Ended');
          return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [endTime]);

    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold">
        <Clock className="h-4 w-4" />
        {timeLeft}
      </div>
    );
  };

  const FlashSaleCard: React.FC<{ flashSale: FlashSale; isUpcoming?: boolean }> = ({
    flashSale,
    isUpcoming = false,
  }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                {flashSale.name}
              </CardTitle>
              {flashSale.description && (
                <CardDescription>{flashSale.description}</CardDescription>
              )}
            </div>
            {isUpcoming ? (
              <Badge variant="outline">
                Starts {formatDistanceToNow(new Date(flashSale.startTime), { addSuffix: true })}
              </Badge>
            ) : (
              <CountdownTimer endTime={new Date(flashSale.endTime)} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashSale.products.slice(0, 8).map((item) => {
              const soldPercentage = (item.soldCount / item.stockLimit) * 100;

              return (
                <div
                  key={item.product._id}
                  className="border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate(`/products/${item.product._id}`)}
                >
                  <img
                    src={item.product.images?.[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">
                    {item.product.name}
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">
                        ${item.flashPrice.toFixed(2)}
                      </span>
                      <span className="text-xs line-through text-muted-foreground">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {item.discountPercentage}% OFF
                    </Badge>
                    {!isUpcoming && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Sold: {item.soldCount}</span>
                          <span>{item.stockLimit - item.soldCount} left</span>
                        </div>
                        <Progress value={soldPercentage} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {flashSale.products.length > 8 && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate(`/flash-sale/${flashSale._id}`)}
            >
              View All {flashSale.products.length} Products
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loadingActive && loadingUpcoming) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading flash sales...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Flash Sales
        </h1>
        <p className="text-muted-foreground">Limited time offers with amazing discounts!</p>
      </div>

      {/* Active Flash Sales */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-semibold">Active Now</h2>
        {activeFlashSales && activeFlashSales.length > 0 ? (
          activeFlashSales.map((flashSale) => (
            <FlashSaleCard key={flashSale._id} flashSale={flashSale} />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No active flash sales at the moment. Check back soon!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Flash Sales */}
      {upcomingFlashSales && upcomingFlashSales.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          {upcomingFlashSales.map((flashSale) => (
            <FlashSaleCard key={flashSale._id} flashSale={flashSale} isUpcoming />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashSales;
