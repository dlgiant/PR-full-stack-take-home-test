import 'isomorphic-fetch';

export default resourceType => {
  return fetch(`localhost:3000/${resourceType}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.filter((_, idx) => idx < 10);
    });
}