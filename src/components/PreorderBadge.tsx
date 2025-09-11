import React from 'react';
import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PreorderInfo } from '@/types/product';

interface PreorderBadgeProps {
  preorderInfo: PreorderInfo;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const PreorderBadge: React.FC<PreorderBadgeProps> = ({
  preorderInfo,
  className = '',
  size = 'md',
  showProgress = true
}) => {
  const progressPercentage = Math.min(
    (preorderInfo.currentPreorderCount / preorderInfo.minPreorderQuantity) * 100,
    100
  );

  const isGroupBuy = preorderInfo.isGroupBuy && preorderInfo.groupBuyThreshold;
  const groupBuyProgress = isGroupBuy 
    ? Math.min((preorderInfo.currentPreorderCount / (preorderInfo.groupBuyThreshold || 1)) * 100, 100)
    : 0;

  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilArrival = () => {
    const now = new Date();
    const arrival = new Date(preorderInfo.expectedArrival);
    const diffTime = arrival.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg ${sizeClasses[size]} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`${iconSizes[size]} text-blue-600`} />
          <span className="font-semibold text-blue-900">
            {isGroupBuy ? 'Group Buy' : 'Preorder'}
          </span>
        </div>
        <Badge variant="outline" className="text-blue-700 border-blue-300">
          {preorderInfo.depositPercent}% deposit
        </Badge>
      </div>

      {/* Expected Arrival */}
      <div className="flex items-center gap-2 mb-2 text-blue-800">
        <Calendar className={iconSizes[size]} />
        <span className="text-sm">
          Expected: {formatDate(preorderInfo.expectedArrival)}
        </span>
        <span className="text-xs text-blue-600">
          ({getDaysUntilArrival()} days)
        </span>
      </div>

      {/* Progress */}
      {showProgress && (
        <div className="space-y-2">
          {/* Main Preorder Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-blue-700">
                Preorders: {preorderInfo.currentPreorderCount}/{preorderInfo.minPreorderQuantity}
              </span>
              <span className="text-xs text-blue-600 font-medium">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-blue-100"
              // className="[&>div]:bg-blue-500"
            />
            {progressPercentage < 100 && (
              <p className="text-xs text-blue-600 mt-1">
                {preorderInfo.minPreorderQuantity - preorderInfo.currentPreorderCount} more needed
              </p>
            )}
          </div>

          {/* Group Buy Progress */}
          {isGroupBuy && preorderInfo.groupBuyThreshold && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-green-700 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Group Buy Target: {preorderInfo.groupBuyThreshold}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  {groupBuyProgress.toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={groupBuyProgress} 
                className="h-2 bg-green-100"
                // className="[&>div]:bg-green-500"
              />
              {groupBuyProgress >= 100 && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  🎉 Group buy unlocked! Better pricing available
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      {preorderInfo.estimatedPrice && (
        <div className="mt-2 p-2 bg-blue-100 rounded text-sm">
          <span className="text-blue-800 font-medium">Estimated Price:</span>
          <div className="text-blue-900">
            {preorderInfo.estimatedPrice.min.toLocaleString('vi-VN')} - {preorderInfo.estimatedPrice.max.toLocaleString('vi-VN')} ₫
          </div>
        </div>
      )}

      {/* Status Messages */}
      {progressPercentage >= 100 && (
        <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded">
          <p className="text-green-800 text-sm font-medium">
            ✅ Minimum preorders reached! Order confirmed.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreorderBadge;
