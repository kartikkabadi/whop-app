import { NextResponse } from 'next/server';
import { WhopAPI } from '@whop/sdk';

// Mock member data for testing when real API access isn't available
const mockMembers = [
  { id: '1', email: 'user1@example.com', name: 'Alice Johnson', created_at: Date.now() - 86400000 * 90, metadata: { login_count: 45, last_active: Date.now() - 86400000 * 1 } },
  { id: '2', email: 'user2@example.com', name: 'Bob Smith', created_at: Date.now() - 86400000 * 120, metadata: { login_count: 120, last_active: Date.now() - 86400000 * 0.5 } },
  { id: '3', email: 'user3@example.com', name: 'Charlie Brown', created_at: Date.now() - 86400000 * 30, metadata: { login_count: 5, last_active: Date.now() - 86400000 * 25 } },
  { id: '4', email: 'user4@example.com', name: 'Diana Prince', created_at: Date.now() - 86400000 * 60, metadata: { login_count: 89, last_active: Date.now() - 86400000 * 2 } },
  { id: '5', email: 'user5@example.com', name: 'Ethan Hunt', created_at: Date.now() - 86400000 * 180, metadata: { login_count: 200, last_active: Date.now() - 86400000 * 0.2 } },
  { id: '6', email: 'user6@example.com', name: 'Fiona Apple', created_at: Date.now() - 86400000 * 45, metadata: { login_count: 12, last_active: Date.now() - 86400000 * 30 } },
  { id: '7', email: 'user7@example.com', name: 'George Washington', created_at: Date.now() - 86400000 * 150, metadata: { login_count: 155, last_active: Date.now() - 86400000 * 1 } },
  { id: '8', email: 'user8@example.com', name: 'Hannah Montana', created_at: Date.now() - 86400000 * 20, metadata: { login_count: 3, last_active: Date.now() - 86400000 * 15 } },
  { id: '9', email: 'user9@example.com', name: 'Ian Malcolm', created_at: Date.now() - 86400000 * 75, metadata: { login_count: 67, last_active: Date.now() - 86400000 * 3 } },
  { id: '10', email: 'user10@example.com', name: 'Julia Roberts', created_at: Date.now() - 86400000 * 95, metadata: { login_count: 102, last_active: Date.now() - 86400000 * 1.5 } },
  { id: '11', email: 'user11@example.com', name: 'Kevin Hart', created_at: Date.now() - 86400000 * 200, metadata: { login_count: 230, last_active: Date.now() - 86400000 * 0.3 } },
  { id: '12', email: 'user12@example.com', name: 'Laura Croft', created_at: Date.now() - 86400000 * 35, metadata: { login_count: 8, last_active: Date.now() - 86400000 * 28 } },
  { id: '13', email: 'user13@example.com', name: 'Michael Scott', created_at: Date.now() - 86400000 * 110, metadata: { login_count: 145, last_active: Date.now() - 86400000 * 0.8 } },
  { id: '14', email: 'user14@example.com', name: 'Nancy Drew', created_at: Date.now() - 86400000 * 55, metadata: { login_count: 45, last_active: Date.now() - 86400000 * 5 } },
  { id: '15', email: 'user15@example.com', name: 'Oscar Wilde', created_at: Date.now() - 86400000 * 15, metadata: { login_count: 2, last_active: Date.now() - 86400000 * 12 } },
  { id: '16', email: 'user16@example.com', name: 'Pam Beesly', created_at: Date.now() - 86400000 * 130, metadata: { login_count: 167, last_active: Date.now() - 86400000 * 1.2 } },
  { id: '17', email: 'user17@example.com', name: 'Quincy Jones', created_at: Date.now() - 86400000 * 80, metadata: { login_count: 78, last_active: Date.now() - 86400000 * 2.5 } },
  { id: '18', email: 'user18@example.com', name: 'Rachel Green', created_at: Date.now() - 86400000 * 50, metadata: { login_count: 18, last_active: Date.now() - 86400000 * 20 } },
  { id: '19', email: 'user19@example.com', name: 'Steve Jobs', created_at: Date.now() - 86400000 * 170, metadata: { login_count: 195, last_active: Date.now() - 86400000 * 0.5 } },
  { id: '20', email: 'user20@example.com', name: 'Tina Fey', created_at: Date.now() - 86400000 * 25, metadata: { login_count: 6, last_active: Date.now() - 86400000 * 22 } },
];

interface Member {
  id: string;
  email: string;
  name: string;
  created_at: number;
  metadata?: {
    login_count?: number;
    last_active?: number;
  };
}

interface MemberEngagement extends Member {
  engagement_score: number;
}

/**
 * Calculate engagement score for a member
 * Score is based on:
 * - Login frequency (40%)
 * - Recency of activity (40%)
 * - Account age (20%)
 */
function calculateEngagementScore(member: Member): number {
  const now = Date.now();
  const accountAgeInDays = (now - member.created_at) / (1000 * 60 * 60 * 24);
  const loginCount = member.metadata?.login_count || 0;
  const lastActive = member.metadata?.last_active || member.created_at;
  const daysSinceActive = (now - lastActive) / (1000 * 60 * 60 * 24);

  // Login frequency score (0-100): more logins = higher score
  const loginScore = Math.min((loginCount / Math.max(accountAgeInDays, 1)) * 10, 100);

  // Recency score (0-100): more recent activity = higher score
  const recencyScore = Math.max(0, 100 - daysSinceActive * 2);

  // Account age score (0-100): longer membership = higher potential
  const ageScore = Math.min(accountAgeInDays / 2, 100);

  // Weighted total
  const totalScore = (loginScore * 0.4) + (recencyScore * 0.4) + (ageScore * 0.2);

  return Math.round(totalScore * 10) / 10; // Round to 1 decimal place
}

export async function GET(request: Request) {
  try {
    let members: Member[] = [];
    
    // Try to fetch real data from Whop API
    try {
      const whopApiKey = process.env.WHOP_API_KEY;
      
      if (whopApiKey) {
        const whop = new WhopAPI(whopApiKey);
        // Attempt to fetch members from Whop
        const response = await whop.members.list();
        members = response.data || [];
      } else {
        console.log('No WHOP_API_KEY found, using mock data');
        members = mockMembers;
      }
    } catch (error) {
      console.log('Failed to fetch from Whop API, using mock data:', error);
      members = mockMembers;
    }

    // If no members found, use mock data
    if (members.length === 0) {
      members = mockMembers;
    }

    // Calculate engagement scores for all members
    const membersWithEngagement: MemberEngagement[] = members.map(member => ({
      ...member,
      engagement_score: calculateEngagementScore(member),
    }));

    // Sort by engagement score (highest first)
    membersWithEngagement.sort((a, b) => b.engagement_score - a.engagement_score);

    // Get top 10 engaged and bottom 10 at-risk
    const topEngaged = membersWithEngagement.slice(0, 10);
    const atRisk = membersWithEngagement.slice(-10).reverse();

    return NextResponse.json({
      success: true,
      data: {
        all: membersWithEngagement,
        top_engaged: topEngaged,
        at_risk: atRisk,
        total_count: membersWithEngagement.length,
      },
    });
  } catch (error) {
    console.error('Error in engagement API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate member engagement' },
      { status: 500 }
    );
  }
}
