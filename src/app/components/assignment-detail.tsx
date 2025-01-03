'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AssignmentDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Access the `id` parameter from the URL
  const [assignmentDetails, setAssignmentDetails] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Assignment Details</h2>
      
    </div>
  );
}
