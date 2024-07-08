import React from 'react';

const ProfileDisplay = ({ profile }) => {
  if (!profile) {
    return <p>No profile information available.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Company Information</h2>
      <div className="mb-4">
        <p className="text-gray-700"><strong>Company Name:</strong> {profile.company_name}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700"><strong>Address:</strong> {profile.address}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700"><strong>Contact Email:</strong> {profile.contact_email}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700"><strong>Contact Phone:</strong> {profile.contact_phone}</p>
      </div>
    </div>
  );
};

export default ProfileDisplay;
