"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Building2 } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: authError } = type === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Building2 className="h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-center">
            Construction Project Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleAuth('login')}
              disabled={isLoading}
            >
              Sign In
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleAuth('signup')}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}