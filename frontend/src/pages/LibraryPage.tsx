// src/pages/LibraryPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// --- DUMMY DATA ---
// In a real app, this would come from an API.
const libraryData = {
  grades: {
    'grade-4': {
      name: 'Grade 4',
      subjects: {
        mathematics: {
          name: 'Mathematics',
          board: 'IB Board',
          topics: [
            {
              id: 'numbers-operations',
              title: 'Numbers & Operations',
              icon: '🔢',
              image: 'https://i.imgur.com/2Kd4y6f.png', // Placeholder image
              points: [
                'Place value up to 6-or 7-digit numbers (depending on curriculum)',
                'Reading, writing, comparing, and ordering large numbers',
                'Rounding numbers (to nearest 10, 100, 1000)',
                'Roman numerals (sometimes included)',
              ],
            },
            {
              id: 'equivalent-fractions',
              title: 'Equivalent Fractions',
              icon: '➗',
              image: 'https://i.imgur.com/eG1h2DB.png', // Placeholder image
              description: 'Fractions that have the same value, even though they may look different',
              points: [
                'Equivalent fractions',
                'Simplifying fractions',
                'Comparing fractions and decimals',
              ],
              content: [
                 { type: 'Notes', icon: '📝', description: 'Understanding equivalent fractions', link: '#' },
                 { type: 'Video', icon: '▶️', description: 'Video lesson on equivalent fractions', link: '#' },
                 { type: 'Practice', icon: '✅', description: 'Practice problems for equivalent fractions', link: '#' },
                 { type: 'Quiz', icon: '📋', description: 'Quiz on equivalent fractions', link: '#' },
              ]
            },
          ],
        },
        science: {
          name: 'Science',
          board: 'IB Board',
          topics: [
            // Add science topics here if you want to test navigation
          ],
        },
      },
    },
  },
};


// --- STYLING ---
// All CSS for the three views is contained here.
const libraryPageStyles = `
  .library-container {
    font-family: 'Poppins', sans-serif;
    background-color: #FFFFFF;
  }
  .explore-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 1rem;
    background-color: #FCFBF9;
  }
  .explore-view h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .filters {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 64rem;
  }
  @media (min-width: 640px) { .filters { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .filters { grid-template-columns: repeat(4, 1fr); } }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .filter-group label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  .filter-select {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
  .explore-button {
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    padding: 0.75rem 2.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.3s;
  }
  .explore-button:hover { background-color: #2563eb; }
  
  .syllabus-view {
    padding: 2rem;
    max-width: 56rem;
    margin: auto;
  }
  .syllabus-view .syllabus-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 3rem;
  }
  .topic-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
    margin-bottom: 3rem;
  }
  @media (min-width: 768px) { .topic-section { grid-template-columns: 1fr 2fr; } }
  .topic-image-container {
    background-color: #f3f4f6;
    padding: 2rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .topic-image-container img { max-width: 100%; height: auto; }
  .topic-details h2 { font-size: 1.75rem; font-weight: 600; margin-bottom: 1rem; }
  .topic-details ul { list-style: disc; padding-left: 1.25rem; space-y: 0.5rem; }
  
  .content-view { padding: 2rem; max-width: 64rem; margin: auto; }
  .content-header { display: flex; align-items: center; margin-bottom: 3rem; }
  .content-header .icon-bg {
    background-color: #374151;
    color: white;
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }
  .content-header h1 { font-size: 2.25rem; font-weight: bold; }
  .content-header p { color: #4b5563; margin-top: 0.25rem; }
  .content-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }
  @media (min-width: 640px) { .content-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .content-grid { grid-template-columns: repeat(4, 1fr); } }
  
  .content-card {
    display: block;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    text-align: center;
    transition: all 0.3s;
    text-decoration: none;
    color: inherit;
  }
  .content-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: #3b82f6;
  }
  .content-card .icon { font-size: 3rem; margin-bottom: 1rem; }
  .content-card h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
  .content-card p { color: #6b7280; font-size: 0.9rem; }
`;

// --- SUB-COMPONENTS FOR EACH VIEW ---

const ExploreView = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ grade: 'grade-4', subject: 'mathematics' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExplore = () => {
    navigate(`/library/${filters.grade}/${filters.subject}`);
  };

  return (
    <div className="explore-view">
      <h1>Explore</h1>
      <div className="filters">
        <div className="filter-group">
          <label>Grade</label>
          <select name="grade" value={filters.grade} onChange={handleFilterChange} className="filter-select">
            <option value="grade-4">Grade 4</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Subject</label>
          <select name="subject" value={filters.subject} onChange={handleFilterChange} className="filter-select">
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Exam You Are Preparing For</label>
          <select className="filter-select" disabled><option>Select exam</option></select>
        </div>
        <div className="filter-group">
          <label>Education Board</label>
          <select className="filter-select" disabled><option>Select board</option></select>
        </div>
      </div>
      <button onClick={handleExplore} className="explore-button">Explore</button>
      {/* "Most Viewed Contents" section can be built out here */}
    </div>
  );
};

const SyllabusView = () => {
  const { grade, subject } = useParams<{ grade: string, subject: string }>();
  const subjectData = (libraryData.grades as any)[grade!]?.subjects[subject!];

  if (!subjectData) return <div>Content not found. <Link to="/library">Go back</Link>.</div>;

  return (
    <div className="syllabus-view">
      <h1 className="syllabus-title">{subjectData.name} ({subjectData.board})</h1>
      {subjectData.topics.map((topic: any) => (
        <div key={topic.id} className="topic-section">
          <div className="topic-image-container">
            <img src={topic.image} alt={topic.title} />
          </div>
          <div className="topic-details">
            <h2>{topic.icon} {topic.title}</h2>
            <ul>
              {topic.points.map((point: string, index: number) => (
                <li key={index}>
                  <Link to={`/library/${grade}/${subject}/${topic.id}`}>{point}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

const ContentView = () => {
  const { grade, subject, topicId } = useParams<{ grade: string, subject: string, topicId: string }>();
  const topic = (libraryData.grades as any)[grade!]?.subjects[subject!]?.topics.find((t: any) => t.id === topicId);

  if (!topic) return <div>Topic not found. <Link to={`/library/${grade}/${subject}`}>Go back</Link>.</div>;

  return (
    <div className="content-view">
      <div className="content-header">
        <div className="icon-bg">{topic.id.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </div>
      </div>
      <div className="content-grid">
        {topic.content.map((item: any) => (
          <a href={item.link} key={item.type} className="content-card" target="_blank" rel="noopener noreferrer">
            <div className="icon">{item.icon}</div>
            <h3>{item.type}</h3>
            <p>{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};


// --- MAIN LIBRARY PAGE COMPONENT (ROUTER/CONTROLLER) ---

const LibraryPage: React.FC = () => {
  const { grade, subject, topicId } = useParams();

  // This controller component decides which view to render based on the URL
  const renderContent = () => {
    if (grade && subject && topicId) {
      return <ContentView />;
    }
    if (grade && subject) {
      return <SyllabusView />;
    }
    return <ExploreView />;
  };

  return (
    <div className="library-container">
      <style>{libraryPageStyles}</style>
      {renderContent()}
    </div>
  );
};

export default LibraryPage;