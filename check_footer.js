const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('Kalinga Media House')) {
      console.log('FOUND KALINGA MEDIA HOUSE IN DOM');
    } else {
      console.log('KALINGA MEDIA HOUSE NOT FOUND IN DOM');
      console.log('HTML SNIPPET (last 2000 chars):');
      console.log(data.slice(-2000));
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
