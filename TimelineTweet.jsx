import Tweet from './Tweet';
import LoadingSpinner from './Spinner';
import Base_URL from '../utils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TimelineTweet = () => {
  const [timeline, setTimeline] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const timelinetweets = await axios.get(`${Base_URL}/api/tweet`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setTimeline(timelinetweets.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {timeline && timeline.length > 0 ? (
        timeline.map((tweet) => {
          return <Tweet key={tweet._id} tweet={tweet} setData={setTimeline} />;
        })
      ) : (
        <p className='my-5 mx-5 fs-3 fw-bolder'>
          No tweets currently, Please Post
        </p>
      )}
    </>
  );
};

export default TimelineTweet;
