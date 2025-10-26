import { Button } from "@whop/react/components";
import { headers } from "next/headers";
import Link from "next/link";
import { whopsdk } from "@/lib/whop-sdk";
import { redirect } from "next/navigation";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;

	// Step 1: Require Whop OAuth login before displaying anything
	let userId: string;
	try {
		const result = await whopsdk.verifyUserToken(await headers());
		userId = result.userId;
	} catch (error) {
		// If user is not authenticated, redirect to login
		redirect(`/api/auth/login?redirect=/dashboard/${companyId}`);
	}

	// Step 2: Validate the authenticated user has access to the target company via SDK
	const accessCheck = await whopsdk.users.checkAccess(companyId, { id: userId });
	
	// Step 3: If not authorized, display an 'access denied' message
	if (!accessCheck.access) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
				<div className="text-center max-w-md">
					<h1 className="text-9 font-bold text-red-500 mb-4">
						Access Denied
					</h1>
					<p className="text-5 text-gray-10 mb-6">
						You do not have permission to access this company's dashboard.
						Please contact the company administrator if you believe this is an error.
					</p>
					<Link href="/dashboard">
						<Button variant="classic" size="3">
							Return to Dashboard
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// User is authorized - proceed to show dashboard analytics
	const [company, user] = await Promise.all([
		whopsdk.companies.retrieve(companyId),
		whopsdk.users.retrieve(userId),
	]);

	const displayName = user.name || `@${user.username}`;

	return (
		<div className="flex flex-col p-8 gap-4">
			<div className="flex justify-between items-center gap-4">
				<h1 className="text-9">
					Hi {displayName}!
				</h1>
				<Link href="https://docs.whop.com/apps" target="_blank">
					<Button className="w-full" size="3" variant="classic">
						Developer Docs
					</Button>
				</Link>
			</div>
			<p className="text-3 text-gray-10">
				Welcome to your whop app! You have been successfully authenticated and authorized.
				Here's your company dashboard analytics.
			</p>
			<h3 className="text-6 font-bold">Company Data</h3>
			<JsonViewer data={company} />
			<h3 className="text-6 font-bold">User Data</h3>
			<JsonViewer data={user} />
			<h3 className="text-6 font-bold">Access Details</h3>
			<JsonViewer data={accessCheck} />
		</div>
	);
}

function JsonViewer({ data }: { data: any }) {
	return (
		<pre className="text-2 border border-gray-a4 rounded-lg p-4 bg-gray-a2 max-h-72 overflow-y-auto">
			<code className="text-gray-10">{JSON.stringify(data, null, 2)}</code>
		</pre>
	);
}
