import React, { useState } from 'react';

interface TranslationProps {
  text: string;
  onTranslated: (translatedText: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

const TranslationFeature: React.FC<TranslationProps> = ({ text, onTranslated }) => {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
        }),
      });
      const data = await response.json();
      onTranslated(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
    setIsTranslating(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="p-1 border rounded-md text-sm"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        className="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 disabled:bg-indigo-300"
      >
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>
    </div>
  );
};

export default TranslationFeature;