'use client';

import React, { useState, useEffect } from 'react';
import { FacebookPost, formatFacebookPost, getTimeSince } from './lib/facebook';
import { Card } from './components/ui/Card';
import { api } from '@/lib/api';

interface CommunityUpdatesProps {
  pageId?: string;
  maxPosts?: number;
  showImages?: boolean;
  showEngagement?: boolean;
  className?: string;
}

export default function CommunityUpdates({
  pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
  maxPosts = 5,
  showImages = true,
  showEngagement = true,
  className = ''
}: CommunityUpdatesProps) {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [pageId, maxPosts]);

  const fetchPosts = async () => {
    if (!pageId) {
      setError('Facebook Page ID not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await api(`/facebook/posts?pageId=${pageId}&limit=${maxPosts}`);
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching Facebook posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Community Updates</h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00B272]"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Community Updates</h3>
          <button
            onClick={handleRefresh}
            className="text-[#00B272] hover:text-[#009960] text-sm font-medium"
          >
            Try Again
          </button>
        </div>
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Community Updates</h3>
          <button
            onClick={handleRefresh}
            className="text-[#00B272] hover:text-[#009960] text-sm font-medium"
          >
            Refresh
          </button>
        </div>
        <Card className="p-6 text-center">
          <div className="text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">No recent updates available</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Community Updates</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="text-[#00B272] hover:text-[#009960] text-sm font-medium"
          >
            Refresh
          </button>
          <a
            href={`https://facebook.com/${pageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00B272] hover:text-[#009960] text-sm font-medium"
          >
            View All
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Post header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#00B272] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">QG</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">QuickGig.ph</p>
                    <p className="text-xs text-gray-500">{getTimeSince(post.created_time)}</p>
                  </div>
                </div>
                <a
                  href={post.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00B272] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>

              {/* Post content */}
              <div className="space-y-2">
                {(post.message || post.story) && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {formatFacebookPost(post)}
                  </p>
                )}

                {/* Post image */}
                {showImages && post.full_picture && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.full_picture}
                      alt="Post image"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              {/* Engagement stats */}
              {showEngagement && (post.reactions || post.comments) && (
                <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
                  {post.reactions && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="text-xs">{post.reactions.summary.total_count}</span>
                    </div>
                  )}
                  {post.comments && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs">{post.comments.summary.total_count}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <a
          href={`https://facebook.com/${pageId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00B272] hover:text-[#009960] text-sm font-medium inline-flex items-center space-x-1"
        >
          <span>Follow us on Facebook</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// Compact version for sidebar
export function CommunityUpdatesCompact({ className = '' }: { className?: string }) {
  return (
    <CommunityUpdates
      maxPosts={3}
      showImages={false}
      showEngagement={false}
      className={className}
    />
  );
}

