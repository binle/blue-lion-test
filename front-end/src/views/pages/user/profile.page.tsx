import { useContext } from 'react';
import { ApplicationContext } from '../../../data';
import { nonceFunction } from '../../../utils';
import { ItemDetailComponent } from '../../components';

export const ProfilePage = () => {
  const { accountInfo } = useContext(ApplicationContext);

  return (
    <ItemDetailComponent
      item={{
        fullName:
          accountInfo?.mentorInfo?.fullName ||
          accountInfo?.studentInfo?.fullName ||
          '',
        description:
          accountInfo?.mentorInfo?.description ||
          accountInfo?.studentInfo?.description ||
          '',
        extra:
          accountInfo?.mentorInfo?.extra ||
          accountInfo?.studentInfo?.extra ||
          [],
        username: accountInfo?.username || '',
      }}
      getId={() => accountInfo?.id || ''}
      onSave={nonceFunction}
      onDelete={nonceFunction}
      title="You are a student"
    ></ItemDetailComponent>
  );
};
