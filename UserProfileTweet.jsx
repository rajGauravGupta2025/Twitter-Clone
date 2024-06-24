import { useParams } from 'react-router-dom';
import Tweet from './Tweet';
import Base_URL from '../utils';
import axios from 'axios';
import { useState, useEffect } from 'react';

const UserProfileTweet = () => {
  const { id } = useParams();

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelinetweets = await axios.get(
          `${Base_URL}/api/tweet/tweets/user/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        setTimeline(timelinetweets.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  console.log(Array.isArray(timeline));
  return (
    <>
      {timeline && timeline.length > 0
        ? console.log('map is about to start')
        : console.log('error')}
      {Array.isArray(timeline) && timeline.length > 0 ? (
        timeline.map((tweet) => {
          console.log('map started');
          return <Tweet key={tweet._id} tweet={tweet} setData={setTimeline} />;
        })
      ) : (
        <h5 className='my-4 mx-5'>No tweets found , Please tweet...</h5>
      )}
    </>
  );
};

export default UserProfileTweet;
