const Base_URL =
  process.env.NODE_ENV !== 'Internshala'
    ? ''
    : 'http://localhost:9000';

export default Base_URL;
