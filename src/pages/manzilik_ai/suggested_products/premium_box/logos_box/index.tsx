import React, { useContext, useEffect } from 'react';
import { useSimilarProductsService } from '../../useSimilarProductsService';
import Loader from 'react-spinners/ClipLoader';
import { ObjectRecognitionContext, ObjectRecognitionProps } from '../../object_recognation_context';

const LogosBox = () => {
  const { listPremiumVendors, isVendorsLoading, isFlowOne } = useContext(
    ObjectRecognitionContext
  ) as ObjectRecognitionProps;

  return (
    <div
      className="logos-container"
      style={{
        backgroundColor: isFlowOne! ? '#d5bf88' : '#b5bfc3b6',
      }}
    >
      {isFlowOne ? (
        <>
          {isVendorsLoading && listPremiumVendors.length === 0 ? (
            <Loader color="#000" loading={isVendorsLoading} size={20} />
          ) : (
            listPremiumVendors.map((vendor) => {
              return (
                <div className="logo-container" key={vendor.id}>
                  <img src={vendor?.photo!} alt="logo" />
                </div>
              );
            })
          )}
        </>
      ) : (
        <div className="photos-container">
          <div className="images-wrapper">
            <img
              src={'https://makhzan-qa.manzilik.com/media/Category/%D9%85%D8%B7%D8%A8%D8%AE.jpg'}
              alt="Product Image"
              className="right-image"
            />
            <img
              src={
                'https://makhzan-qa.manzilik.com/media/Category/%D8%BA%D8%B1%D9%81%D8%A9_%D9%85%D8%B9%D9%8A%D8%B4%D8%A9.png'
              }
              alt="Product Image"
              className="left-image"
            />
            <div className="middle-image">
              <img
                src={'https://makhzan-qa.manzilik.com/media/Category/%D8%BA%D8%B1%D9%81%D8%A9_%D9%86%D9%88%D9%85.png'}
                alt="Product Image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogosBox;
