"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarChart, Users, Building, TrendingUp, DollarSign, Globe } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-green border-t-gold animate-spin"></div>
      </div>
    );
  }

  // Handle case where user is not found in Convex (not synced yet or auth error)
  if (currentUser === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-dark">
        <div className="w-12 h-12 rounded-full border-4 border-primary-green border-t-gold animate-spin"></div>
        <p className="mt-4 text-white">Syncing profile...</p>
      </div>
    );
  }

  // Redirect to onboarding if role is "user" (unconfigured)
  if (currentUser.role === "user") {
    // Prevent flicker by showing loading or just executing push immediately
    // In strict mode this might double fire but router.push is safe.
    router.push("/onboarding");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-dark">
        <div className="w-12 h-12 rounded-full border-4 border-primary-green border-t-gold animate-spin"></div>
        <p className="mt-4 text-white">Redirecting to onboarding...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary text-white p-8 rounded-2xl shadow-green">
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
            </h1>
            <p className="text-white/90 mt-1">
              Here's what's happening with your platform today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-text-muted text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-text-primary">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-primary-green" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-very-light-green flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">New user registered</p>
                  <p className="text-xs text-text-muted">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-gold" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            {["User Engagement", "Business Verification", "Investment Activity"].map((metric) => (
              <div key={metric}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">{metric}</span>
                  <span className="text-sm font-bold text-primary-green">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

