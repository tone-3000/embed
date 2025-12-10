import { useState, useEffect } from 'react'
import './App.css'
import t3kLogo from './assets/t3k.svg'

// Enums
enum Gear {
  Amp = 'amp',
  FullRig = 'full-rig',
  Pedal = 'pedal',
  Outboard = 'outboard',
  Ir = 'ir'
}

enum Platform {
  Nam = 'nam',
  Ir = 'ir',
  AidaX = 'aida-x',
  AaSnapshot = 'aa-snapshot',
  Proteus = 'proteus'
}

enum License {
  T3k = 't3k',
  CcBy = 'cc-by',
  CcBySa = 'cc-by-sa',
  CcByNc = 'cc-by-nc',
  CcByNcSa = 'cc-by-nc-sa',
  CcByNd = 'cc-by-nd',
  CcByNcNd = 'cc-by-nc-nd',
  Cco = 'cco'
}

enum Size {
  Standard = 'standard',
  Lite = 'lite',
  Feather = 'feather',
  Nano = 'nano',
  Custom = 'custom'
}

// Base interfaces
interface EmbeddedUser {
  id: string;
  username: string;
  avatar_url: string | null;
  url: string;
}

interface User extends EmbeddedUser {
  bio: string | null;
  links: string[] | null;
  created_at: string;
  updated_at: string;
}

interface Make {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Tone {
  id: number;
  user_id: string;
  user: EmbeddedUser;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  gear: Gear;
  images: string[] | null;
  is_public: boolean | null;
  links: string[] | null;
  platform: Platform;
  license: License;
  sizes: Size[];
  makes: Make[];
  tags: Tag[];
  models_count: number;
  downloads_count: number;
  favorites_count: number;
  url: string;
}

interface Model {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  model_url: string;
  name: string;
  size: Size;
  tone_id: number;
}

interface ToneWithModels extends Tone {
  models: Model[];
}

interface T3kDownloadEvent {
  type: 't3k.download.tone';
  tone: ToneWithModels;
}

interface T3kCloseEmbedEvent {
  type: 't3k.close.embed';
}

function App() {
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null)
  const [selectingTone, setSelectingTone] = useState(false)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent<T3kDownloadEvent | T3kCloseEmbedEvent>) => {
      // Security check: ensure message is from expected origin if possible, 
      // but for now we'll trust the message structure.
      
      if (event.data.type === 't3k.download.tone') {
        console.log('T3kIframe received tone:', event.data.tone.title);
        const { tone } = event.data;
        setSelectedTone(tone);
        setSelectingTone(false);
      }

      if (event.data.type === 't3k.close.embed') {
        setSelectingTone(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">YOUR AWESOME APP</h1>
        <a className="t3k-api-logo-container" href="https://www.tone3000.com/api" target="_blank" rel="noopener noreferrer">
          <span>Powered by</span>
          <img src={t3kLogo} alt="T3k API Logo" className="t3k-api-logo" style={{ width: '200px', height: 'auto' }} />
        </a>
      </div>
      <div className="app-content">
        {selectingTone ? (
        <iframe src="https://www.tone3000.com/embed" className="tone-iframe" style={{ width: '100%', height: '800px' }} />
      ) : (
        <div className="select-container">
          <div className="select-form">
            <button
              onClick={() => setSelectingTone(true)}
              className="button"
            >
              Find a Tone with TONE3000
            </button>
          </div>
          {selectedTone && (
            <pre className="data-display">
              {JSON.stringify(selectedTone, null, 2)}
            </pre>
          )}
        </div>
      )}
      </div>
      
    </div>
  )
}

export default App
