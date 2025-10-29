import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['analytics', 'dashboard', dateRange],
    queryFn: () => analyticsService.getDashboardAnalytics(dateRange.startDate, dateRange.endDate),
  });

  const { data: productAnalytics, isLoading: loadingProducts } = useQuery({
    queryKey: ['analytics', 'products'],
    queryFn: () => analyticsService.getProductAnalytics(20, 'revenue'),
  });

  const { data: customerAnalytics, isLoading: loadingCustomers } = useQuery({
    queryKey: ['analytics', 'customers'],
    queryFn: () => analyticsService.getCustomerAnalytics(20),
  });

  const { data: inventoryAnalytics, isLoading: loadingInventory } = useQuery({
    queryKey: ['analytics', 'inventory'],
    queryFn: () => analyticsService.getInventoryAnalytics(),
  });

  const { data: conversionAnalytics, isLoading: loadingConversion } = useQuery({
    queryKey: ['analytics', 'conversion'],
    queryFn: () => analyticsService.getConversionAnalytics(),
  });

  if (loadingDashboard) {
    return <div className="p-8">Loading analytics...</div>;
  }

  const revenue = dashboard?.revenue || {};
  const users = dashboard?.users || {};
  const products = dashboard?.products || {};
  const returns = dashboard?.returns || {};

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.totalRevenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {revenue.totalOrders || 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.averageOrderValue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.totalUsers || 0}</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="inline h-3 w-3" /> {users.newUsers || 0} new
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.activeProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {products.outOfStock || 0} out of stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products sorted by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-4">
                  {productAnalytics?.topProducts?.slice(0, 10).map((product: any, idx: number) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${product.totalRevenue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.totalQuantitySold} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers by total spending</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCustomers ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-4">
                  {customerAnalytics?.topCustomers?.slice(0, 10).map((customer: any, idx: number) => (
                    <div key={customer.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${customer.totalSpent.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.orderCount} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {customerAnalytics?.customerSegmentation?.map((segment: any) => (
              <Card key={segment._id}>
                <CardHeader>
                  <CardTitle className="text-lg">{segment._id} Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{segment.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {inventoryAnalytics?.stockStatus?.outOfStock || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {inventoryAnalytics?.stockStatus?.lowStock || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">In Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {inventoryAnalytics?.stockStatus?.inStock || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span className="font-bold text-xl">
                    ${inventoryAnalytics?.inventoryValue?.totalValue?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Units:</span>
                  <span>{inventoryAnalytics?.inventoryValue?.totalUnits || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="font-semibold">
                      {conversionAnalytics?.funnel?.totalUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users with Orders:</span>
                    <span className="font-semibold">
                      {conversionAnalytics?.funnel?.usersWithOrders || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Orders:</span>
                    <span className="font-semibold">
                      {conversionAnalytics?.funnel?.totalOrders || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Orders:</span>
                    <span className="font-semibold">
                      {conversionAnalytics?.funnel?.completedOrders || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">User to Customer</span>
                      <span className="font-bold">{conversionAnalytics?.conversionRates?.userToCustomer || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${conversionAnalytics?.conversionRates?.userToCustomer || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Order Completion</span>
                      <span className="font-bold">{conversionAnalytics?.conversionRates?.orderCompletion || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${conversionAnalytics?.conversionRates?.orderCompletion || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Cancellation Rate</span>
                      <span className="font-bold">{conversionAnalytics?.conversionRates?.cancellationRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${conversionAnalytics?.conversionRates?.cancellationRate || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Return Rate</span>
                      <span className="font-bold">{conversionAnalytics?.conversionRates?.returnRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${conversionAnalytics?.conversionRates?.returnRate || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{returns.totalReturns || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {returns.pendingReturns || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completed Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {returns.completedReturns || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Refunded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${returns.totalRefunded?.toFixed(2) || '0.00'}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
