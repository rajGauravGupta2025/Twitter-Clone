import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Tweet from './Tweet';
import Base_URL from '../utils';

const MyProfileTweet = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelinetweets = await axios.get(
          `${Base_URL}/api/tweet/tweets/user/${currentUser._id}`,
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
  }, []);

  return (
    <>
      {!timeline.length > 0 ? (
        <h5 className='my-4 mx-5'>
          You have no tweets currently, Please tweet...
        </h5>
      ) : (
        timeline.map((tweet) => {
          return <Tweet key={tweet._id} tweet={tweet} setData={setTimeline} />;
        })
      )}
    </>
  );
};

export default MyProfileTweet;
