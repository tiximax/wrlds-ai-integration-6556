import React, { useState, useEffect } from 'react';
import { Zap, Clock, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductDeal } from '@/types/product';

interface DealTimerProps {
  deal: ProductDeal;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const DealTimer: React.FC<DealTimerProps> = ({
  deal,
  className = '',
  size = 'md',
  showProgress = true
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ 
    days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 
  });
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date().getTime();
    const endTime = new Date(deal.endDate).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, totalMs: difference };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  };

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      setIsExpired(remaining.totalMs <= 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal.endDate]);

  const getDealTypeConfig = () => {
    switch (deal.type) {
      case 'flash_sale':
        return {
          icon: <Zap className="w-4 h-4" />,
          title: 'Flash Sale',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          accentColor: 'text-red-600'
        };
      case 'daily_deal':
        return {
          icon: <Clock className="w-4 h-4" />,
          title: 'Daily Deal',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-900',
          accentColor: 'text-orange-600'
        };
      case 'group_buy':
        return {
          icon: <TrendingDown className="w-4 h-4" />,
          title: 'Group Buy',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-900',
          accentColor: 'text-green-600'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          title: 'Special Offer',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-900',
          accentColor: 'text-blue-600'
        };
    }
  };

  const config = getDealTypeConfig();

  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4'
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const getProgressPercentage = () => {
    if (!showProgress) return 0;
    
    const startTime = new Date(deal.startDate).getTime();
    const endTime = new Date(deal.endDate).getTime();
    const now = new Date().getTime();
    
    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  if (!deal.isActive && !isExpired) {
    return null;
  }

  if (isExpired) {
    return (
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg ${sizeClasses[size]} ${className} opacity-75`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <span className={`font-semibold ${config.textColor}`}>
              {config.title} Expired
            </span>
          </div>
          <Badge variant="outline" className="text-gray-500 border-gray-300">
            Deal Ended
          </Badge>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();
  const isUrgent = timeRemaining.days === 0 && timeRemaining.hours < 6;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg ${sizeClasses[size]} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={`font-semibold ${config.textColor}`}>
            {config.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {deal.discountPercent && (
            <Badge variant="destructive" className="font-bold">
              -{deal.discountPercent}%
            </Badge>
          )}
          {deal.discountAmount && (
            <Badge variant="destructive" className="font-bold">
              -{deal.discountAmount.toLocaleString('vi-VN')}₫
            </Badge>
          )}
        </div>
      </div>

      {/* Countdown Timer */}
      <div className={`flex items-center justify-center gap-1 mb-3 ${isUrgent ? 'animate-pulse' : ''}`}>
        {timeRemaining.days > 0 && (
          <>
            <div className="text-center">
              <div className={`text-2xl font-bold ${config.textColor}`}>
                {formatNumber(timeRemaining.days)}
              </div>
              <div className={`text-xs ${config.accentColor}`}>days</div>
            </div>
            <span className={`text-lg ${config.accentColor} mx-1`}>:</span>
          </>
        )}
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${config.textColor}`}>
            {formatNumber(timeRemaining.hours)}
          </div>
          <div className={`text-xs ${config.accentColor}`}>hrs</div>
        </div>
        <span className={`text-lg ${config.accentColor} mx-1`}>:</span>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${config.textColor}`}>
            {formatNumber(timeRemaining.minutes)}
          </div>
          <div className={`text-xs ${config.accentColor}`}>min</div>
        </div>
        <span className={`text-lg ${config.accentColor} mx-1`}>:</span>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${config.textColor}`}>
            {formatNumber(timeRemaining.seconds)}
          </div>
          <div className={`text-xs ${config.accentColor}`}>sec</div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs ${config.accentColor}`}>Deal Progress</span>
            <span className={`text-xs ${config.accentColor}`}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                deal.type === 'flash_sale' ? 'bg-red-500' : 
                deal.type === 'daily_deal' ? 'bg-orange-500' : 
                deal.type === 'group_buy' ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Group Buy Info */}
      {deal.type === 'group_buy' && deal.currentQuantity && deal.minQuantity && (
        <div className="text-center">
          <p className={`text-sm ${config.textColor} mb-1`}>
            {deal.currentQuantity}/{deal.minQuantity} orders
          </p>
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((deal.currentQuantity / deal.minQuantity) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Urgency Messages */}
      {isUrgent && (
        <div className="mt-2 text-center">
          <p className="text-red-600 text-sm font-medium animate-pulse">
            🔥 Hurry up! Deal ending soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default DealTimer;
