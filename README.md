# TONE3000 Embed Integration Guide

This project demonstrates how to integrate with the TONE3000 through the *BETA* embedable.

![screenshot](https://raw.githubusercontent.com/tone-3000/t3k-api/refs/heads/main/src/assets/screenshot.png)

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

### Integration Setup

To integrate the TONE3000 embed into your application, you need to follow these steps:

#### 1. Add the Iframe

Add an iframe to your page pointing to `https://www.tone3000.com/embed`. You can control when this is displayed based on your application's state.

```tsx
<iframe 
  src="https://www.tone3000.com/embed" 
  className="tone-iframe" 
  style={{ width: '100%', height: '800px', border: 'none' }} 
/>
```

#### 2. Listen for Messages

The embed communicates with your parent window using the `window.postMessage` API. You need to set up an event listener to handle these messages.

```typescript
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    // Handle specific event types
    if (event.data.type === 't3k.download.tone') {
      const { tone } = event.data;
      console.log('Selected tone:', tone);
      // Process the tone data...
    }

    if (event.data.type === 't3k.close.embed') {
      // Handle closing the embed
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}, []);
```

#### 3. Data Structures

When a user selects a tone, you will receive a `t3k.download.tone` event containing the tone data.

**Event Interface:**
```typescript
interface T3kDownloadEvent {
  type: 't3k.download.tone';
  tone: ToneWithModels;
}

interface T3kCloseEmbedEvent {
  type: 't3k.close.embed';
}
```

**Tone Interface:**
```typescript
interface Tone {
  id: number;
  title: string;
  description: string | null;
  user: {
    username: string;
    avatar_url: string | null;
    // ...
  };
  gear: 'amp' | 'full-rig' | 'pedal' | 'outboard' | 'ir';
  platform: 'nam' | 'ir' | 'aida-x' | 'aa-snapshot' | 'proteus';
  license: string; // e.g., 'cc-by', 't3k', etc.
  models: Model[]; // Array of associated models/files
  // ... other metadata like makes, tags, counts
}

interface Model {
  id: number;
  name: string;
  model_url: string; // URL to download the model file
  size: 'standard' | 'lite' | 'feather' | 'nano' | 'custom';
  // ...
}
```
