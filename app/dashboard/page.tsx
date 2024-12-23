"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Plus, Building2 } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import NewProjectDialog from '@/components/NewProjectDialog';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && projects) {
      setProjects(projects);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">Construction Manager</h1>
          </div>
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth');
            }}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <Button onClick={() => setIsNewProjectOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                You haven't created any projects yet. Click "New Project" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={fetchProjects}
              />
            ))}
          </div>
        )}
      </main>

      <NewProjectDialog
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
        onSuccess={fetchProjects}
      />
    </div>
  );
}