import { Helmet } from 'react-helmet-async';
import Base_URL from '../utils';
import '../css/tweetpage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/tweetlist.css';
import Sidebar from '../components/Sidebar';
import Tweet from '../components/Tweet';

const TweetPage = () => {
  const { id } = useParams();

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  const [timeline, setTimeline] = useState([]);
  const [replies, setReplies] = useState([]);

  const fetchTweetData = async () => {
    try {
      const tweetData = await axios.get(`${Base_URL}/api/tweet/${id}`, config);
      setTimeline([...timeline, tweetData.data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTweetData();
  }, []);

  useEffect(() => {
    const fetchReplies = async () => {
      if (timeline.length > 0 && timeline[0].Replies && timeline[0].Replies?.length > 0) {
        const fetchedReplies = await Promise.all(
          timeline[0].Replies?.map(async (tweetId) => {
            const response = await axios.get(`${Base_URL}/api/tweet/${tweetId}`, config);
            return response.data;
          })
        );
        setReplies(fetchedReplies);
      }
    };

    fetchReplies();
  }, [timeline]);
  return (
    <>
      <Helmet>
        <title>Tweet details</title>
      </Helmet>
      <div className='row'>
        <div className='col-md-3 '>
          <div className='side-bar-row d-flex flex-column align-items-center justify-content-between  '>
            <Sidebar />
          </div>
        </div>

        <div className='col-md-6 second-column'>
          <div className='row my-2'>
            <div className='col-12'>
              <h5 className='ms-1'>Tweet</h5>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              {timeline.length > 0 &&
                timeline.map((tweet) => {
                  return <Tweet key={tweet._id} tweet={tweet} setData={setTimeline} />;
                })}
            </div>
          </div>
          <div className='row my-2'>
            <div className='col-12'>
              <h6 className='mb-2'>Replies</h6>
              {replies.length > 0 ? (
                replies.map((tweet) => {
                  return <Tweet key={tweet._id} tweet={tweet} setData={setReplies} />;
                })
              ) : (
                <p>No replies found.</p>
              )}
            </div>
          </div>
        </div>

        <div className='col-md-3'></div>
      </div>
    </>
  );
};

export default TweetPage;
