import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: () => orderService.getUserOrders(),
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

  if (!data || data.orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
          <Link to="/products">
            <Badge className="cursor-pointer">Shop Now</Badge>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-500',
      Processing: 'bg-blue-500',
      Shipped: 'bg-purple-500',
      Delivered: 'bg-green-500',
      Cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {data.orders.map((order) => (
        <Card key={order._id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>
              <Badge className={getStatusColor(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </div>

            <div className="space-y-3">
              {order.products.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} × {item.quantity}
                    </p>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono font-semibold">{order.trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
