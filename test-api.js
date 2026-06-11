// Простой тест API
const http = require('http');

// Тест регистрации
function testRegister() {
  const data = JSON.stringify({
    email: 'cyclist@test.com',
    password: 'test1234',
    name: 'Test Cyclist'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\n✅ Регистрация - Статус: ${res.statusCode}`);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('Ответ:', JSON.parse(body));
      
      // После успешной регистрации, тестируем логин
      if (res.statusCode === 201) {
        testLogin();
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Ошибка:', error.message);
  });

  req.write(data);
  req.end();
}

// Тест логина
function testLogin() {
  const data = JSON.stringify({
    email: 'cyclist@test.com',
    password: 'test1234'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\n✅ Логин - Статус: ${res.statusCode}`);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      const response = JSON.parse(body);
      console.log('Ответ:', response);
      
      // Тестируем получение профиля с токеном
      if (response.token) {
        testProfile(response.token);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Ошибка:', error.message);
  });

  req.write(data);
  req.end();
}

// Тест получения профиля
function testProfile(token) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/auth/profile',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\n✅ Профиль - Статус: ${res.statusCode}`);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('Ответ:', JSON.parse(body));
      console.log('\n🎉 Все тесты пройдены успешно!\n');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Ошибка:', error.message);
  });

  req.end();
}

// Запускаем тесты
console.log('🚴 Тестирование BikeRoutes Backend API\n');
testRegister();
