curl --request POST \
  --url http://localhost:3333/signup \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "rafa@example.com",
    "password": "securePassword123"
    }'
