'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';

// Adjusted interface to match API response structure
interface SubTopic {
  SubTopicId: number;
  SubTopicName: string;
  WeekNo: number;
}

interface Topic {
  TopicId: number;
  TopicName: string;
  SubTopics: SubTopic[];
}

export function CourseTopicsView() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch topics from API
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('baseURL')}teacher/GetTopicsByCourseCode?CourseCode=${localStorage.getItem('CourseCode')}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch course topics.');
        }

        const data = await response.json();
        setTopics(data);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">Course Topics</h2>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="grid grid-cols-1">
            {/* Header */}
            <div className="grid grid-cols-[1fr] p-4 border-b bg-white">
              <span className="font-medium">Topic Name</span>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
              topics.map((topic, index) => (
                <div
                  key={topic.TopicId}
                  className={cn(
                    'p-4 border-b last:border-b-0',
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  )}
                >
                  <div>
                    <span className="font-medium">{topic.TopicName}</span>
                    {topic.SubTopics.length > 0 && (
                      <ul className="mt-2 pl-4 list-disc">
                        {topic.SubTopics.map((subTopic) => (
                          <li key={subTopic.SubTopicId}>
                            {subTopic.SubTopicName} (Week {subTopic.WeekNo})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}