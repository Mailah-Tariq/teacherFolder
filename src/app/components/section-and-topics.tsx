'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';

// Adjusted interfaces for API data
interface Section {
  SectionTitle: string;
  CourseInSOSId: number;
  CourseId: number;
  CourseCode: string;
}

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

export function SectionAndTopics() {
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to track checkboxes for topics, subtopics, and sections
  const [topicSections, setTopicSections] = useState<
    { topicId: number; isChecked: boolean; checkedSections: Set<string>; checkedSubTopics: Set<number> }[]
  >([]);

  useEffect(() => {
    const fetchSectionsAndTopics = async () => {
      try {
        const teacherId = localStorage.getItem('userId');
        const courseInSOSId = localStorage.getItem('CourseInSOSId');

        // Fetch sections
        const sectionResponse = await fetch(
          `${localStorage.getItem('baseURL')}teacher/GetTeacherCourseSections?teacherId=${teacherId}&courseInSOSId=${courseInSOSId}`
        );

        if (!sectionResponse.ok) {
          throw new Error('Failed to fetch sections.');
        }

        const sectionData: Section[] = await sectionResponse.json();
        setSections(sectionData);

        // Fetch topics
        const topicResponse = await fetch(
          `${localStorage.getItem('baseURL')}teacher/GetTopicsByCourseCode?CourseCode=${localStorage.getItem('CourseCode')}`
        );

        if (!topicResponse.ok) {
          throw new Error('Failed to fetch topics.');
        }

        const topicData: Topic[] = await topicResponse.json();
        setTopics(topicData);

        // Initialize state for all checkboxes
        const initialState = topicData.map((topic) => ({
          topicId: topic.TopicId,
          isChecked: false, // Initially unchecked topic
          checkedSections: new Set<string>(),
          checkedSubTopics: new Set<number>(),
        }));
        setTopicSections(initialState);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectionsAndTopics();
  }, []);

  const handleTopicCheckboxChange = (topicId: number) => {
    setTopicSections((prev) =>
      prev.map((topic) =>
        topic.topicId === topicId ? { ...topic, isChecked: !topic.isChecked } : topic
      )
    );
  };

  const handleSectionCheckboxChange = (topicId: number, sectionTitle: string) => {
    setTopicSections((prev) =>
      prev.map((topic) => {
        if (topic.topicId === topicId) {
          const updatedCheckedSections = new Set(topic.checkedSections);
          if (updatedCheckedSections.has(sectionTitle)) {
            updatedCheckedSections.delete(sectionTitle);
          } else {
            updatedCheckedSections.add(sectionTitle);
          }
          return { ...topic, checkedSections: updatedCheckedSections };
        }
        return topic;
      })
    );
  };

  const handleSubTopicCheckboxChange = (topicId: number, subTopicId: number) => {
    setTopicSections((prev) =>
      prev.map((topic) => {
        if (topic.topicId === topicId) {
          const updatedCheckedSubTopics = new Set(topic.checkedSubTopics);
          if (updatedCheckedSubTopics.has(subTopicId)) {
            updatedCheckedSubTopics.delete(subTopicId);
          } else {
            updatedCheckedSubTopics.add(subTopicId);
          }
          return { ...topic, checkedSubTopics: updatedCheckedSubTopics };
        }
        return topic;
      })
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cover Topics</h2>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            topics.map((topic) => (
              <div key={topic.TopicId} className="mb-4 border-b pb-4">
                {/* Topic Checkbox */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={topicSections.find((t) => t.topicId === topic.TopicId)?.isChecked}
                    onChange={() => handleTopicCheckboxChange(topic.TopicId)}
                    className="h-4 w-4"
                  />
                  <span className="font-medium text-lg">{topic.TopicName}</span>
                </div>

                {/* SubTopics Checkboxes */}
                {topic.SubTopics.length > 0 && (
                  <ul className="mb-4 pl-4 list-none">
                    {topic.SubTopics.map((subTopic) => (
                      <li key={subTopic.SubTopicId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={topicSections
                            .find((t) => t.topicId === topic.TopicId)
                            ?.checkedSubTopics.has(subTopic.SubTopicId)}
                          onChange={() =>
                            handleSubTopicCheckboxChange(topic.TopicId, subTopic.SubTopicId)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-gray-600">
                          {subTopic.SubTopicName} (Week {subTopic.WeekNo})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Section Checkboxes */}
                <div className="flex flex-col gap-2">
                  {sections.map((section) => (
                    <label key={section.SectionTitle} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={topicSections
                          .find((t) => t.topicId === topic.TopicId)
                          ?.checkedSections.has(section.SectionTitle)}
                        onChange={() =>
                          handleSectionCheckboxChange(topic.TopicId, section.SectionTitle)
                        }
                        className="h-4 w-4"
                      />
                      <span>{section.SectionTitle}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
