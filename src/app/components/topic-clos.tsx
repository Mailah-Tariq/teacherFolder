'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';

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

export default function TopicCLos() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); 

  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCLOs, setSelectedCLOs] = useState<{ topicId: number; cloId: number }[]>([]);

  useEffect(() => {
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

        // After fetching topics, load CLO selections
        fetchSelectedCLOs(data);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Fetch previously selected CLOs for all topics
  const fetchSelectedCLOs = async (topics: Topic[]) => {
    try {
      let selectedCLOsData: { topicId: number; cloId: number }[] = [];

      for (const topic of topics) {
        const response = await fetch(`${localStorage.getItem('baseURL')}teacher/GetTopicCLOs?topicId=${topic.TopicId}`);
        
        if (response.ok) {
          const data: { TopicId: number; CLOId: number }[] = await response.json();
          selectedCLOsData = [...selectedCLOsData, ...data.map(d => ({ topicId: d.TopicId, cloId: d.CLOId }))];
        }
      }

      setSelectedCLOs(selectedCLOsData);
    } catch (error) {
      console.error('Error fetching selected CLOs:', error);
    }
  };

  const handleCheckboxChange = async (topicId: number, cloId: number, isChecked: boolean) => {
    console.log('Checkbox Change:', { topicId, cloId, isChecked });

    const updatedSelections = isChecked
      ? [...selectedCLOs, { topicId, cloId }]
      : selectedCLOs.filter((selection) => !(selection.topicId === topicId && selection.cloId === cloId));

    setSelectedCLOs(updatedSelections);

    try {
      const response = await fetch(`${localStorage.getItem('baseURL')}teacher/SaveTopicCLO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicId, cloId, isChecked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update CLO selection.');
      }
    } catch (error) {
      console.error('Error saving CLO selection:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">Course Topics</h2>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Topic Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left">CLO1</th>
                <th className="border border-gray-200 px-4 py-2 text-left">CLO2</th>
                <th className="border border-gray-200 px-4 py-2 text-left">CLO3</th>
                <th className="border border-gray-200 px-4 py-2 text-left">CLO4</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-red-500">{error}</td>
                </tr>
              ) : (
                topics.map((topic, index) => (
                  <tr key={topic.TopicId} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                    <td className="border border-gray-200 px-4 py-2 font-medium">{topic.TopicName}</td>
                    {[1, 2, 3, 4].map((clo) => (
                      <td key={clo} className="border border-gray-200 px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={selectedCLOs.some(
                            (selection) => selection.topicId === topic.TopicId && selection.cloId === clo
                          )}
                          onChange={(e) => handleCheckboxChange(topic.TopicId, clo, e.target.checked)}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
