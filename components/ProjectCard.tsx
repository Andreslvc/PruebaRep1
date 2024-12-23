"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Building2, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: any;
  onUpdate: () => void;
}

export default function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>{project.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Budget: {formatCurrency(project.budget)}</span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}