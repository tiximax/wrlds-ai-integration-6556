import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface Crumb {
  id: string;
  name: string;
  url: string;
}

interface CategoryBreadcrumbsProps {
  crumbs: Crumb[];
}

const CategoryBreadcrumbs: React.FC<CategoryBreadcrumbsProps> = ({ crumbs }) => {
  if (!crumbs || crumbs.length === 0) return null;
  const last = crumbs[crumbs.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.slice(0, -1).map((c) => (
          <React.Fragment key={c.id}>
            <BreadcrumbItem>
              <BreadcrumbLink href={c.url}>{c.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{last.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CategoryBreadcrumbs;