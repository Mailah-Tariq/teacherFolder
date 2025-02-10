'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/header';
import { Sidebar } from '../../components/sidebar';
interface TabData {
  Key: {
    S1Id: number;
    S1Name: string;
    FilePathKey: string;
    ContentId:number;
  };
  Values: {
    S2Id: number;
    S2Name: string;
    FilePath: string | null;
  }[];
}

export default function AssignmentDetail() {
  const router = useRouter();
  const [tabData, setTabData] = useState<TabData[] | null>(null);
  const [s1ids, setS1ids] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const storedCourse = JSON.parse(localStorage.getItem('course') || '{}');
  const title = `Assignment for Course ${storedCourse.CourseTitle} ${storedCourse.ProgramShortName} ${storedCourse.SemesterNo}`;
  const API_URL = `${localStorage.getItem('baseURL')}teacher/GetSamples?type=assi&allocationId=${localStorage.getItem('allocationId')}`;

  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true);
      setTabData(null);
      setError(null);
      try {
        const response = await fetch(API_URL);
       
        if (!response.ok) throw new Error('Failed to fetch data.');
        const data: TabData[] = await response.json();
        setTabData(data);
        if (data && Array.isArray(data)) {
          const s1Ids = data.map((assignment) => assignment.Key.S1Id);
          setS1ids(s1Ids);
        }

        console.log("data print",data)
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTabData();
  }, []);
  useEffect(() => {
    console.log("s1idssss", s1ids);
  }, [s1ids]); 
  const navigateToDetails = (contentId: number) => {
    //localStorage.setItem('ContentId', contentId.toString()); // Store ContentId in localStorage
    router.push(`/assignment-content-detail/${contentId}`); // Navigate to the next page
  };

  const handleFileChange = (keyId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [keyId]: files[0],
      }));
    }
  };

  const handleUpload = async (keyId: number) => {
    const file = selectedFiles[keyId];
  
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
  
    const UPLOAD_API_URL = `${localStorage.getItem('baseURL')}/Folder/UploadFolderContent`;
  
    const formData = new FormData();
    formData.append('allocationId', localStorage.getItem('allocationId') ?? '');
    formData.append('FolderCheckListId', localStorage.getItem('checklistId') ?? '');
    formData.append('DisplayName', file.name);
    formData.append('FolderSubCheckListId', keyId.toString());
    formData.append('File', file);
  
    try {
      const response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert('Failed to upload file.');
        return;
      }
  
      const responseData = await response.json();
  
      if (responseData && responseData.Id) {
        // ✅ Store ContentId in localStorage for future use
        localStorage.setItem('ContentId', responseData.Id.toString());
      }
  
      alert(`File uploaded successfully for Key ID: ${keyId}`);
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [keyId]: null,
      }));
  
      await fetchTabData();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };
  
  const fetchTabData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch data.');
      const data: TabData[] = await response.json();
      setTabData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const navigateToMarks = (subCheckListId: number) => {
    router.push(`/marks?subCheckListId=${subCheckListId}`);
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <button onClick={() => router.back()} className="mb-4 text-blue-500 underline">
            Go Back
          </button>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : loading ? (
            <p>Loading data...</p>
          ) : tabData && tabData.length > 0 ? (
            tabData.map((item,index) => (
              <div key={item.Key.S1Id} className="mb-4 border p-4 rounded shadow bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{item.Key.S1Name}</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={(event) => handleFileChange(item.Key.S1Id, event)}
                      className="block"
                    />
                    <button
  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  onClick={() => {
    if (s1ids && s1ids[index] !== undefined) {
      handleUpload(s1ids[index]); // Ensure index exists in s1Ids
    } else {
      console.error("Invalid s1Id or index out of range");
    }
  }}
>
  Upload
</button>

                   
                  </div>
                </div>
                {item.Key.FilePathKey && (
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigateToMarks(item.Key.S1Id)} // Pass subCheckListId dynamically
              >
                Marks
              </button>
              
                )}
                {item.Key.FilePathKey && (
                 <button
                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigateToDetails(item.Key.ContentId)} // Pass ContentId dynamically
                //onClick={() => navigateToMarks(item.Key.ContentId)} // Navigate to marks.tsx

               >
                 Detail
               </button>
                )}
              </div>
            ))
          ) : (
            <p>No data available.</p>
          )}
        </main>
      </div>
    </div>
  );
}
