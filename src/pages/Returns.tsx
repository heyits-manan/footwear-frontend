import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { returnService } from '@/services/returnService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Package, ArrowLeft } from 'lucide-react';

const Returns: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['returns'],
    queryFn: () => returnService.getUserReturns(),
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-500',
      Approved: 'bg-blue-500',
      Rejected: 'bg-red-500',
      'Picked Up': 'bg-purple-500',
      Received: 'bg-indigo-500',
      Inspected: 'bg-cyan-500',
      Completed: 'bg-green-500',
      Cancelled: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading returns...</div>
      </div>
    );
  }

  const returns = data?.returns || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Returns</h1>
        <p className="text-muted-foreground">View and track your return requests</p>
      </div>

      {returns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Returns</h3>
            <p className="text-muted-foreground mb-4">You haven't requested any returns yet</p>
            <Button onClick={() => navigate('/profile/orders')}>View Orders</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {returns.map((returnRequest: any) => (
            <Card
              key={returnRequest._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/returns/${returnRequest._id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Return Request #{returnRequest._id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      Created {formatDistanceToNow(new Date(returnRequest.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(returnRequest.status)}>
                    {returnRequest.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Return Type</p>
                      <p className="font-medium">{returnRequest.returnType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Refund Amount</p>
                      <p className="font-bold text-lg">${returnRequest.refundAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Items ({returnRequest.items.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {returnRequest.items.slice(0, 3).map((item: any, idx: number) => (
                        <img
                          key={idx}
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                      {returnRequest.items.length > 3 && (
                        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded border">
                          <span className="text-sm font-medium">+{returnRequest.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Returns;
