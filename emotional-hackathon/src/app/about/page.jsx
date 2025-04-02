import React from "react";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About MinedTALK</h1>
      <p className="text-lg text-gray-800 mb-6">
        At MinedTALK, we are dedicated to discussing the impact of mining
        activities on local communities and the environment. Our mission is to
        provide a platform where community members can share their experiences,
        raise concerns, and work together to find solutions for a sustainable
        future.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Meet the Developers
      </h2>

      <div className="">
        <p className="text-lg text-gray-800">Khushi Patel</p>
        <p className="text-lg text-gray-800">Matthew Luo</p>
        <p className="text-lg text-gray-800">Saketh Pabolu</p>
        <p className="text-lg text-gray-800">Anish Kolan</p>
      </div>

      <p className="text-lg text-gray-700 mt-8">
        MinedTALK is a registered 501(c)(3) non-profit organization.
      </p>
    </div>
  );
};

export default Page;
