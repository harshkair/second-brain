# Second Brain Backend - MongoDB Integration

This backend provides a complete MongoDB integration for storing and retrieving notes with REST API endpoints.

## Features

- ✅ **MongoDB Integration** - Full CRUD operations for notes
- ✅ **REST API** - Complete API endpoints for notes management
- ✅ **File Upload** - Image upload to Cloudinary
- ✅ **Search Integration** - Typesense search indexing
- ✅ **CORS Support** - Cross-origin requests enabled

## Database Schema

### Note Model
```javascript
{
  name: String (required),
  content: String (required),
  color: String (required),
  tag: String (optional),
  imageUrl: String (optional),
  position: {
    x: Number (default: 0),
    y: Number (default: 0)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Endpoints

### Notes API (`/notes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all notes |
| POST | `/notes` | Create a new note |
| PUT | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Delete a note |
| POST | `/notes/upload` | Upload image to Cloudinary |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/second-brain
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Testing

### Test MongoDB Connection
```bash
node test-mongo.js
```

### Test API Endpoints
```bash
node test-api.js
```

Then test the endpoints:
- Health check: `http://localhost:5001/health`
- Get notes: `http://localhost:5001/notes`
- Create note: `POST http://localhost:5001/notes`

## Example API Usage

### Create a Note
```bash
curl -X POST http://localhost:5000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Note",
    "content": "This is my note content",
    "color": "#ff6b6b",
    "tag": "important",
    "position": {"x": 100, "y": 100}
  }'
```

### Get All Notes
```bash
curl http://localhost:5000/notes
```

### Update a Note
```bash
curl -X PUT http://localhost:5000/notes/NOTE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated content"
  }'
```

### Delete a Note
```bash
curl -X DELETE http://localhost:5000/notes/NOTE_ID
```

## Database Operations

The backend supports all standard MongoDB operations:

- **Create**: `Note.create()` or `new Note().save()`
- **Read**: `Note.find()`, `Note.findById()`, `Note.findOne()`
- **Update**: `Note.findByIdAndUpdate()`, `Note.updateOne()`
- **Delete**: `Note.findByIdAndDelete()`, `Note.deleteOne()`

## Error Handling

The API includes comprehensive error handling:
- Validation errors for required fields
- Database connection errors
- File upload errors
- Search indexing errors

## Integration with Frontend

The frontend can connect to these endpoints using:
- Base URL: `http://localhost:5000`
- CORS enabled for cross-origin requests
- JSON response format

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check connection string in `index.js`
3. Verify database permissions

### API Issues
1. Check server logs for errors
2. Verify endpoint URLs
3. Ensure proper request format

### File Upload Issues
1. Verify Cloudinary credentials
2. Check file size limits
3. Ensure proper multipart form data
