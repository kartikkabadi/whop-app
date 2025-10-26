'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Member {
  id: string;
  email: string;
  name: string;
  created_at: number;
  engagement_score: number;
}

interface EngagementData {
  all: Member[];
  top_engaged: Member[];
  at_risk: Member[];
  total_count: number;
}

export default function MembersPage() {
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEngagementData() {
      try {
        const response = await fetch('/api/members/engagement');
        if (!response.ok) {
          throw new Error('Failed to fetch engagement data');
        }
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchEngagementData();
  }, []);

  const getEngagementColor = (score: number) => {
    if (score >= 70) return '#10b981'; // green
    if (score >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getEngagementBadge = (score: number) => {
    if (score >= 70) return <Badge className="bg-green-500">High</Badge>;
    if (score >= 40) return <Badge className="bg-orange-500">Medium</Badge>;
    return <Badge className="bg-red-500">At Risk</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Member Engagement Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle>Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error || 'No data available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const chartData = data.all.map((member) => ({
    name: member.name.split(' ')[0], // First name only for readability
    score: member.engagement_score,
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Member Engagement Dashboard</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Total Members: {data.total_count}
        </Badge>
      </div>

      {/* Engagement Score Chart */}
      <Card>
        <CardHeader>
          <CardTitle>All Members Engagement Scores</CardTitle>
          <CardDescription>
            Visual representation of engagement scores across all members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" name="Engagement Score">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getEngagementColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 10 Engaged Members */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Engaged Members</CardTitle>
          <CardDescription>
            Members with the highest engagement scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.top_engaged.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell className="font-bold">#{index + 1}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <span className="font-bold" style={{ color: getEngagementColor(member.engagement_score) }}>
                      {member.engagement_score}
                    </span>
                  </TableCell>
                  <TableCell>{getEngagementBadge(member.engagement_score)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom 10 At-Risk Members */}
      <Card>
        <CardHeader>
          <CardTitle>Bottom 10 At-Risk Members</CardTitle>
          <CardDescription>
            Members with the lowest engagement scores who may need attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.at_risk.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell className="font-bold">#{data.total_count - index}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <span className="font-bold" style={{ color: getEngagementColor(member.engagement_score) }}>
                      {member.engagement_score}
                    </span>
                  </TableCell>
                  <TableCell>{getEngagementBadge(member.engagement_score)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
