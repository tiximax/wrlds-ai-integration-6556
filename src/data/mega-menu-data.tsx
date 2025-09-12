import React from 'react';
import { Shield, Zap, Activity, Heart } from 'lucide-react';

export interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  image?: string;
}

export interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

export const servicesSections: MegaMenuSection[] = [
  {
    title: "Smart Textiles",
    items: [
      {
        title: "FireCat 6th SENSE",
        description: "Smart textiles for firefighter safety with temperature monitoring",
        href: "/projects/firecat",
        icon: <Shield className="w-4 h-4" />,
        badge: "Popular"
      },
      {
        title: "Workwear Climate",
        description: "Temperature regulation for extreme work environments",
        href: "/projects/workwear", 
        icon: <Zap className="w-4 h-4" />
      }
    ]
  },
  {
    title: "Performance Tracking",
    items: [
      {
        title: "Sports Performance",
        description: "Advanced tracking and analytics for professional athletes",
        href: "/projects/sport-retail",
        icon: <Activity className="w-4 h-4" />,
        badge: "New"
      },
      {
        title: "Hockey Elite Tracker",
        description: "Specialized performance metrics for ice hockey players",
        href: "/projects/hockey",
        icon: <Zap className="w-4 h-4" />
      }
    ]
  },
  {
    title: "Smart Monitoring",
    items: [
      {
        title: "Pet Activity Counter",
        description: "Smart collars for comprehensive pet health monitoring",
        href: "/projects/pet-tracker",
        icon: <Heart className="w-4 h-4" />
      }
    ]
  }
];

export const featuredService = {
  title: "Next-Gen Smart Textiles",
  description: "Discover our revolutionary smart textile solutions that combine cutting-edge sensors with advanced materials for unprecedented safety and performance monitoring.",
  href: "/tech-details",
  image: "/featured-service.jpg",
  badge: "Featured"
};
