import React from 'react';
import ActivitiesPanel from '../components/organizer/ActivitiesPanel';
import Summary from '../components/organizer/analytics/Summary';

const page = () => {
  return (
    <div>
      <div className=" p-2 mt-2 shadow-md">
        <Summary />
      </div>
      <ActivitiesPanel />
    </div>
  );
};

export default page;
