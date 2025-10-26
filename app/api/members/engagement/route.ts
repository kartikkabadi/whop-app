import { NextResponse } from 'next/server';
import { Whop } from '@whop/sdk';

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

interface MemberEngagement {
  id: string;
  email: string;
  name: string;
  engagement: 'high' | 'medium' | 'low';
  membershipAge: number;
  loginCount: number;
  lastActive: string;
}

function categorizeEngagement(member: Member): 'high' | 'medium' | 'low' {
  const loginCount = member.metadata?.login_count || 0;
  const lastActive = member.metadata?.last_active || member.created_at;
  const daysSinceActive = Math.floor((Date.now() - lastActive) / 86400000);

  // High engagement: frequent logins and recent activity
  if (loginCount > 100 || (loginCount > 50 && daysSinceActive < 2)) {
    return 'high';
  }

  // Low engagement: few logins or inactive for a long time
  if (loginCount < 10 || daysSinceActive > 20) {
    return 'low';
  }

  // Medium engagement: everything else
  return 'medium';
}

function formatLastActive(timestamp: number): string {
  const daysSince = Math.floor((Date.now() - timestamp) / 86400000);
  if (daysSince === 0) return 'Today';
  if (daysSince === 1) return 'Yesterday';
  return `${daysSince} days ago`;
}

export async function GET() {
  try {
    const whopApiKey = process.env.WHOP_API_KEY;

    let members: Member[];

    if (whopApiKey) {
      // Use real Whop API
      const whop = new Whop(whopApiKey);

      // Fetch real member data
      // Note: Adjust the API call based on actual Whop SDK methods
      const response = await whop.users.list();
      members = response.data || [];
    } else {
      // Use mock data when API key is not available
      console.log('Using mock data - WHOP_API_KEY not found');
      members = mockMembers;
    }

    // Transform member data into engagement data
    const memberEngagement: MemberEngagement[] = members.map((member) => ({
      id: member.id,
      email: member.email,
      name: member.name,
      engagement: categorizeEngagement(member),
      membershipAge: Math.floor((Date.now() - member.created_at) / 86400000),
      loginCount: member.metadata?.login_count || 0,
      lastActive: formatLastActive(member.metadata?.last_active || member.created_at),
    }));

    // Calculate engagement statistics
    const stats = {
      high: memberEngagement.filter((m) => m.engagement === 'high').length,
      medium: memberEngagement.filter((m) => m.engagement === 'medium').length,
      low: memberEngagement.filter((m) => m.engagement === 'low').length,
      total: memberEngagement.length,
    };

    return NextResponse.json({
      members: memberEngagement,
      stats,
    });
  } catch (error) {
    console.error('Error fetching member engagement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member engagement data' },
      { status: 500 }
    );
  }
}
